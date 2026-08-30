import { PointTransactionSource } from "./point-transaction-source";
import { PointTransactionType } from "./point-transaction-type";

export interface PointTransactionResponse {
  id: string;
  userId: string;
  amount: number;
  type: PointTransactionType;
  source: PointTransactionSource;
}