import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Reward } from '../../models/reward';
import { RewardAdminService } from '../../services/reward-admin.ts';

@Component({
  selector: 'app-rewards',
  imports: [ReactiveFormsModule],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards implements OnDestroy {
  private readonly rewardAdminService = inject(RewardAdminService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly rewards = signal<Reward[]>([]);
  protected readonly imageUrls = signal<Record<string, string>>({});
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showCreateForm = signal(false);
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly creating = signal(false);
  protected readonly editingReward = signal<Reward | null>(null);
  protected readonly updating = signal(false);
  protected readonly deactivatingId = signal<string | null>(null);
  protected readonly updatingImage = signal(false);

  protected readonly rewardForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    pointCost: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.loadRewards();
  }

  protected openCreateForm(): void {
    this.rewardForm.reset({
      name: '',
      description: '',
      pointCost: 0,
      stock: 0,
    });

    this.selectedImage.set(null);
    this.errorMessage.set(null);
    this.showCreateForm.set(true);
    this.editingReward.set(null);
  }

  protected closeCreateForm(): void {
    if (this.creating() || this.updating() || this.updatingImage()) {
      return;
    }

    this.showCreateForm.set(false);
    this.editingReward.set(null);
  }

  protected openEditForm(reward: Reward): void {
  this.editingReward.set(reward);
  this.selectedImage.set(null);
  this.errorMessage.set(null);

  this.rewardForm.reset({
    name: reward.name,
    description: reward.description,
    pointCost: reward.pointCost,
    stock: reward.stock,
  });

    this.showCreateForm.set(true);
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedImage.set(file);
  }

  protected createReward(): void {
    if (this.rewardForm.invalid || !this.selectedImage()) {
      this.rewardForm.markAllAsTouched();

      if (!this.selectedImage()) {
        this.errorMessage.set('Selecione uma imagem para a recompensa.');
      }

      return;
    }

    this.creating.set(true);
    this.errorMessage.set(null);

    const formValue = this.rewardForm.getRawValue();
    const image = this.selectedImage()!;

    this.rewardAdminService.create(
      {
        name: formValue.name,
        description: formValue.description,
        pointCost: formValue.pointCost,
        stock: formValue.stock,
      },
      image,
    ).subscribe({
      next: (reward) => {
        this.rewards.update((rewards) => [
          reward,
          ...rewards,
        ]);

        this.creating.set(false);
        this.showCreateForm.set(false);
      },
      error: (error) => {
        console.error('Error creating reward:', error);
        this.creating.set(false);
        this.errorMessage.set(
          'Não foi possível criar a recompensa. Tente novamente.',
        );
      },
    });
  }

  protected imageUrl(reward: Reward): string {
    return this.imageUrls()[reward.id] ?? '';
  }

  protected statusLabel(reward: Reward): string {
    return reward.isActive ? 'Ativa' : 'Inativa';
  }

  private loadRewards(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.rewardAdminService.getAll().subscribe({
      next: (rewards) => {
        this.rewards.set(rewards);
        this.loading.set(false);

        rewards.forEach((reward) => {
          this.rewardAdminService.getImage(reward.id).subscribe({
            next: (blob) => {
              const imageUrl = URL.createObjectURL(blob);

              this.imageUrls.update((urls) => ({
                ...urls,
                [reward.id]: imageUrl,
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
      },
      error: (error) => {
        console.error('Error fetching rewards:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar as recompensas.',
        );
      },
    });
  }

  protected updateReward(): void {
  const reward = this.editingReward();

  if (!reward || this.rewardForm.invalid) {
    this.rewardForm.markAllAsTouched();
    return;
  }

  this.updating.set(true);
  this.errorMessage.set(null);

  const formValue = this.rewardForm.getRawValue();

  this.rewardAdminService.update(reward.id, {
    name: formValue.name,
    description: formValue.description,
    stock: formValue.stock,
  }).subscribe({
    next: (updatedReward) => {
      this.rewards.update((rewards) =>
        rewards.map((item) =>
          item.id === updatedReward.id ? updatedReward : item
        )
      );

      this.updating.set(false);
      this.editingReward.set(null);
      this.showCreateForm.set(false);
    },
    error: (error) => {
      console.error('Error updating reward:', error);
      this.updating.set(false);
      this.errorMessage.set(
        'Não foi possível atualizar a recompensa. Tente novamente.',
      );
    },
  });
}

  protected updateRewardImage(): void {
    const reward = this.editingReward();
    const image = this.selectedImage();

    if (!reward || !image || this.updatingImage()) {
      return;
    }

    this.updatingImage.set(true);
    this.errorMessage.set(null);

    this.rewardAdminService.updateImage(reward.id, image).subscribe({
      next: (updatedReward) => {
        this.rewards.update((rewards) =>
          rewards.map((item) =>
            item.id === updatedReward.id ? updatedReward : item
          )
        );

        this.updatingImage.set(false);
        this.selectedImage.set(null);

        const oldImageUrl = this.imageUrls()[reward.id];

        if (oldImageUrl) {
          URL.revokeObjectURL(oldImageUrl);
        }

        this.rewardAdminService.getImage(reward.id).subscribe({
          next: (blob) => {
            const imageUrl = URL.createObjectURL(blob);

            this.imageUrls.update((urls) => ({
              ...urls,
              [reward.id]: imageUrl,
            }));
          },
          error: (error) => {
            console.error('Error refreshing reward image:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error updating reward image:', error);
        this.updatingImage.set(false);
        this.errorMessage.set(
          'Não foi possível atualizar a imagem. Tente novamente.',
        );
      },
    });
  }

  protected deactivateReward(reward: Reward): void {
    if (!reward.isActive || this.deactivatingId()) {
      return;
    }

    this.deactivatingId.set(reward.id);
    this.errorMessage.set(null);

    this.rewardAdminService.deactivate(reward.id).subscribe({
      next: () => {
        this.rewards.update((rewards) =>
          rewards.map((item) =>
            item.id === reward.id
              ? { ...item, isActive: false }
              : item
          )
        );

        this.deactivatingId.set(null);
      },
      error: (error) => {
        console.error('Error deactivating reward:', error);
        this.deactivatingId.set(null);
        this.errorMessage.set(
          'Não foi possível desativar a recompensa. Tente novamente.',
        );
      },
    });
  }

  ngOnDestroy(): void {
  Object.values(this.imageUrls()).forEach((url) => {
    URL.revokeObjectURL(url);
  });
}
}