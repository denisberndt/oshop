import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, Observable} from 'rxjs';
import { AuthService } from 'shared/services/auth.service';

@Injectable()
export class AdminAuthGuardService implements CanActivate{

  constructor(private auth: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUser$
    .pipe(map(appUser => appUser.isAdmin))
  }
}
