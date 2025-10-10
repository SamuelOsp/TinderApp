import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterBirthdatePage } from './register-birthdate.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterBirthdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterBirthdatePageRoutingModule {}
