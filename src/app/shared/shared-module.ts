import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from './services/user';
import { InputComponent } from './Components/input/input/input.component';
import { ButtonComponent } from './Components/button/button.component';

const components = [InputComponent, ButtonComponent
];
const providers = [User];

const modules = [CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
  providers: [...providers],
})
export class SharedModule { }
