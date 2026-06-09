/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Riddle {
  id: string;
  question: string;
  answer: string;
  hints: string[];
}

export interface GuessWord {
  id: string;
  category: string;
  word: string;
  hints: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface GameHistoryEntry {
  date: string;
  mode: string;
  score: number;
}

export interface UserStats {
  totalGames: number;
  highestScore: number;
  totalCorrect: number;
  totalQuestions: number;
  lastPlayedMode: string | null;
}

export interface UserSettings {
  darkMode: boolean;
  soundEnabled: boolean;
}

export interface GameState {
  score: number;
  streak: number;
  playerName: string;
  mode: 'MENU' | 'SCRAMBLE' | 'RIDDLE' | 'GUESS' | 'QUIZ' | 'PROFILE' | 'SETTINGS' | 'HISTORY';
  history: GameHistoryEntry[];
  stats: UserStats;
  settings: UserSettings;
}
