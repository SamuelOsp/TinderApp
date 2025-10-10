import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPassionsPage } from './register-passions.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPassionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPassionsPageRoutingModule {}
