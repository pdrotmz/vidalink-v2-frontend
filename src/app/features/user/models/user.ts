export type UserRole = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}