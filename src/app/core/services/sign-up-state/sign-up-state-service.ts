import { Injectable } from '@angular/core';

export type SignUpPayload = {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  birthDate?: string;           
  country?: string;
  city?: string;
  gender?: 'female'|'male'|'other';
  showGenderProfile?: boolean;
  passions: { category: string }[];
  photos: string[];              
};

@Injectable({
  providedIn: 'root'
})
export class SignUpStateService {
    private state: SignUpPayload = {
    country: 'Colombia',
    city: 'Cartagena',
    passions: [],
    photos: [],
  };

  setBasic(v: {name:string; lastName:string; email:string; password:string}) {
    Object.assign(this.state, v);
  }
  setGender(g: 'female'|'male'|'other', show: boolean) {
    this.state.gender = g; this.state.showGenderProfile = show;
  }
  setBirthDate(iso: string) { this.state.birthDate = iso; }
  setPassions(list: string[]) { this.state.passions = list.map(category => ({ category })); }
  addPhoto(url: string) { this.state.photos.push(url); }
  removePhotoAt(i: number) { this.state.photos.splice(i, 1); }

  payload(): SignUpPayload { return this.state; }
  reset() { this.state = { passions: [], photos: [], country: 'Colombia', city: 'Cartagena' } as any; }


}
