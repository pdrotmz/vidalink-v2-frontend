import { Component, inject, signal } from '@angular/core';

import {
  Submission,
  ValidationStatus,
} from '../../models/submission';
import { SubmissionAdminService } from '../../services/submission-admin';

@Component({
  selector: 'app-admin-submissions',
  imports: [],
  templateUrl: './submissions.html',
  styleUrl: './submissions.scss',
})
export class Submissions {
  private readonly submissionAdminService = inject(SubmissionAdminService);

  protected readonly submissions = signal<Submission[]>([]);
  protected readonly selectedStatus = signal<ValidationStatus | 'ALL'>('ALL');

  protected readonly loading = signal(true);
  protected readonly processingId = signal<string | null>(null);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadSubmissions();
  }

  protected selectStatus(status: ValidationStatus | 'ALL'): void {
    this.selectedStatus.set(status);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (status === 'ALL') {
      this.loadSubmissions();
      return;
    }

    this.loadSubmissionsByStatus(status);
  }

  protected approve(submission: Submission): void {
    if (this.processingId()) {
      return;
    }

    this.processingId.set(submission.id);
    this.clearMessages();

    this.submissionAdminService.approve(submission.id).subscribe({
      next: () => {
        this.processingId.set(null);
        this.successMessage.set('Avaliação aprovada com sucesso.');
        this.refreshSubmissions();
      },
      error: (error) => {
        console.error('Error approving submission:', error);
        this.processingId.set(null);
        this.errorMessage.set(
          'Não foi possível aprovar a avaliação. Tente novamente.'
        );
      },
    });
  }

  protected reject(submission: Submission): void {
    if (this.processingId()) {
      return;
    }

    this.processingId.set(submission.id);
    this.clearMessages();

    this.submissionAdminService.reject(submission.id).subscribe({
      next: () => {
        this.processingId.set(null);
        this.successMessage.set('Avaliação rejeitada com sucesso.');
        this.refreshSubmissions();
      },
      error: (error) => {
        console.error('Error rejecting submission:', error);
        this.processingId.set(null);
        this.errorMessage.set(
          'Não foi possível rejeitar a avaliação. Tente novamente.'
        );
      },
    });
  }

  protected statusLabel(status: ValidationStatus): string {
    const labels: Record<ValidationStatus, string> = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovada',
      REJECTED: 'Rejeitada',
    };

    return labels[status];
  }

  protected formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  protected isProcessing(submission: Submission): boolean {
    return this.processingId() === submission.id;
  }

  private loadSubmissions(): void {
    this.loading.set(true);

    this.submissionAdminService.getAll().subscribe({
      next: (submissions) => {
        this.submissions.set(submissions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching submissions:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar as avaliações.'
        );
      },
    });
  }

  private loadSubmissionsByStatus(status: ValidationStatus): void {
    this.loading.set(true);

    this.submissionAdminService.getByStatus(status).subscribe({
      next: (submissions) => {
        this.submissions.set(submissions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching submissions by status:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Não foi possível carregar as avaliações.'
        );
      },
    });
  }

  private refreshSubmissions(): void {
    const status = this.selectedStatus();

    if (status === 'ALL') {
      this.loadSubmissions();
      return;
    }

    this.loadSubmissionsByStatus(status);
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}