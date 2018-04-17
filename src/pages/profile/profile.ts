import { Component } from '@angular/core';
import { FabContainer, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
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
    private toastCtrl: ToastController,
    private base64: Base64) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    // this.getProfileData();
    // this.successToast = this.toastCtrl.create({
    //   message: 'Profile Updated Successfully.',
    //   duration: 700,
    //   position: 'bottom'
    // });
  }
  ionViewWillEnter() {
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
           if(error.error!= 'invalid_token'){
            setTimeout(()=>{
              this.navCtrl.pop();
             }, 10)
           }                      
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
      outputType: 0
    }
    this.imagePicker.getPictures(options).then((results) => {     
      let filePath: string =  results[0];
      this.base64.encodeFile(filePath).then((base64File: string) => {
        let stringData = base64File.split(',')[1];        
        console.log(stringData);
        //this.uploadLogo('data:image/png;base64,' + stringData);
        this.uploadLogo(stringData);
      }, (err) => {
        console.log(err);
      });    
    }, (err) => {
      alert('Unable to pic image from device.')
     });
    }

    uploadLogo(stringData){
      this.createLoader();
      this.loading.present().then(() => {
      this.apiServices.updateLogo(stringData).subscribe(response => {
          this.successToast.present();
               this.loading.dismiss();
               this.getProfileData();
           }, error => {
             this.loading.dismiss();
             alert('Server error occured'+error)
             //this.errorMessage = <any>error
           });
     });
    }

}
