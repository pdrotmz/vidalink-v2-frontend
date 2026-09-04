import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateRewardRequest } from '../models/create-reward-request';
import { UpdateRewardRequest } from '../models/update-reward-request';
import { Reward } from '../models/reward';
import { environmentProd } from '../../../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class RewardAdminService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${environmentProd.apiUrl}/api/rewards`);
  }

  getById(id: string): Observable<Reward> {
    return this.http.get<Reward>(`${environmentProd.apiUrl}/api/rewards/id/${id}`);
  }

  getImage(id: string): Observable<Blob> {
    return this.http.get(
      `${environmentProd.apiUrl}/api/rewards/id/${id}/image`,
      { responseType: 'blob' }
    );
  }

  search(keyword: string): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${environmentProd.apiUrl}/api/rewards/search?keyword=${encodeURIComponent(keyword)}`
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
      `${environmentProd.apiUrl}/api/rewards/create`,
      formData
    );
  }

  update(
    id: string,
    reward: UpdateRewardRequest
  ): Observable<Reward> {
    return this.http.patch<Reward>(
      `${environmentProd.apiUrl}/api/rewards/update/${id}`,
      reward
    );
  }

  updateImage(id: string, image: File): Observable<Reward> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.patch<Reward>(
      `${environmentProd.apiUrl}/api/rewards/id/${id}/image`,
      formData
    );
  }

  deactivate(id: string): Observable<void> {
    return this.http.patch<void>(
      `${environmentProd.apiUrl}/api/rewards/id/${id}/deactivate`,
      {}
    );
  }
}