import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';

import { TokenStorageService } from '../../../auth/services/token-storage';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.tokenStorage.remove();
    this.router.navigate(['/login']);
  }
}