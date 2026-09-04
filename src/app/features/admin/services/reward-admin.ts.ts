import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateRewardRequest } from '../models/create-reward-request';
import { UpdateRewardRequest } from '../models/update-reward-request';
import { Reward } from '../models/reward';

@Injectable({
  providedIn: 'root',
})
export class RewardAdminService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Reward[]> {
    return this.http.get<Reward[]>('/api/rewards');
  }

  getById(id: string): Observable<Reward> {
    return this.http.get<Reward>(`/api/rewards/id/${id}`);
  }

  getImage(id: string): Observable<Blob> {
    return this.http.get(
      `/api/rewards/id/${id}/image`,
      { responseType: 'blob' }
    );
  }

  search(keyword: string): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `/api/rewards/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  create(
    reward: CreateRewardRequest,
    image: File
  ): Observable<Reward> {
    const formData = new FormData();

    formData.append(
      'reward',
      new Blob([JSON.stringify(reward)], {
        type: 'application/json',
      })
    );

    formData.append('image', image);

    return this.http.post<Reward>(
      '/api/rewards/create',
      formData
    );
  }

  update(
    id: string,
    reward: UpdateRewardRequest
  ): Observable<Reward> {
    return this.http.patch<Reward>(
      `/api/rewards/update/${id}`,
      reward
    );
  }

  updateImage(id: string, image: File): Observable<Reward> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.patch<Reward>(
      `/api/rewards/id/${id}/image`,
      formData
    );
  }

  deactivate(id: string): Observable<void> {
    return this.http.patch<void>(
      `/api/rewards/id/${id}/deactivate`,
      {}
    );
  }
}