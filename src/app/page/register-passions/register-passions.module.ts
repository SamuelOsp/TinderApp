import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPassionsPageRoutingModule } from './register-passions-routing.module';

import { RegisterPassionsPage } from './register-passions.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPassionsPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterPassionsPage]
})
export class RegisterPassionsPageModule {}
