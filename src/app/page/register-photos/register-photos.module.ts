import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPhotosPageRoutingModule } from './register-photos-routing.module';

import { RegisterPhotosPage } from './register-photos.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPhotosPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterPhotosPage]
})
export class RegisterPhotosPageModule {}
