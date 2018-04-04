import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
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
  public userDetails:any = {};
  public bussinessDetails:any = {};
  public skillList:any = []
  public userAddress:any = [];
  constructor(public apiServices: ApiService, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    this.getProfileData();
  }

  getProfileData(){
    this.createLoader();
    this.loading.present().then(() => {
    this.apiServices.getUserProfile()
         .subscribe(response => {
           this.userDetails = response.appUsers;
           this.bussinessDetails = response.appUsers.businessDetails;
           this.skillList = response.appUsers.businessDetails.skillSet
           this.userAddress = response.appUsers.address[0];
             this.loading.dismiss();
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

}
