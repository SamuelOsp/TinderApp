import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/AuthService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  
 public email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  public password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
  });

  public loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });
 
  constructor(
    private navCtrl: NavController,
    private readonly authSrv: AuthService,
    private loadingCtrl: LoadingController
  ) {}
   ngOnInit() {
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
    });

    loading.present();
  }
  async doLogin(){
     if (this.loginForm.invalid) return;
    try {
      const { email, password } = this.loginForm.value;
      await this.authSrv.login(email!, password!);
      this.navCtrl.navigateRoot('/home'); 
    } catch (error) {
      console.log(error);
    }
  }

  goToRegister(){
    this.navCtrl.navigateRoot('/register');
  }
  
}
