import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLoginTypePage } from './select-login-type';

@NgModule({
  declarations: [
    SelectLoginTypePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectLoginTypePage),
  ],
})
export class SelectLoginTypePageModule {}
