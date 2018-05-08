import { Component } from '@angular/core';
import { FabContainer, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { ApiServiceProvider } from '../../../api-services/globalApi.services';
import { EditProfilePage } from '../../../pages/profile-module/edit-profile/edit-profile';
import { UpdateUserInfoPage } from '../../../pages/profile-module/update-user-info/update-user-info';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading: Loading;
  loadingConfig: any;
  public successToast: any;
  public userDetails: any = {};
  public bussinessDetails: any = {};
  public skillList: any = []
  public userAddress: any = [];
  constructor(
    private imagePicker: ImagePicker,
    public apiService: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private base64: Base64) {
  }

  ionViewWillEnter() {
    this.getProfileData();
    this.successToast = this.toastCtrl.create({
      message: 'Profile Updated Successfully.',
      duration: 700,
      position: 'top'
    });
  }

  getProfileData() {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.getDataRequest('profile', false)
        .subscribe(response => {
          this.loading.dismiss();
          if (response.appUsers.businessDetails != null) {
            this.bussinessDetails = response.appUsers.businessDetails;
            this.skillList = response.appUsers.businessDetails.skillSet;
            if (response.appUsers.address != null) {
              this.userAddress = response.appUsers.address[0];
            }
          }
          this.userDetails = response.appUsers;
        }, error => {
          this.loading.dismiss();
          alert('Server error occured.') 
        });
    });

  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  editProfile(requestedPage) {
    this.navCtrl.push(EditProfilePage, { id: requestedPage });
  }

  updateProfile(requestedPage) {
    this.navCtrl.push(UpdateUserInfoPage, { id: requestedPage });
  }

  changeProfilePicture() {

    this.imagePicker.hasReadPermission().then((results) => {
      if(results){
        let options = {
          maximumImagesCount: 1,
          outputType: 0,
          destinationType: 0
        }
        this.imagePicker.getPictures(options).then((results) => {
          let filePath: string = results[0];
          this.base64.encodeFile(filePath).then((base64File: string) => {
            let stringData = base64File.split(',')[1];
            this.uploadLogo(stringData);
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          alert('Unable to pic image from device.')
        });
      }else{
        this.imagePicker.requestReadPermission().then((results) => {
          results
        })
      }
    })

    
  }

  uploadLogo(stringData) {
    this.createLoader();
    let data = {
      "logo": stringData
    }
    this.loading.present().then(() => {
      this.apiService.saveDataRequest('profile-logo', data, false).subscribe(response => {
        this.successToast.present();
        this.loading.dismiss();
        this.getProfileData();
      }, error => {
        this.loading.dismiss();
        alert('Server error occured.') 
      });
    });
  }

}
