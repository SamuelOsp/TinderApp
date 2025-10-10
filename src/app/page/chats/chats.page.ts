import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from 'src/capacitor/chat';
import { getAuth } from 'firebase/auth';
import { NavController } from '@ionic/angular';
import { ChatsService, ConversationVM } from 'src/app/core/services/chats/chats.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false
})
export class ChatsPage implements OnInit {
  conversations$!: Observable<ConversationVM[]>;

  constructor(private chats: ChatsService, private router: Router) {}

  ngOnInit() {
    this.conversations$ = this.chats.conversations$();
  }

  async open(c: ConversationVM) {
    const me = getAuth().currentUser?.uid || '';
    if (!me || !c?.other?.uid) return;
    this.router.navigate(['/chat', c.id]);
  }
}
