import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Submission } from '../models/submission';

@Injectable({
  providedIn: 'root',
})
export class Assessment {

  private readonly http = inject(HttpClient);

  sendSubmission(file: File): Observable<Submission> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<Submission>(
      '/api/submissions/send',
      formData
    );
  }
}