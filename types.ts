
export enum AlertCategory {
  SECURITY = 'SECURITY',
  OPPORTUNITY = 'OPPORTUNITY',
  PROGRESS = 'PROGRESS',
  EDUCATION = 'EDUCATION'
}

export interface FinancialAlert {
  id: string;
  category: AlertCategory;
  title: string;
  description: string;
  actions: { label: string; value: string }[];
}

export interface UserStats {
  accessibleMoney: {
    bank1: number;
    bank2: number;
    physical: number;
  };
  investments: {
    savings: number;
    tesouro: number;
    stocks: number;
    others: number;
  };
  confidenceScore: {
    clarity: number;
    consistency: number;
    diversification: number;
    progress: number;
    education: number;
    total: number;
  };
  streak: number;
  trainingHistory: string[];
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  stats: UserStats;
}

export type TrainingStep = 
  | 'WELCOME'
  | 'STARTING_POINT'
  | 'TREASURE_MAP_A'
  | 'TREASURE_MAP_B'
  | 'PHOTO_SUMMARY'
  | 'AI_DISCOVERY'
  | 'MISSION_COMPLETE';

export type ChallengeStep = 
  | 'INTRO'
  | 'SCENARIO'
  | 'CHOICE'
  | 'RESULT'
  | 'REWARD';

export type AuthStep = 'LOGIN' | 'REGISTER' | 'RECOVERY';

export type Theme = 'light' | 'dark';

export type View = 'dashboard' | 'settings';
