import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMaterialListPage } from './add-material-list';

@NgModule({
  declarations: [
    AddMaterialListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMaterialListPage),
  ],
})
export class AddMaterialListPageModule {}
