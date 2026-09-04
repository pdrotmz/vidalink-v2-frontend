import { Component, inject, signal } from '@angular/core';
import { UserAdminService } from '../../../user/services/user-admin';
import { User } from '../../../user/models/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly userAdminService = inject(UserAdminService);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly searchTerm = signal('');

  constructor() {
    this.loadUsers();
  }

  protected filteredUsers(): User[] {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.users();
    }

    return this.users().filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cpf.includes(term)
    );
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected roleLabel(role: User['role']): string {
    return role === 'ADMIN' ? 'Administrador' : 'Cliente';
  }

  protected formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(date));
  }

  protected trackByUserId(_: number, user: User): string {
    return user.id;
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.userAdminService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar os usuários. Tente novamente.',
        );
      },
    });
  }
}