import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterGenderPageRoutingModule } from './register-gender-routing.module';

import { RegisterGenderPage } from './register-gender.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterGenderPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterGenderPage]
})
export class RegisterGenderPageModule {}
