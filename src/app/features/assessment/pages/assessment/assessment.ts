import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';

import { Assessment } from '../../services/assessment';
import { Submission } from '../../models/submission';
import { UserService } from '../../../user/services/user';

@Component({
  selector: 'app-assessment',
  imports: [DatePipe, HlmBadge, HlmButton, HlmCard],
  templateUrl: './assessment.html',
  styleUrl: './assessment.scss',
})
export class AssessmentPage {

  private readonly assessmentService = inject(Assessment);
  private readonly userService = inject(UserService);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly submission = signal<Submission | null>(null);
  protected readonly submissions = signal<Submission[]>([]);
  protected readonly loading = signal(false);
  protected readonly loadingSubmissions = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadSubmissions();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.error.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      this.selectedFile.set(null);
      this.error.set('Selecione um arquivo PDF.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      this.selectedFile.set(null);
      this.error.set('O arquivo deve ter no máximo 3 MB.');
      return;
    }

    this.selectedFile.set(file);
  }

  protected sendSubmission(): void {
    const file = this.selectedFile();

    if (!file) {
      this.error.set('Selecione um arquivo PDF.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.assessmentService.sendSubmission(file).subscribe({
      next: (submission) => {
        this.submission.set(submission);
        this.submissions.update((submissions) => [
          submission,
          ...submissions,
        ]);
        this.selectedFile.set(null);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error sending submission:', error);
        this.error.set('Não foi possível enviar a avaliação.');
        this.loading.set(false);
      },
    });
  }

  private loadSubmissions(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.assessmentService.getMySubmissions(user.id).subscribe({
          next: (submissions) => {
            this.submissions.set(submissions);
            this.loadingSubmissions.set(false);
          },
          error: (error) => {
            console.error('Error fetching submissions:', error);
            this.loadingSubmissions.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.loadingSubmissions.set(false);
      },
    });
  }
}