import { Injectable, NgZone } from '@angular/core';
import { Matching } from 'src/capacitor/matching';

export interface ProfilePhoto { url: string }
export interface Profile {
  id: string;
  name: string;
  age: number;
  distanceKm?: number;
  photos: ProfilePhoto[];
  bio?: string;
}

@Injectable({ providedIn: 'root' })
export class NativeBridgeService {
  private mounted = false;

  constructor(private zone: NgZone) {}

  
  mount() {
    if (this.mounted) return;
    this.mounted = true;

    Matching.addListener?.('like', ({ to }) =>
      console.log('[native] like', to)
    );
    Matching.addListener?.('nope', ({ to }) =>
      console.log('[native] nope', to)
    );

   
  }


  async matchingGetProfiles(opts: { limit?: number }) {

    return Matching.getProfiles(opts);
  }

  async matchingLike(opts: { profileId: string }) {
    return Matching.like(opts);
  }

  async matchingPass(opts: { profileId: string }) {
    return Matching.pass(opts);
  }
}
