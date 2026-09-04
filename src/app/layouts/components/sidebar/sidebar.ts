import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { HlmButton } from '@spartan-ng/helm/button';

import { TokenStorageService } from '../../../features/auth/services/token-storage';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    HlmButton,
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {

  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.tokenStorage.remove();
    this.router.navigate(['/login']);
  }
}