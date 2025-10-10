// src/app/page/chats/chats.page.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';
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
    const me = getAuth().currentUser?.uid || '';
    if (me) {
      this.conversations$ = this.chats.conversations$(me);
    }
  }

  open(c: ConversationVM) {
    if (!c?.id) return;
    this.router.navigate(['/chat', c.id]);
  }
}
