import type { BasesIconProps } from "./components/BasesIcon"

export interface GameData {
  copyright: string
  totalItems: number
  totalEvents: number
  totalGames: number
  totalGamesInProgress: number
  dates: DateEntry[]
}

export interface DateEntry {
  date: string
  totalItems: number
  totalEvents: number
  totalGames: number
  totalGamesInProgress: number
  games: Game[]
  events: any[] // You might want to define a more specific type for events if they are not always empty
}

export interface Venue {
  id: number
  name: string
  link: string
}

export interface ContentLink {
  link: string
}

export interface Game {
  gamePk: number
  gameGuid: string
  link: string
  gameType: string
  season: string
  gameDate: string
  officialDate: string
  status: GameStatus
  teams: GameTeams
  venue: Venue
  content: ContentLink
  isTie: boolean
  gameNumber: number
  publicFacing: boolean
  doubleHeader: string
  gamedayType: string
  tiebreaker: string
  calendarEventID: string
  seasonDisplay: string
  dayNight: string
  description: string
  scheduledInnings: number
  reverseHomeAwayStatus: boolean
  inningBreakLength: number
  gamesInSeries: number
  seriesGameNumber: number
  seriesDescription: string
  recordSource: string
  ifNecessary: string
  ifNecessaryDescription: string
}

export interface GameStatus {
  abstractGameState: string
  codedGameState: string
  detailedState: string
  statusCode: string
  startTimeTBD: boolean
  abstractGameCode: string
}

export interface GameTeams {
  away: TeamInfo
  home: TeamInfo
}

export interface TeamInfo {
  team: Team
  leagueRecord: LeagueRecord
  score: number
  isWinner: boolean
  splitSquad: boolean
  seriesNumber: number
}

export interface Team {
  id: number
  name: string
  clubName: string
  link: string
}

export interface LeagueRecord {
  wins: number
  losses: number
}

export interface ActivePlayer {
  label: string
  playerName: string
}

export type Scenario = string | Date | CurrentStatus

export interface CurrentStatus {
  inningNumber: number
  inningSide: 'top' | 'bottom' | 'mid'
  outs: number
  baseStatus?: BasesIconProps
}

export interface UIGameStatus {
  location: string
  scenario: Scenario
}

export interface UITeam {
  name: string
  isHome?: boolean
  activePlayers: ActivePlayer[]
  score?: number
  isWinner?: boolean
}

export interface GameNotification {
  marlinsAffiliate: UITeam
  opponent: UITeam
  gameStatus: UIGameStatus
}

export interface ScheduleAndResults {
  heading: string
  form: {
    currentDate: Date
  }
  scheduleList: GameNotification[]
}

interface LineScoreData {
  scheduledInnings: number
  currentInning: number
  currentInningOrdinal: string
  inningState: string
  inningHalf: string
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  teams: {
    home: { runs: number; hits: number; errors: number; leftOnBase: number }
    away: { runs: number; hits: number; errors: number; leftOnBase: number }
  }
  offense: {
    batter?: { id: number; fullName: string; link: string }
    onDeck?: { id: number; fullName: string; link: string }
    inHole?: { id: number; fullName: string; link: string }
    team: { id: number; name: string; link: string }
  }
  defense: {
    pitcher?: { id: number; fullName: string; link: string }
    catcher?: { id: number; fullName: string; link: string }
    first?: { id: number; fullName: string; link: string }
    second?: { id: number; fullName: string; link: string }
    third?: { id: number; fullName: string; link: string }
    shortstop?: { id: number; fullName: string; link: string }
    left?: { id: number; fullName: string; link: string }
    center?: { id: number; fullName: string; link: string }
    right?: { id: number; fullName: string; link: string }
    team: { id: number; name: string; link: string }
  }
}

// Player, Position, Play picked up from
// https://github.com/asbeane/mlb-stats-api/blob/master/types/
export interface Player {
    id: number;
    fullName: string;
    link: string;
    firstName?: string;
    lastName?: string;
    jerseyNumber?: string;
    position?: Position;
}

export interface Position {
    code: string;
    name: string;
    type: string;
    abbreviation: string;
}

export interface Play {
    result: {
        type: string;
        event: string;
        eventType: string;
        description: string;
        rbi: number;
        awayScore: number;
        homeScore: number;
    };
    about: {
        atBatIndex: number;
        halfInning: string;
        inning: number;
        endTime: string;
        isComplete: boolean;
        isScoringPlay: boolean;
        hasReview: boolean;
        hasOut: boolean;
        captivatingIndex: number;
    };
    count: {
        balls: number;
        strikes: number;
        outs: number;
    };
    matchup: {
        batter: Player;
        batSide: { code: string; description: string };
        pitcher: Player;
        pitchHand: { code: string; description: string };
        postOnFirst?: Player;
        postOnSecond?: Player;
        postOnThird?: Player;
    };
}

export interface LiveGameData {
  gamePk: number
  link: string
  metaData: {
    wait: number
    timeStamp: string
    gameEvents: string[]
    logicalEvents: string[]
  }
  gameData: {
    game: Record<string, any>
    datetime: Record<string, any>
    status: Record<string, any>
    teams: {
      away: Record<string, any>
      home: Record<string, any>
    }
    players: Record<string, any>
    venue: Record<string, any>
    officialVenue: Record<string, any>
    weather: Record<string, any>
    gameInfo: Record<string, any>
    review: Record<string, any>
    flags: Record<string, any>
    alerts: any[]
    probablePitchers: {
      away?: Record<string, any>
      home?: Record<string, any>
    }
    officialScorer: Record<string, any>
    primaryDatacaster: Record<string, any>
  }
  liveData: {
    plays: {
        allPlays: Play[];
        currentPlay: Play;
        scoringPlays: number[];
    };
    linescore: LineScoreData
    boxscore: Record<string, any>
    decisions?: {
      winner?: { id: number; fullName: string; link: string }
      loser?: { id: number; fullName: string; link: string }
      save?: { id: number; fullName: string; link: string }
    }
    leaders: any[]
  }
}

export interface GameWithLiveData extends Game {
  liveData?: LiveGameData
}
