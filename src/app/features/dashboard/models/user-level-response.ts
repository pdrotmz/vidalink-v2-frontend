import { Level } from './level';

export interface UserLevelResponse {
  userId: string;
  level: Level;
  totalPoints: number;
}