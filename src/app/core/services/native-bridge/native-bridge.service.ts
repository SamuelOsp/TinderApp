import { Injectable, NgZone } from '@angular/core';
import { Matching } from 'src/capacitor/matching';

@Injectable({ providedIn: 'root' })
export class NativeBridgeService {
  private mounted = false;

  constructor(private zone: NgZone) {}

  mount() {
    if (this.mounted) return;
    this.mounted = true;

    Matching.addListener?.('like', (d: any) => {
      const profileId = d?.profileId ?? d?.to ?? d?.with; 
      this.zone.run(() => console.log('[native] like', profileId));
    });

    Matching.addListener?.('nope', (d: any) => {
      const profileId = d?.profileId ?? d?.to ?? d?.with;
      this.zone.run(() => console.log('[native] nope', profileId));
    });

    Matching.addListener?.('match', (d: any) => {
      const profileId = d?.profileId ?? d?.with ?? d?.to;
      const conversationId = d?.conversationId;
      this.zone.run(() => console.log('[native] match', { profileId, conversationId }));
    });

    Matching.addListener?.('profilesUpdated', ({ profiles }) => {
      this.zone.run(() => console.log('[native] profilesUpdated', profiles?.length ?? 0));
    });
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
