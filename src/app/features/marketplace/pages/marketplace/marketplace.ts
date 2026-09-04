import { Component, inject, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';

import { DashboardService } from '../../../dashboard/services/dashboard';
import { UserPointsResponse } from '../../../dashboard/models/user-points-response';

import { RedemptionService } from '../../services/redemption';
import { RewardService } from '../../services/reward';
import { Reward } from '../../models/reward';
import { Redemption } from '../../models/redemption';

@Component({
  selector: 'app-marketplace',
  imports: [
    HlmButton,
    HlmCard,
  ],
  styleUrl: './marketplace.scss',
  templateUrl: './marketplace.html',
})
export class Marketplace {
  private readonly rewardService = inject(RewardService);
  private readonly redemptionService = inject(RedemptionService);
  private readonly dashboardService = inject(DashboardService);

  protected readonly rewards = signal<Reward[]>([]);
  protected readonly points = signal<UserPointsResponse | null>(null);

  protected readonly loading = signal(true);
  protected readonly redeemingRewardId = signal<string | null>(null);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly imageUrls = signal<Record<string, string>>({});

  constructor() {
    this.loadMarketplace();
  }

  private loadMarketplace(): void {
    this.rewardService.getRewards().subscribe({
      next: (rewards) => {
        this.rewards.set(rewards);
        this.loading.set(false);

        this.loadRewardImages(rewards);
      },
      error: (error) => {
        console.error('Error fetching rewards:', error);

        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar as recompensas.'
        );
      },
    });

    this.dashboardService.getPoints().subscribe({
      next: (points) => {
        this.points.set(points);
      },
      error: (error) => {
        console.error('Error fetching user points:', error);
      },
    });
  }

  private loadRewardImages(rewards: Reward[]): void {
    rewards.forEach((reward) => {
      if (!reward.image) {
        return;
      }

      this.rewardService.getRewardImage(reward.id).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);

          this.imageUrls.update((urls) => ({
            ...urls,
            [reward.id]: url,
          }));
        },
        error: (error) => {
          console.error(
            `Error fetching image for reward ${reward.id}:`,
            error
          );
        },
      });
    });
  }

  protected redeem(reward: Reward): void {
    if (this.redeemingRewardId()) {
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.redeemingRewardId.set(reward.id);

    const request = {
      idReward: reward.id,
      quantity: 1,
    };

    this.redemptionService.redeem(request).subscribe({
      next: (redemption: Redemption) => {
        this.redeemingRewardId.set(null);

        this.successMessage.set(
          `"${reward.name}" resgatado com sucesso!`
        );

        this.refreshPoints();
      },
      error: (error) => {
        console.error('Error redeeming reward:', error);

        this.redeemingRewardId.set(null);

        this.errorMessage.set(
          'Não foi possível realizar o resgate. Verifique seus pontos e tente novamente.'
        );
      },
    });
  }

  private refreshPoints(): void {
    this.dashboardService.getPoints().subscribe({
      next: (points) => {
        this.points.set(points);
      },
      error: (error) => {
        console.error('Error refreshing points:', error);
      },
    });
  }
}