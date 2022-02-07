import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/auth';
import { Observable, of, switchMap } from 'rxjs';
import { AppUser } from 'shared/models/app-user';

import { UserService } from './user.service';

@Injectable()
export class AuthService {
  user$: Observable<firebase.User | any>;

  constructor(private userService: UserService , private afAuth: AngularFireAuth, private route: ActivatedRoute) { 
    this.user$ = afAuth.authState;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.signInWithRedirect(new firebase.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut()
  }

  get appUser$() : Observable<AppUser | any> {
    return this.user$.pipe(switchMap(user => {
      if (user) return this.userService.get(user.uid);

      return of(null);
    }))
   }
  
} 
