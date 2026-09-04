import { Component, inject, signal } from '@angular/core';

import { HlmCard } from '@spartan-ng/helm/card';

import { DashboardService } from '../../services/dashboard';

import { UserPointsResponse } from '../../models/user-points-response';
import { UserLevelResponse } from '../../models/user-level-response';
import { UserBadgeResponse } from '../../models/user-badge-response';
import { PointTransactionResponse } from '../../models/point-transaction-response';
import { Level } from '../../models/level';

@Component({
  selector: 'app-dashboard',
  imports: [HlmCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  protected readonly points = signal<UserPointsResponse | null>(null);
  protected readonly level = signal<UserLevelResponse | null>(null);
  protected readonly badges = signal<UserBadgeResponse[]>([]);
  protected readonly transactions = signal<PointTransactionResponse[]>([]);

  private readonly levelThresholds: Record<Level, number> = {
    BEGINNER: 0,
    CONTRIBUTOR: 500,
    ADVANCED: 1000,
    EXPERT: 2000,
    MASTER: 5000,
  };

  private readonly levels: Level[] = [
    'BEGINNER',
    'CONTRIBUTOR',
    'ADVANCED',
    'EXPERT',
    'MASTER',
  ];

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

  protected levelProgress(): number {
    const currentLevel = this.level();

    if (!currentLevel) {
      return 0;
    }

    const nextLevel = this.nextLevel();

    if (!nextLevel) {
      return 100;
    }

    const currentPoints =
      this.levelThresholds[currentLevel.level];

    const nextPoints =
      this.levelThresholds[nextLevel];

    const progress =
      ((currentLevel.totalPoints - currentPoints) /
        (nextPoints - currentPoints)) * 100;

    return Math.min(100, Math.max(0, progress));
  }

  protected nextLevel(): Level | null {
    const currentLevel = this.level()?.level;

    if (!currentLevel || currentLevel === 'MASTER') {
      return null;
    }

    const currentIndex = this.levels.indexOf(currentLevel);

    return this.levels[currentIndex + 1] ?? null;
  }

  protected nextLevelPoints(): number | null {
    const nextLevel = this.nextLevel();

    if (!nextLevel) {
      return null;
    }

    return this.levelThresholds[nextLevel];
  }

  protected pointsToNextLevel(): number {
    const currentLevel = this.level();
    const nextPoints = this.nextLevelPoints();

    if (!currentLevel || nextPoints === null) {
      return 0;
    }

    return Math.max(0, nextPoints - currentLevel.totalPoints);
  }

  protected levelLabel(level: Level): string {
    const labels: Record<Level, string> = {
      BEGINNER: 'Iniciante',
      CONTRIBUTOR: 'Colaborador',
      ADVANCED: 'Avançado',
      EXPERT: 'Especialista',
      MASTER: 'Mestre',
    };

    return labels[level];
  }

  protected badgeLabel(badge: string): string {
    const labels: Record<string, string> = {
      FIRST_CONTRIBUTION: 'Primeira contribuição',
      CONTRIBUTOR: 'Colaborador',
      POINT_COLLECTOR: 'Coletor de pontos',
    };

    return labels[badge] ?? badge;
  }

  protected transactionDescription(
    transaction: PointTransactionResponse,
  ): string {
    if (transaction.source === 'ASSESSMENT') {
      return transaction.type === 'CREDIT'
        ? 'Avaliação aprovada'
        : 'Ajuste de avaliação';
    }

    if (transaction.source === 'MARKETPLACE') {
      return 'Resgate de recompensa';
    }

    return 'Transação de pontos';
  }

  protected formatTransactionDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  protected transactionAmount(
    transaction: PointTransactionResponse,
  ): string {
    return transaction.type === 'CREDIT'
      ? `+${transaction.amount}`
      : `-${transaction.amount}`;
  }
}