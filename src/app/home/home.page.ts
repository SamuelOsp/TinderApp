import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

type Tab = 'chats' | 'discover' | 'profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  selected: Tab = 'discover';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      if (url.includes('chats')) this.selected = 'chats';
      else if (url.includes('profile')) this.selected = 'profile';
      else this.selected = 'discover';
    });
  }

  go(ev: CustomEvent) {
    const value = (ev.detail as any)?.value as string | null | undefined;
    this.router.navigate(['/home', value || 'discover']);
  }
}
