import { Component, inject, signal } from '@angular/core';

import { HlmCard } from '@spartan-ng/helm/card';

import { UserService } from '../../services/user';
import { UserMeResponse } from '../../models/user-me-response';

@Component({
  selector: 'app-profile',
  imports: [HlmCard],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly userService = inject(UserService);

  protected readonly user = signal<UserMeResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadUser();
  }

  protected roleLabel(role: UserMeResponse['role']): string {
    return role === 'ADMIN' ? 'Administrador' : 'Cliente';
  }

  private loadUser(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar seus dados. Tente novamente.',
        );
      },
    });
  }
}