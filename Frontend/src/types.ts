export interface Option {
  id: number;
  title: string;
}

export interface PublicProblem {
  id: string;
  title: string;
  description: string;
  image?: string;
  startTime: number;
  options: Option[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
}

export type QuizState =
  | { type: "not_started" }
  | { type: "question"; problem: PublicProblem }
  | { type: "leaderboard"; leaderboard: LeaderboardEntry[] }
  | { type: "ended"; leaderboard: LeaderboardEntry[] };
