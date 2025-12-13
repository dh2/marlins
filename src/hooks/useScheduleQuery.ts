import { useQuery } from '@tanstack/react-query'
import { teamIds as defaultTeamIds, sportIds, MARLINS } from '../constants'
import type {
  GameData,
  GameNotification,
  UITeam,
  LiveGameData,
  GameWithLiveData,
} from '../types'

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

  const updatedDate = { ...scheduleData.dates[0], games: gamesWithLiveData }
  return { ...scheduleData, dates: [updatedDate] }
}

const transformScheduleData = (data: GameData, teamIds: number[]) => {
  if (!data.dates || data.dates.length === 0) {
    return []
  }

  const games = data.dates.flatMap((date) => date.games as GameWithLiveData[])

  const transformedGames = games.map((game) => {
    const marlinsAffiliateInfo = teamIds.includes(game.teams.away.team.id)
      ? game.teams.away
      : game.teams.home
    const opponentInfo = teamIds.includes(game.teams.away.team.id)
      ? game.teams.home
      : game.teams.away

    const isGameOver = game.status.abstractGameState === 'Final'

    const marlinsActivePlayers = []
    const opponentActivePlayers = []

    const decisions = game.liveData?.liveData.decisions
    const line = game.liveData?.liveData.linescore
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
    } else if (!isGameOver && line) {
      const isMarlinAtBat = teamIds.includes(line.offense.team.id)
      const batter = line.offense.batter
        ? { label: 'At Bat:', playerName: line.offense.batter.fullName }
        : undefined
      const pitcher = line.defense.pitcher
        ? { label: 'Pitcher', playerName: line.defense.pitcher.fullName }
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
      isWinner: isGameOver && marlinsAffiliateInfo.isWinner,
    }

    const opponent: UITeam = {
      name: opponentInfo.team.name,
      isHome: opponentInfo === game.teams.home,
      score: opponentInfo.score,
      activePlayers: opponentActivePlayers,
    }

    let scenario: string | Date = game.status.detailedState
    if (game.status.detailedState === 'Scheduled') {
      const gameDate = new Date(game.gameDate)
      scenario = gameDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }

    const gameStatus = {
      location: game.venue.name,
      scenario: scenario,
      link: game.link,
    }

    return {
      marlinsAffiliate,
      opponent,
      gameStatus,
      isMarlinsGame: marlinsAffiliateInfo.team.id === MARLINS,
    }
  })

  transformedGames.sort((a, b) => {
    if (a.isMarlinsGame && !b.isMarlinsGame) {
      return -1
    }
    if (!a.isMarlinsGame && b.isMarlinsGame) {
      return 1
    }
    return 0
  })

  return transformedGames as unknown as GameNotification[]
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
