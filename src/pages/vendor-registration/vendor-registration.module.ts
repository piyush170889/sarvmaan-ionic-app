import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorRegistrationPage } from './vendor-registration';

@NgModule({
  declarations: [
    VendorRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorRegistrationPage),
  ],
})
export class VendorRegistrationPageModule {}
