import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SignUpStateService } from 'src/app/core/services/sign-up-state/sign-up-state-service';

@Component({
  selector: 'app-register-passions',
  templateUrl: './register-passions.page.html',
  styleUrls: ['./register-passions.page.scss'],
  standalone: false
})
export class RegisterPassionsPage {

   passions: string[] = [];
  constructor(
    private nav: NavController,
    private state: SignUpStateService
  ) {}

  on(p: string){ return this.passions.includes(p) ? 'primary' : ''; }
  toggle(p: string){
    this.passions = this.passions.includes(p) ? this.passions.filter(x => x !== p) : [...this.passions, p];
  }
  next(){ 
    this.state.setPassions(this.passions); 
    this.nav.navigateForward('/register-photos'); 
  }
}