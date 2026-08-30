import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../../features/auth/services/token-storage';

export const authGuard: CanActivateFn = () => {
  
  const tokenStorareg = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokenStorareg.get();
  
  if (token) {
    return true;
  }

  return router.createUrlTree(['/login'])
};
