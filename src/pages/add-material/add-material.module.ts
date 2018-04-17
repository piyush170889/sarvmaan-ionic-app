import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMaterialPage } from './add-material';

@NgModule({
  declarations: [
    AddMaterialPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMaterialPage),
  ],
})
export class AddMaterialPageModule {}
