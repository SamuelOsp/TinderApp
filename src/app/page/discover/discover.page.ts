import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { MatchingService, Profile } from 'src/app/core/services/matching/matching.services';

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

  constructor(private matching: MatchingService, private gestures: GestureController) {}

  async ngOnInit() {
    this.matching.profiles$.subscribe(p => {
      this.profiles = p;
      for (const x of p) if (this.photoIndex[x.id] == null) this.photoIndex[x.id] = 0;
      setTimeout(() => this.attachGestures(), 0);
    });
    await this.matching.refresh(25);
  }

  private attachGestures() {
    this.cardEls.forEach((elRef, i) => {
      const el = elRef.nativeElement as HTMLElement;
      el.style.transform = ''; el.style.transition = '';
      const g = this.gestures.create({
        el, gestureName: 'tinder-swipe', threshold: 5,
        onMove: ev => {
          const x = ev.deltaX, y = ev.deltaY, rot = x/20;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        },
        onEnd: ev => {
          const x = ev.deltaX;
          const like = x > 120, pass = x < -120;
          if (like || pass) {
            el.style.transition = '0.25s ease-out';
            el.style.transform = `translate(${like?1000:-1000}px, ${ev.deltaY}px) rotate(${x/10}deg)`;
            const p = this.profiles[i];
            setTimeout(async () => {
              if (like) await this.matching.like(p.id); else await this.matching.pass(p.id);
              this.removeAt(i);
            }, 220);
          } else {
            el.style.transition = '0.2s'; el.style.transform = '';
          }
        }
      });
      g.enable(true);
    });
  }

  private removeAt(i: number) {
    const copy = [...this.profiles]; copy.splice(i,1); this.profiles = copy;
    setTimeout(() => this.attachGestures(), 0);
  }

  nextPhoto(p: Profile) {
    const i = this.photoIndex[p.id] ?? 0, max = (p.photos?.length||1) - 1;
    this.photoIndex[p.id] = i >= max ? max : i+1;
  }
  prevPhoto(p: Profile) {
    const i = this.photoIndex[p.id] ?? 0;
    this.photoIndex[p.id] = i <= 0 ? 0 : i-1;
  }

  likeTop() { const t = this.profiles[0]; if (!t) return; this.matching.like(t.id).then(()=>this.removeAt(0)); }
  passTop() { const t = this.profiles[0]; if (!t) return; this.matching.pass(t.id).then(()=>this.removeAt(0)); }
}
