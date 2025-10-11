import { Component, OnInit, ViewChildren, QueryList, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { MatchingService, Profile } from 'src/app/core/services/matching/matching.services';
import { ChatsService } from 'src/app/core/services/chats/chats.services';
import { Chat } from 'src/capacitor/chat';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false,
})
export class DiscoverPage implements OnInit, AfterViewInit {
  profiles: Profile[] = [];
  photoIndex: Record<string, number> = {};

  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private matching: MatchingService,
    private gestures: GestureController,
    private chats: ChatsService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.matching.profiles$.subscribe(p => {
      this.profiles = p ?? [];
      for (const x of this.profiles) if (this.photoIndex[x.id] == null) this.photoIndex[x.id] = 0;
      this.zone.runOutsideAngular(() => setTimeout(() => this.attachGestures(), 0));
    });
    this.matching.refresh(25);
  }

  ngAfterViewInit() {
    this.cardEls.changes.subscribe(() => {
      this.zone.runOutsideAngular(() => setTimeout(() => this.attachGestures(), 0));
    });
  }

  trackById = (_: number, p: Profile) => p.id;

  getPhoto(p: Profile) {
    const idx = this.photoIndex[p.id] ?? 0;
    return p.photos?.[idx]?.url || 'assets/icon/favicon.png';
  }

  private async openChatIfMatch(p: Profile) {
    const res = await this.matching.like(p.id);
    if (res?.match) {
      const me = getAuth().currentUser?.uid;
      if (me) {
        await this.chats.ensureConversation(me, p.id);
        await this.chats.sendAutoMessage(me, p.id, '✨ ¡Es un match! Di hola 🙂');

        await Chat.open({
          meUid: me,
          withUid: p.id,
          peerName: p.name ?? '',
          autoMessage: '✨ ¡Es un match! Di hola 🙂'
        });
      }
    }
  }

  private attachGestures() {
    this.cardEls.forEach((elRef, i) => {
      const el = elRef.nativeElement;
      el.style.transform = '';
      el.style.transition = '';
      el.classList.remove('liking', 'passing');
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
            el.classList.toggle('liking', x > 80);
            el.classList.toggle('passing', x < -80);
          });
        },

        onEnd: ev => {
          const x = ev.deltaX, y = ev.deltaY;
          const like = x > 120, pass = x < -120;

          el.classList.remove('liking','passing');

          if (like || pass) {
            el.style.transition = '200ms ease-out';
            el.style.transform = `translate3d(${like ? 1000 : -1000}px, ${y}px, 0) rotate(${x/10}deg)`;
            const p = this.profiles[i];

            setTimeout(() => {
              const op = like ? this.openChatIfMatch(p) : this.matching.pass(p.id);
              Promise.resolve(op).finally(() => this.zone.run(() => this.removeAt(i)));
            }, 160);
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
    await this.openChatIfMatch(t);
    this.removeAt(0);
  }

  async passTop() {
    const t = this.profiles?.[0]; if (!t) return;
    await this.matching.pass(t.id);
    this.removeAt(0);
  }
}
