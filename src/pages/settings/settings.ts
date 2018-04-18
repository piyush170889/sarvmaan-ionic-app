import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { VendorRegistrationPage } from '../vendor-registration/vendor-registration';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';
import { ApiService } from '../../api-services/api.services';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public quotationNotification:boolean = false;
  loading: Loading;
  loadingConfig: any;
  public errorToast: any;
  public successToast: any;
  
  constructor(public apiServices: ApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.errorToast = this.toastCtrl.create({
      message: 'Server error occured: Unable to update profile data.',
      duration: 3000,
      position: 'bottom'
    });
    this.successToast = this.toastCtrl.create({
      message: 'Preference Updated Successfully.',
      duration: 700,
      position: 'bottom'
    });
    this.quotationNotification = (localStorage.getItem('quoteNotification')=='1')? true: false;
    console.log('ionViewDidLoad SettingsPage');
  }

  updateNotification(){
    let data = this.quotationNotification ? 1: 0;
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.updateQuoteNotificationPrefrences(data).subscribe((response) => {
        this.loading.dismiss();
        this.successToast.present();
        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        this.errorToast.present();
        this.loading.dismiss();
      })
    })
  }
  logout(){
    localStorage.clear();
    this.navCtrl.push(LoginPage);
    //this.nav.setRoot(LoginPage);
  }

  naviagateToRegistration(requestedPage){
    this.navCtrl.push(VendorRegistrationPage, {id : requestedPage});
  } 

  updateProfile(requestedPage){
    this.navCtrl.push(EditProfilePage, {id : requestedPage});
  }
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
