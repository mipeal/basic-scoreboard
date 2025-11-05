export interface CTFDConfig {
  instanceUrl: string;
  apiKey: string;
}

export interface CTFDUser {
  id: number;
  name: string;
  score: number;
  place?: number;
  oauth_id: string | null;
  country?: string;
  affiliation?: string;
  website?: string;
  bracket?: string;
  hidden: boolean;
  banned: boolean;
}

export interface CTFDChallenge {
  id: number;
  name: string;
  category: string;
  value: number;
  description: string;
  max_attempts: number | null;
  state: 'visible' | 'hidden';
  type: string;
  solves: number;
  solved_by_me?: boolean;
  first_blood?: number | null;
}

export interface CTFDSolve {
  id: number;
  challenge_id: number;
  challenge: {
    id: number;
    name: string;
    category: string;
    value: number;
  };
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  team_id: number | null;
  date: string;
  type: string;
}

export interface CTFDSubmission {
  id: number;
  challenge_id: number;
  challenge: string | {
    id: number;
    name: string;
    category?: string;
    value?: number;
  };
  user_id: number;
  user: string | {
    id: number;
    name: string;
  };
  team_id: number | null;
  date: string;
  type: 'correct' | 'incorrect';
  provided: string;
}

export interface ScoreboardEntry {
  pos: number;
  account_id: number;
  account_url: string;
  account_type: string;
  oauth_id: number | null;
  name: string;
  score: number;
  members?: any[];
}

export interface FirstBloodEvent {
  id: string;
  challengeId: number;
  challengeName: string;
  category: string;
  userId: number;
  userName: string;
  timestamp: string;
  value: number;
}

export interface RankChange {
  userId: number;
  userName: string;
  oldRank: number;
  newRank: number;
  timestamp: string;
}

export interface EventNotification {
  id: string;
  type: 'first_blood' | 'rank_change' | 'top1_change';
  timestamp: string;
  read: boolean;
  data: FirstBloodEvent | RankChange | any;
}
