// src/app/page/discover/discover.page.ts
import { Component, OnInit, ViewChildren, QueryList, ElementRef, NgZone } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { MatchingService, Profile } from 'src/app/core/services/matching/matching.services';
import { ChatsService } from 'src/app/core/services/chats/chats.services';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false,
})
export class DiscoverPage implements OnInit {
  profiles: Profile[] = [];
  photoIndex: Record<string, number> = {};

  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef>;

  constructor(
    private matching: MatchingService,
    private gestures: GestureController,
    private chats: ChatsService,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    this.matching.profiles$.subscribe(p => {
      this.profiles = p ?? [];
      for (const x of this.profiles) if (this.photoIndex[x.id] == null) this.photoIndex[x.id] = 0;
      this.zone.runOutsideAngular(() => setTimeout(() => this.attachGestures(), 0));
    });
    await this.matching.refresh(25);
  }

  trackById = (_: number, p: Profile) => p.id;

  getPhoto(p: Profile) {
    const idx = this.photoIndex[p.id] ?? 0;
    return p.photos?.[idx]?.url || 'assets/icon/favicon.png';
  }

  private async handleLike(p: Profile) {
    const res = await this.matching.like(p.id);
    if (res?.match) {
      const me = getAuth().currentUser?.uid;
      if (me) await this.chats.sendAutoMessage(me, p.id, '¡Hey! 👋 Es un match.');
    }
  }

  private attachGestures() {
    this.cardEls.forEach((elRef, i) => {
      const el = elRef.nativeElement as HTMLElement;
      el.style.transform = ''; el.style.transition = '';
      let raf = 0;

      const g = this.gestures.create({
        el,
        gestureName: 'tinder-swipe',
        threshold: 5,

        onMove: ev => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const x = ev.deltaX, y = ev.deltaY, rot = x / 20;
            el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
          });
        },

        onEnd: ev => {
          const x = ev.deltaX;
          const like = x > 120, pass = x < -120;

          if (like || pass) {
            el.style.transition = '200ms ease-out';
            el.style.transform = `translate3d(${like ? 1000 : -1000}px, ${ev.deltaY}px, 0) rotate(${x/10}deg)`;
            const p = this.profiles[i];

            setTimeout(() => {
              const op = like ? this.handleLike(p) : this.matching.pass(p.id);
              Promise.resolve(op).finally(() => this.zone.run(() => this.removeAt(i)));
            }, 180);
          } else {
            el.style.transition = '160ms';
            el.style.transform = '';
          }
        }
      });

      g.enable(true);
    });
  }

  private removeAt(i: number) {
    const copy = [...this.profiles];
    copy.splice(i, 1);
    this.profiles = copy;
    this.zone.runOutsideAngular(() => setTimeout(() => this.attachGestures(), 0));
  }

  nextPhoto(p: Profile) {
    const i = this.photoIndex[p.id] ?? 0;
    const max = (p.photos?.length || 1) - 1;
    this.photoIndex[p.id] = i >= max ? max : i + 1;
  }
  prevPhoto(p: Profile) {
    const i = this.photoIndex[p.id] ?? 0;
    this.photoIndex[p.id] = i <= 0 ? 0 : i - 1;
  }

  async likeTop() {
    const t = this.profiles?.[0]; if (!t) return;
    await this.handleLike(t);
    this.removeAt(0);
  }
  async passTop() {
    const t = this.profiles?.[0]; if (!t) return;
    await this.matching.pass(t.id);
    this.removeAt(0);
  }
}
