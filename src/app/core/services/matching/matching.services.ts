import { Injectable, NgZone } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

export interface ProfilePhoto { url: string }
export interface Profile {
  id: string;
  name: string;
  age: number;
  distanceKm?: number;
  photos: ProfilePhoto[]; 
  bio?: string;
}

interface MatchingPlugin {
  getProfiles(options?: { limit?: number }): Promise<{ profiles: Profile[] }>;
  like(options: { profileId: string }): Promise<{ match?: boolean }>;
  pass(options: { profileId: string }): Promise<void>;

  addListener(eventName: 'profilesUpdated', listenerFunc: (data: { profiles: Profile[] }) => void): Promise<any>;
}

const Matching = registerPlugin<MatchingPlugin>('Matching');

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private _profiles$ = new BehaviorSubject<Profile[]>([]);
  profiles$ = this._profiles$.asObservable();

  constructor(private zone: NgZone) {
    
    Matching.addListener?.('profilesUpdated', ({ profiles }) => {
      this.zone.run(() => this._profiles$.next(profiles ?? []));
    });
  }

  async refresh(limit = 20) {
    const { profiles } = await Matching.getProfiles({ limit });
    this.zone.run(() => this._profiles$.next(profiles ?? []));
  }

  async like(id: string) {
    return Matching.like({ profileId: id });
  }

  async pass(id: string) {
    return Matching.pass({ profileId: id });
  }
}

