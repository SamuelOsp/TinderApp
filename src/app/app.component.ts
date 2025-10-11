import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Matching } from 'src/capacitor/matching';
import { ChatsService } from './core/services/chats/chats.services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private listenersAdded = false;

  constructor(private chats: ChatsService) {}

  async ngOnInit() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    } catch {}

    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      if (!u || this.listenersAdded) return;
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
    });
  }
}
