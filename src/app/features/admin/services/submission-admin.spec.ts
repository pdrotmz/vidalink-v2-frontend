import { TestBed } from '@angular/core/testing';
import { SubmissionAdminService } from './submission-admin';


describe('SubmissionAdminService', () => {
  let service: SubmissionAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
