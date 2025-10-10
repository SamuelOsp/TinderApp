import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export interface UserProfile {
  uid: string;
  name: string;
  lastName: string;
  birthDate: string;             
  email: string;
  password: string;              
  country: string;
  city: string;
  gender: 'female'|'male'|'other';
  showGenderProfile: boolean;
  passions: { category: string }[];
  photos: string[];
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({ providedIn: 'root' })
export class User {
  private afs = inject(Firestore);
  private auth = inject(Auth);

  async create(payload: Omit<UserProfile, 'uid'> & { uid?: string }) {
    const uid = payload.uid || this.auth.currentUser?.uid;
    if (!uid) throw new Error('No UID available from Firebase Auth');

    const ref = doc(this.afs, 'users', uid);
    const data: UserProfile = {
      uid,
      name: payload.name,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      email: payload.email,
      password: payload.password,        
      country: payload.country,
      city: payload.city,
      gender: payload.gender as any,
      showGenderProfile: !!payload.showGenderProfile,
      passions: payload.passions || [],
      photos: payload.photos || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, data, { merge: true });
    return uid;
  }
}
