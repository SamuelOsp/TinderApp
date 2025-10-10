import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class NativeToast {
constructor(private toastCtrl: ToastController) {}

  async show(
    message: string,
    color: string = 'success',
    position: 'top' | 'middle' | 'bottom' = 'bottom',
    duration: number = 2000
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position,
    });
    await toast.present();
  }
}
