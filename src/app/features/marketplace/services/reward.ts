import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward';

@Injectable({
    providedIn: 'root'
})
export class RewardService {

    private readonly http = inject(HttpClient);

    getRewards(): Observable<Reward[]> {
        return this.http.get<Reward[]>('/api/rewards');
    }
}
