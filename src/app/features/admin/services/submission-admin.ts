import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Submission, ValidationStatus } from '../models/submission';
import { environmentProd } from '../../../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class SubmissionAdminService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${environmentProd.apiUrl}/api/submissions`);
  }

  getByStatus(status: ValidationStatus): Observable<Submission[]> {
    return this.http.get<Submission[]>(
      `${environmentProd.apiUrl}/api/submissions/status?status=${status}`
    );
  }

  approve(id: string): Observable<void> {
    return this.http.patch<void>(
      `${environmentProd.apiUrl}/api/submissions/id/status/${id}/approve`,
      {}
    );
  }

  reject(id: string): Observable<void> {
    return this.http.patch<void>(
      `${environmentProd.apiUrl}/api/submissions/id/status/${id}/reject`,
      {}
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environmentProd.apiUrl}/api/submissions/id/delete/${id}`
    );
  }
}