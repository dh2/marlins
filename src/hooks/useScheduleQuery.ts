import { useQuery } from '@tanstack/react-query'
import { teamIds as defaultTeamIds, sportIds, MARLINS } from '../constants'
import type {
  GameData,
  GameNotification,
  UITeam,
  LiveGameData,
  GameWithLiveData,
  UIGameStatus,
  Scenario,
} from '../types'
import { useFakeGame } from './useFakeGame'

const fetchScheduleAndLiveData = async (teamIds: number[], date: string) => {
  const teamParams = teamIds.map((id) => `teamId=${id}`).join('&')
  const sportParams = sportIds.map((id) => `sportId=${id}`).join('&')
  const url = `https://statsapi.mlb.com/api/v1/schedule?${teamParams}&${sportParams}&date=${date}&hydrate=team`

  const scheduleResponse = await fetch(url)
  if (!scheduleResponse.ok) {
    throw new Error('Network response was not ok')
  }
  const scheduleData = (await scheduleResponse.json()) as GameData

  if (!scheduleData.dates || scheduleData.dates.length === 0) {
    return { ...scheduleData, dates: [] }
  }

  const gamesWithLiveData: GameWithLiveData[] = await Promise.all(
    scheduleData.dates[0].games.map(async (game) => {
      try {
        // I believe there is a diffPatch (from API docs that I was able to locate from an old hackathon)
        // that can go along with this end point to mitigate the amount of data that comes back
        // at the time of building this app there were no live games to verify or validate this process to limit the payload to only
        // what has changed
        const liveDataResponse = await fetch(
          `https://statsapi.mlb.com${game.link}`,
        )
        if (!liveDataResponse.ok) {
          return game // return game without live data if fetch fails
        }
        const liveData = (await liveDataResponse.json()) as LiveGameData
        return { ...game, liveData }
      } catch (error) {
        console.error(
          `Failed to fetch live data for game ${game.gamePk}`,
          error,
        )
        return game // return game without live data on error
      }
    }),
  )

  // Create random game scenarios for inning, outs, balls and strikes
  const fakeGame = useFakeGame(new Date(date))
  gamesWithLiveData.push(fakeGame)
  const updatedDate = { ...scheduleData.dates[0], games: gamesWithLiveData }
  return { ...scheduleData, dates: [updatedDate] }
}

const transformScheduleData = (
  data: GameData,
  teamIds: number[],
): GameNotification[] => {
  if (!data.dates || data.dates.length === 0) {
    return []
  }

  const games = data.dates.flatMap((date) => date.games as GameWithLiveData[])

  const transformedGames = games.map(
    (game): { game: GameNotification; isMarlinsGame: boolean } => {
      const areMarlinsAtHome = teamIds.includes(game.teams.home.team.id)
      const marlinsAffiliateInfo = !areMarlinsAtHome
        ? game.teams.away
        : game.teams.home
      const opponentInfo = !areMarlinsAtHome ? game.teams.home : game.teams.away

      const isGameOver = game.status.abstractGameState === 'Final'

      const marlinsActivePlayers = []
      const opponentActivePlayers = []

      const decisions = game.liveData?.liveData.decisions
      const currentPlay = game.liveData?.liveData.plays.currentPlay
      if (isGameOver && decisions) {
        const winner = decisions.winner
          ? { label: 'WP', playerName: decisions.winner.fullName }
          : undefined
        const loser = decisions.loser
          ? { label: 'LP', playerName: decisions.loser.fullName }
          : undefined
        const save = decisions.save
          ? { label: 'SV', playerName: decisions.save.fullName }
          : undefined

        if (marlinsAffiliateInfo.isWinner) {
          if (winner) marlinsActivePlayers.push(winner)
          if (save) marlinsActivePlayers.push(save)
          if (loser) opponentActivePlayers.push(loser)
        } else {
          if (winner) opponentActivePlayers.push(winner)
          if (save) opponentActivePlayers.push(save)
          if (loser) marlinsActivePlayers.push(loser)
        }
      } else if (!isGameOver && currentPlay) {
        const isMarlinAtBat = areMarlinsAtHome
          ? currentPlay.about.halfInning === 'top'
          : currentPlay.about.halfInning === 'bottom'
        const batter = currentPlay.matchup.batter.fullName
          ? {
              label: 'At Bat:',
              playerName: `${currentPlay.matchup.batter.fullName} (${currentPlay.count.balls}-${currentPlay.count.strikes})`,
            }
          : undefined
        const pitcher = currentPlay.matchup.pitcher
          ? {
              label: 'Pitcher',
              playerName: currentPlay.matchup.pitcher.fullName,
            }
          : undefined

        if (isMarlinAtBat) {
          if (batter) marlinsActivePlayers.push(batter)
          if (pitcher) opponentActivePlayers.push(pitcher)
        } else {
          if (batter) opponentActivePlayers.push(batter)
          if (pitcher) marlinsActivePlayers.push(pitcher)
        }
      }

      const marlinsAffiliate: UITeam = {
        name: marlinsAffiliateInfo.team.name,
        activePlayers: marlinsActivePlayers,
        score: marlinsAffiliateInfo.score,
        isWinner: isGameOver ? marlinsAffiliateInfo.isWinner : undefined,
      }

      const opponent: UITeam = {
        name: opponentInfo.team.name,
        isHome: opponentInfo === game.teams.home,
        score: opponentInfo.score,
        activePlayers: opponentActivePlayers,
      }

      let scenario: Scenario = game.status.detailedState
      if (game.status.detailedState === 'Scheduled') {
        const gameDate = new Date(game.gameDate)
        scenario = gameDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      } else if (!isGameOver && currentPlay) {
        // unclear what the state of a "Live game is" since I will be fudging that data
        // I am just going to check for Not "Scheduled/Final" we will assume "live"
        scenario = {
          inningNumber: currentPlay.about.inning,
          inningSide: currentPlay.about.halfInning === 'top' ? 'top' : 'bottom',
          outs: currentPlay.count.outs,
          baseStatus: {
            onFirst: !!currentPlay?.matchup.postOnFirst,
            onSecond: !!currentPlay?.matchup.postOnSecond,
            onThird: !!currentPlay?.matchup.postOnThird,
          },
        }
      }

      const gameStatus: UIGameStatus = {
        location: game.venue.name,
        scenario,
      }

      return {
        game: { marlinsAffiliate, opponent, gameStatus },
        isMarlinsGame: marlinsAffiliateInfo.team.id === MARLINS,
      }
    },
  )

  transformedGames.sort((a, b) => {
    if (a.isMarlinsGame && !b.isMarlinsGame) {
      return -1
    }
    if (!a.isMarlinsGame && b.isMarlinsGame) {
      return 1
    }
    return 0
  })

  return transformedGames.map(({ game }) => game)
}

export const useScheduleQuery = (
  date: string,
  teamIds: number[] = defaultTeamIds,
) => {
  return useQuery({
    queryKey: ['schedule', teamIds, date],
    queryFn: () => fetchScheduleAndLiveData(teamIds, date),
    select: (data) => transformScheduleData(data, teamIds),
  })
}
