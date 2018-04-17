import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditMaterialListPage } from './edit-material-list';

@NgModule({
  declarations: [
    EditMaterialListPage,
  ],
  imports: [
    IonicPageModule.forChild(EditMaterialListPage),
  ],
})
export class EditMaterialListPageModule {}
