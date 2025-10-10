import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPhotosPage } from './register-photos.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPhotosPageRoutingModule {}
