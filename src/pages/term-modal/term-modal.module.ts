import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermModalPage } from './term-modal';

@NgModule({
  declarations: [
    TermModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TermModalPage),
  ],
})
export class TermModalPageModule {}
