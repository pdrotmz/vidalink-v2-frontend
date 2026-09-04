export type ValidationStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface Submission {
  id: string;
  idUser: string;
  sentTime: string;
  filePath: string;
  status: ValidationStatus;
  createdAt: string;
  updatedAt: string;
}