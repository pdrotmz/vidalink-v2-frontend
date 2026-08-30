import { Component, inject, signal } from '@angular/core';

import { RewardService } from '../../services/reward';
import { Reward } from '../../models/reward';

@Component({
  imports: [],
  selector: 'app-marketplace',
  styleUrl: './marketplace.scss',
  templateUrl: './marketplace.html',
})
export class Marketplace {

  private readonly rewardService = inject(RewardService);

  protected readonly rewards = signal<Reward[]>([]);

  constructor() {
    this.rewardService.getRewards().subscribe({
      next: (rewards) => {
        this.rewards.set(rewards);
      },
      error: (error) => {
        console.error('Error fetching rewards:', error);
      },
    });
  }
}