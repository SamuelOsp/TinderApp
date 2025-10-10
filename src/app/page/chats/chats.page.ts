import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from 'src/capacitor/chat';
import { getAuth } from 'firebase/auth';
import { NavController } from '@ionic/angular';
import { ChatsService, ConversationVM } from 'src/app/core/services/chats/chats.services';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false
})
export class ChatsPage implements OnInit {
  conversations$!: Observable<ConversationVM[]>;

  constructor(private chats: ChatsService, private nav: NavController) {}

  ngOnInit() {
    this.conversations$ = this.chats.conversations$();
  }

  async openNativeChat(c: ConversationVM) {
    const me = getAuth().currentUser?.uid || '';
    if (!me || !c?.other?.uid) return;
    await Chat.open({ me, with: c.other.uid });
  }
}
