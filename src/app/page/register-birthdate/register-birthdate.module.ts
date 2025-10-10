import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterBirthdatePageRoutingModule } from './register-birthdate-routing.module';

import { RegisterBirthdatePage } from './register-birthdate.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterBirthdatePageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterBirthdatePage]
})
export class RegisterBirthdatePageModule {}
