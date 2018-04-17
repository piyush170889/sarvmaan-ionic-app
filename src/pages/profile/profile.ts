import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { ApiService } from '../../api-services/api.services';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';
import { UpdateUserInfoPage } from '../../pages/update-user-info/update-user-info';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading: Loading;
  loadingConfig: any;
  public successToast:any;
  public userDetails:any = {};
  public bussinessDetails:any = {};
  public skillList:any = []
  public userAddress:any = [];
  constructor(
    private imagePicker: ImagePicker, 
    public apiServices: ApiService, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    this.getProfileData();
    this.successToast = this.toastCtrl.create({
      message: 'Profile Updated Successfully.',
      duration: 700,
      position: 'bottom'
    });
  }

  getProfileData(){
    this.createLoader();
    this.loading.present().then(() => {
    this.apiServices.getUserProfile()
         .subscribe(response => {
           this.loading.dismiss();
           this.userDetails = response.appUsers;
           this.bussinessDetails = response.appUsers.businessDetails;
           this.skillList = response.appUsers.businessDetails.skillSet
           this.userAddress = response.appUsers.address[0];             
         }, error => {
           this.loading.dismiss();
           //this.errorMessage = <any>error
         });
   });

  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  editContact(argu){
    if(argu == 'contact'){
      alert('Requested edit primary no.');
    }else{
      alert('Requested edit whatsappNo no.');
    }
  }

  editProfile(){
    this.navCtrl.push(EditProfilePage);
  }

  updateProfile(requestedPage){
    this.navCtrl.push(UpdateUserInfoPage, {id : requestedPage});
  }

  changeProfilePicture(){
    let options = {
      maximumImagesCount: 1,
      outputType: 1
    }
    this.imagePicker.getPictures(options).then((results) => {
      // for (var i = 0; i < results.length; i++) {
      //     console.log('Image URI: ' + results[i]);
      // }

      this.createLoader();
      this.loading.present().then(() => {
      this.apiServices.updateLogo(results[0]).subscribe(response => {
          this.successToast.present();
               this.loading.dismiss();
               this.getProfileData();
           }, error => {
             this.loading.dismiss();
             alert('Server error occured'+error)
             //this.errorMessage = <any>error
           });
     });
    }, (err) => {
      alert('Unable to pic image from device.')
     });
  }

}
