export interface Submission {
  id: string;
  idUser: string;
  sentTime: string;
  filePath: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}