import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/angular';

type Tab = 'discover' | 'chats' | 'profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  segment: Tab = 'discover';

  constructor(private router: Router) {}

  onSegmentChange(ev: CustomEvent<SegmentChangeEventDetail>) {
    const val = (ev.detail.value as Tab | null) ?? 'discover';
    this.go(val);
  }

  go(tab: Tab) {
    this.segment = tab;
    
    this.router.navigate(['/home', tab]);
  }
}
