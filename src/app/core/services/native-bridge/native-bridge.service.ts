import { Injectable, NgZone } from '@angular/core';
import { Matching } from 'src/capacitor/matching';
import { Chat } from 'src/capacitor/chat';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class NativeBridgeService {
  private mounted = false;

  constructor(private zone: NgZone, private router: Router) {}

 
mount() {
  if (this.mounted) return;
  this.mounted = true;
  Matching.addListener('like',   ({ to }) => console.log('like', to));
  Matching.addListener('nope',   ({ to }) => console.log('nope', to));
  Matching.addListener('openChat', async ({ with: uid }) => {
    const me = getAuth().currentUser?.uid || '';
    if (!me) return;
    await Chat.open({ me, with: uid });
  });
}


 
  async openMatching() {
  const uid = getAuth().currentUser?.uid || '';
  if (!uid) {
    console.warn('No auth uid; abort Matching.open');
    return;
  }
  try {
    await Matching.open({ uid });
  } catch (e) {
    console.error('Matching.open failed', e);
  }
}


}
