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

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
  ],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email,
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
    ]],

    cpf: ['', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]],
  });

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: 'true',
          },
        });
      },

      error: (error) => {
        console.error('Registration failed:', error);

        this.serverError.set(
          'Não foi possível criar sua conta. Verifique os dados e tente novamente.'
        );

        this.loading.set(false);
      },
    });
  }
}