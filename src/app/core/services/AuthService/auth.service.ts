import { Injectable } from '@angular/core';
import { Auth as AuthFirebase, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "@angular/fire/auth";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly authFirebase: AuthFirebase){
    
    onAuthStateChanged(this.authFirebase, (user) => {
      this.currentUser$.next(user);
    });
  }

  async register(email: string, password: string){
    const resp = await createUserWithEmailAndPassword(this.authFirebase, email, password);
    return resp.user.uid;
  }

  async login(email: string, password: string){
    const resp = await signInWithEmailAndPassword(this.authFirebase, email, password);
    return resp.user.uid;
  }

  async logout(){
    await signOut(this.authFirebase);
  }

  
  get userChanges(){
    return this.currentUser$.asObservable();
  }

 
  get currentUser(){
    return this.currentUser$.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser$.value;
  }

}
