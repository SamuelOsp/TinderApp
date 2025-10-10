import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false
})
export class ButtonComponent {
  @Input() color?: string;
  @Input() expand?: 'block' | 'full';
  @Input() fill?: 'clear' | 'outline' | 'solid' | 'default';
  @Input() shape?: 'round';
  @Input() size?: 'small' | 'default' | 'large';
  @Input() strong?: boolean;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnChanges() {
    const btn = this.el.nativeElement.querySelector('button');
    if (!btn) return;

    this.zone.runOutsideAngular(() => {
      this.renderer.setAttribute(btn, 'type', this.type);
      this.renderer.setProperty(btn, 'disabled', this.disabled);
      if (this.color) this.renderer.setAttribute(btn, 'color', this.color);
      if (this.expand) this.renderer.setAttribute(btn, 'expand', this.expand);
      if (this.fill) this.renderer.setAttribute(btn, 'fill', this.fill);
      if (this.size) this.renderer.setAttribute(btn, 'size', this.size);
      if (this.shape) this.renderer.setAttribute(btn, 'shape', this.shape);
      if (this.strong) this.renderer.setAttribute(btn, 'strong', 'true');
    });

    this.cdr.markForCheck();
  }
}
