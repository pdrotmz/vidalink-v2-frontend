import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

import { AuthService } from '../../services/auth';
import { TokenStorageService } from '../../services/token-storage';
import { UserService } from '../../../user/services/user';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.tokenStorage.save(response.token);

        this.userService.getMe().subscribe({
          next: (user) => {
            if (user.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            console.error('Failed to fetch current user', error);
            this.tokenStorage.remove();
            this.serverError.set(
              'Não foi possível carregar os dados do usuário.',
            );
            this.loading.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Failed to login', error);
        this.serverError.set('Email ou senha inválidos.');
        this.loading.set(false);
      },
    });
  }
}