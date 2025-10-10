import { Component, inject } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { SignUpStateService } from 'src/app/core/services/sign-up-state/sign-up-state-service';

type Gender = 'female' | 'male' | 'other' | null;

@Component({
  selector: 'app-register-gender',
  templateUrl: './register-gender.page.html',
  styleUrls: ['./register-gender.page.scss'],
  standalone: false
})
export class RegisterGenderPage {
  gender: Gender = null;           
  showGender = false;

  private nav = inject(NavController);
  private state = inject(SignUpStateService);
  private toast = inject(ToastController);

  async next() {
    if (!this.gender) {
      (await this.toast.create({
        message: 'Please select your gender to continue.',
        duration: 1600,
        color: 'warning'
      })).present();
      return;
    }

    this.state.setGender(this.gender, this.showGender);
    this.nav.navigateForward('/register-birthdate');
  }
}
