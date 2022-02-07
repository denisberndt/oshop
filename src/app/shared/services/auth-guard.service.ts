import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: any, state: RouterStateSnapshot) {
    return this.auth.user$.pipe(map( user => {
      if (user) return true;

      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
      return false;
    }))
  }      
  
}
