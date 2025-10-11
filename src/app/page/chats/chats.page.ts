import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import { ChatsService, ConversationVM } from 'src/app/core/services/chats/chats.services';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Chat, { OpenOptions } from 'src/capacitor/chat';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false
})
export class ChatsPage implements OnInit {
  conversations$!: Observable<ConversationVM[]>;
  meUid = '';

  constructor(private chats: ChatsService, private auth: Auth, private router: Router) {}

  ngOnInit() {
    authState(this.auth)
      .pipe(filter((u): u is User => !!u))
      .subscribe((u) => {
        this.meUid = u.uid;

        this.conversations$ = this.chats.conversations$(u.uid).pipe(
          map(list => (list || []).filter(c => c?.other?.uid && c.other.uid !== u.uid))
        );
      });
  }

  async open(c: ConversationVM) {
    if (!c?.other?.uid || !this.meUid) return;

    const opts = {
      meUid: this.meUid,
      withUid: c.other.uid,
      peerName: [c.other.name, c.other.lastName].filter(Boolean).join(' '),
      peerPhotoUrl: (c.other as any).photoUrl || (c.other as any).photo || ''
    } as OpenOptions;

    await Chat.open(opts);
  }

  go(ev: CustomEvent) {
    const value = (ev.detail as any)?.value as string;
    if (value) this.router.navigate(['/', value]);
  }
}
