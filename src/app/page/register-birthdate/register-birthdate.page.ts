import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SignUpStateService } from 'src/app/core/services/sign-up-state/sign-up-state-service';

@Component({
  selector: 'app-register-birthdate',
  templateUrl: './register-birthdate.page.html',
  styleUrls: ['./register-birthdate.page.scss'],
  standalone: false
})
export class RegisterBirthdatePage {
 birth: string | null = null;
  constructor(
    private nav: NavController,
    private state: SignUpStateService
  ) {}

  next() {
    this.state.setBirthDate(new Date(this.birth!).toISOString());
    this.nav.navigateForward('/register-passions');
  }
}
