import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { NativeToast } from 'src/app/core/providers/nativeToast/native-toast';
import { SignUpStateService } from 'src/app/core/services/sign-up-state/sign-up-state-service';
import { User } from 'src/app/shared/services/user';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  public name!: FormControl;
  public lastname!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public registerForm!: FormGroup;
  

  constructor(
    private navCtrl: NavController,
    private readonly userSrv: User,
    private toast: NativeToast,
    private loadingCtrl: LoadingController,
    private state: SignUpStateService
  ) {
    this.initForm();
  }

  ngOnInit() {}


    private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.lastname = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.registerForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
    });
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
    });

    loading.present();
  }
  public async doRegister() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched(); 
    this.toast.show('register.messages.incomplete', 'danger', 'bottom');
    return;
  }


  try {
    await this.userSrv.create(this.registerForm.value as any);
    this.toast.show('register.messages.success', 'success', 'bottom');
    this.navCtrl.navigateRoot('/login');
  } catch (e: any) {
    this.toast.show('danger', 'bottom');
  }
}

  public next() {
  if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); this.toast.show('register.messages.incomplete','danger','bottom'); return; }
  this.state.setBasic({
    name: this.name.value, lastName: this.lastname.value,
    email: this.email.value, password: this.password.value
  });
  this.navCtrl.navigateForward('/register-gender');
}

    public goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }
}
