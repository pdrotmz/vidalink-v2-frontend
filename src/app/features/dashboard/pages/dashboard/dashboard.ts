import { Component, inject, signal } from '@angular/core';

import { DashboardService } from '../../services/dashboard';
import { UserPointsResponse } from '../../models/user-points-response';
import { UserLevelResponse } from '../../models/user-level-response';
import { UserBadgeResponse } from '../../models/user-badge-response';
import { PointTransactionResponse } from '../../models/point-transaction-response';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  private readonly dashboardService = inject(DashboardService);

  protected readonly points = signal<UserPointsResponse | null>(null);
  protected readonly level = signal<UserLevelResponse | null>(null);
  protected readonly badges = signal<UserBadgeResponse[]>([]);
  protected readonly transactions = signal<PointTransactionResponse[]>([]);

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.getPoints().subscribe({
      next: (points) => {
        this.points.set(points);
      },
    });

    this.dashboardService.getLevel().subscribe({
      next: (level) => {
        this.level.set(level);
      },
    });

    this.dashboardService.getBadges().subscribe({
      next: (badges) => {
        this.badges.set(badges);
      },
    });

    this.dashboardService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
      },
    });
  }
}