import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterGenderPage } from './register-gender.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterGenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterGenderPageRoutingModule {}
