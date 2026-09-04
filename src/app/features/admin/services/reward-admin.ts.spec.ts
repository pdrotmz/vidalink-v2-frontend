import { TestBed } from '@angular/core/testing';
import { RewardAdminTs } from './reward-admin.ts';

describe('RewardAdminTs', () => {
  let service: RewardAdminTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardAdminTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
