import { Badge } from "./badge";

export interface UserBadgeResponse {
  id: string;
  userId: string;
  badge: Badge;
  earnedAt: string;
}