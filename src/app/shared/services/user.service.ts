import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import * as firebase from 'firebase/auth';
import { AppUser } from 'shared/models/app-user';

// import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class UserService {
  user$!: AngularFireObject<AppUser>;
  firebaseDB = 'https://oshop-9ff1b-default-rtdb.europe-west1.firebasedatabase.app'

  constructor(private client: HttpClient,private db: AngularFireDatabase) { }

  // save(user: firebase.User) {
  //   console.log(user.uid)
  //   this.client.post('https://oshop-9ff1b-default-rtdb.europe-west1.firebasedatabase.app/users/', {
  //     name: user.displayName,
  //     email: user.email
  //   });
  //   console.log('denis')
  // }

  // get(uid: string) {
  //   return this.client.get(this.firebaseDB + '/users/' + uid + '.json');
  // }
  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
  }

  get(uid: string) {
    this.user$ = this.db.object('/users/' + uid);
    return this.user$.valueChanges();
  }
}
