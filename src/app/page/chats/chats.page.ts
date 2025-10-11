import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import { ChatsService, ConversationVM } from 'src/app/core/services/chats/chats.services';
import { filter } from 'rxjs/operators';
import { Chat } from 'src/capacitor/chat';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false
})
export class ChatsPage implements OnInit {
  conversations$!: Observable<ConversationVM[]>;
  meUid = '';

  constructor(private chats: ChatsService, private auth: Auth) {}

  ngOnInit() {
    authState(this.auth)
      .pipe(filter((u): u is User => !!u))
      .subscribe((u) => {
        this.meUid = u.uid;
        this.conversations$ = this.chats.conversations$(u.uid);
      });
  }

  async open(c: ConversationVM) {
    if (!c?.other?.uid || !this.meUid) return;
    await Chat.open({
      meUid: this.meUid,
      withUid: c.other.uid,
      peerName: [c.other.name, c.other.lastName].filter(Boolean).join(' ')
    });
  }
}
