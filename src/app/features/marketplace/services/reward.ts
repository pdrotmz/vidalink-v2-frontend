import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward';
import { environmentProd } from '../../../../environments/environment.prod';
@Injectable({
    providedIn: 'root'
})
export class RewardService {

    private readonly http = inject(HttpClient);

    getRewards(): Observable<Reward[]> {
        return this.http.get<Reward[]>(`${environmentProd.apiUrl}/api/rewards`);
    }
}
