import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';

import { Matching } from 'src/capacitor/matching';
import { ChatsService } from './core/services/chats/chats.services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private listenersAdded = false;
  private widgetSub?: Subscription;

  constructor(
    private chats: ChatsService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    } catch {}

    App.addListener('appUrlOpen', ({ url }) => {
      if (!url) return;
      if (url.startsWith('tinderapp://open/chats')) {
        this.router.navigateByUrl('/tabs/chats', { replaceUrl: true });
      }
    });

    const auth = getAuth();
    onAuthStateChanged(auth, (u: User | null) => {
      if (!u) {
        this.widgetSub?.unsubscribe();
        this.widgetSub = undefined;
        return;
      }

      this.widgetSub?.unsubscribe();
      this.widgetSub = this.chats.conversations$(u.uid).subscribe(); 

      if (!this.listenersAdded) {
        this.listenersAdded = true;

        Matching.addListener('like', async (e: any) => {
          const profileId = e?.profileId ?? e?.to ?? e?.id;
          if (!profileId) return;
          await this.chats.ensureConversation(u.uid, profileId);
        });

        Matching.addListener('match', async (e: any) => {
          const profileId = e?.profileId ?? e?.with ?? e?.id;
          if (!profileId) return;
          await this.chats.ensureConversation(u.uid, profileId);
          await this.chats.sendAutoMessage(u.uid, profileId, '✨ ¡Es un match! Di hola 🙂');
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.widgetSub?.unsubscribe();
  }
}
