import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { TokenStorageService } from '../../features/auth/services/token-storage';
import { UserService } from '../../features/user/services/user';

export const adminGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorageService);
  const userService = inject(UserService);
  const router = inject(Router);

  if (!tokenStorage.get()) {
    return router.createUrlTree(['/login']);
  }

  return userService.getMe().pipe(
    map((user) => {
      if (user.role === 'ADMIN') {
        return true;
      }

      return router.createUrlTree(['/dashboard']);
    }),
  );
};