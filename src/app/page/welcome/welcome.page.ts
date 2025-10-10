import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})
export class WelcomePage {
  private router = inject(Router);
  private toast = inject(ToastController);
  agreed = false;

  async ionViewDidEnter() {
    const { value } = await Preferences.get({ key: 'termsAccepted' });
    if (value === '1') this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async accept() {
    if (!this.agreed) {
      (await this.toast.create({ message: 'Debes aceptar los términos', duration: 1800, color: 'warning' })).present();
      return;
    }
    await Preferences.set({ key: 'termsAccepted', value: '1' });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
