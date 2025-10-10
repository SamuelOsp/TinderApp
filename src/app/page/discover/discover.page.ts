import { Component, OnInit } from '@angular/core';
import { NativeBridgeService } from 'src/app/core/services/native-bridge/native-bridge.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false,
})
export class DiscoverPage implements OnInit {
  constructor(private nativeBridge: NativeBridgeService) {}
  ngOnInit() {
    this.nativeBridge.mount();
  }
  async openMatching() {
    try {
      await this.nativeBridge.openMatching();
    } catch (e) {
      console.error('[Matching.open] error', e);
    }
  }
}
