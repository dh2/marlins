// Admittedly, the useFakeGame for showing a "live" game is getting a little hairy as I discover
// a lot of the data is repeated from gameData/LiveData/LineData
//  the need for the incremental update is quite obvious as the payloads can get quite enormous
//  I also noticed there is a "fields" param that can be sent along with the query string, but it
// was not immediately obvious which keys were allowed to potentially shrink the payload to just
// what is needed

import * as gameData from '../../data/fake-live-game-response.json';
import type {
  Game,
  GameWithLiveData,
  LiveGameData,
  Play,
  Player,
} from '@/types';

const fakeGame: Game = {
  gamePk: 0,
  gameGuid: '00625010-2e97-49ae-a9db-b62f1f8aabe4',
  link: '/api/v1.1/game/0/feed/live',
  gameType: 'S',
  season: '2025',
  gameDate: '2025-03-01T23:05:00Z',
  officialDate: '2025-03-01',
  description: 'A fake game Damian Made up',
  status: {
    abstractGameState: 'Live',
    codedGameState: 'L',
    detailedState: 'FakeLive',
    statusCode: 'L',
    startTimeTBD: false,
    abstractGameCode: 'L',
  },
  teams: {
    away: {
      team: {
        id: 146,
        name: 'Fake City Marlins',
        clubName: 'Fake City Marlins',
        link: '/api/v1/teams/146',
      },
      leagueRecord: {
        wins: 100,
        losses: 2,
      },
      score: 2,
      isWinner: false,
      splitSquad: false,
      seriesNumber: 8,
    },
    home: {
      team: {
        id: 120,
        name: 'Washington Fictionals',
        link: '/api/v1/teams/120',
        clubName: 'Nationals',
      },
      leagueRecord: {
        wins: 4,
        losses: 4,
      },
      score: 2,
      isWinner: false,
      splitSquad: true,
      seriesNumber: 7,
    },
  },
  venue: {
    id: 5000,
    name: 'Fakey Fieldhouse Venue',
    link: '/api/v1/venues/5000',
  },
  content: {
    link: '/api/v1/game/778730/content',
  },
  isTie: false,
  gameNumber: 1,
  publicFacing: true,
  doubleHeader: 'N',
  gamedayType: 'Y',
  tiebreaker: 'N',
  calendarEventID: '14-778730-2025-03-01',
  seasonDisplay: '2025',
  dayNight: 'night',
  scheduledInnings: 9,
  reverseHomeAwayStatus: false,
  inningBreakLength: 120,
  gamesInSeries: 1,
  seriesGameNumber: 1,
  seriesDescription: 'Spring Training',
  recordSource: 'S',
  ifNecessary: 'N',
  ifNecessaryDescription: 'Normal Game',
};

const guyOnBase: Player = {
  id: 12345,
  fullName: 'Basewell Stoler',
  link: '/api/v1/people/669622',
};
function generatePlayParts(): Partial<Play> {
  const balls = Math.floor(Math.random() * 3);
  const strikes = Math.floor(Math.random() * 2);
  const outs = Math.floor(Math.random() * 2);
  const play: Partial<Play> = {
    about: {
      atBatIndex: 64,
      halfInning: 'top',
      inning: Math.floor(Math.random() * 7) + 1,
      endTime: '2025-07-19T22:21:08.127Z',
      isComplete: true,
      isScoringPlay: false,
      hasReview: false,
      hasOut: true,
      captivatingIndex: 0,
    },
    count: {
      balls,
      strikes,
      outs,
    },
    matchup: {
      batter: {
        id: 672580,
        fullName: 'Batter McSwingerson',
        link: '/api/v1/people/672580',
      },
      batSide: {
        code: 'R',
        description: 'Right',
      },
      pitcher: {
        id: 669622,
        fullName: 'Blaze Throwerton',
        link: '/api/v1/people/669622',
      },
      pitchHand: {
        code: 'R',
        description: 'Right',
      },
      postOnFirst: Math.random() > 0.25 ? guyOnBase : undefined,
      postOnSecond: Math.random() > 0.5 ? guyOnBase : undefined,
      postOnThird: Math.random() > 0.75 ? guyOnBase : undefined,
    },
  };
  return play;
}

export function useFakeGame(gameDate: string): GameWithLiveData {
  const date = new Date(gameDate).toLocaleDateString('en-US');
  const data = gameData as unknown as LiveGameData;
  data.gameData.datetime = {
    dateTime: `${date}T11:11:00Z`,
    originalDate: date,
    officialDate: date,
    dayNight: 'day',
    time: '11:11',
    ampm: 'AM',
  };
  data.gameData.teams.away.name = 'Fake City LiveGames';
  data.gameData.status = {
    abstractGameState: 'Live',
    codedGameState: 'L',
    detailedState: 'FakeLive',
    statusCode: 'L',
    startTimeTBD: false,
    abstractGameCode: 'L',
  };
  data.gameData.venue.name = 'Fakery Park Field House';
  data.liveData.plays.currentPlay = {
    ...data.liveData.plays.currentPlay,
    ...generatePlayParts(),
  };
  return { ...fakeGame, liveData: data };
}
