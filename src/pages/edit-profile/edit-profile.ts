import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api-services/api.services';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  loading: Loading;
  loadingConfig: any;
  public editProfileForm: FormGroup;
  // public userDetails: any = {};
  // public bussinessDetails: any = {};
  // public skillList: any = []
  // public userAddress: any = [];
  public errorToast:any;
  public successToast:any;
  constructor(
    public apiServices: ApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController
  ) {

    this.editProfileForm = this._FORMBUILDER.group({
      'firstName': ['', Validators.required],
      'lastName': [''],
      'businessDetails': ['', Validators.required],
      'website': [''],
      'streetAddress': ['', Validators.required],
      'state': ['', Validators.required],
      'city': ['', Validators.required],
      'skillSet': [''],
      'whatsappNo': ['']
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    this.getProfileData();
    this.getMasterDataList();

    this.errorToast = this.toastCtrl.create({
      message: 'Unable to update profile data.',
      duration: 3000,
      position: 'bottom'
    });
    this.successToast = this.toastCtrl.create({
      message: 'Profile Updated Successfully.',
      duration: 700,
      position: 'bottom'
    });
  }


  getProfileData() {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getUserProfile()
        .subscribe(response => {
let skillSetData:any = [];
response.appUsers.businessDetails.skillSet.forEach(element => {
  skillSetData.push(element.displayText)
});
          this.editProfileForm.controls['firstName'].setValue(response.appUsers.firstName);
          this.editProfileForm.controls['lastName'].setValue(response.appUsers.lastName);
          this.editProfileForm.controls['businessDetails'].setValue(response.appUsers.businessDetails.businessName);
          this.editProfileForm.controls['website'].setValue(response.appUsers.businessDetails.webSite);
          this.editProfileForm.controls['streetAddress'].setValue(response.appUsers.address[0].street);
          this.editProfileForm.controls['state'].setValue(response.appUsers.address[0].stateName);
          this.editProfileForm.controls['city'].setValue(response.appUsers.address[0].cityName);
          this.editProfileForm.controls['skillSet'].setValue(skillSetData);
          this.editProfileForm.controls['whatsappNo'].setValue(response.appUsers.businessDetails.whatsAppNumber);
          // this.userDetails = response.appUsers;
          // this.bussinessDetails = response.appUsers.businessDetails;
          // this.skillList = response.appUsers.businessDetails.skillSet
          // this.userAddress = response.appUsers.address[0];
          this.loading.dismiss();
        }, error => {
          this.loading.dismiss();
          //this.errorMessage = <any>error
        });
    });
  }

  masterDataList: any = {
    language: [],
    Skillset: []
  };

  getMasterDataList() {
    this.apiServices.getMasterDataList('').subscribe((response) => {
      this.masterDataList.language = response.masterDataToList[0].masterDataList;
      this.masterDataList.Skillset = response.masterDataToList[1].masterDataList;
    })
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  submitEditProfile() {
    let skillSet: any = [];
    this.editProfileForm.controls['skillSet'].value.forEach(element => {
      skillSet.push({
        "displayText": element
      })
    });


    let data = {
      "firstName": this.editProfileForm.controls['firstName'].value,
      "lastName": this.editProfileForm.controls['lastName'].value,
      "address": [
        {
          "cityName": "Nasik",
          "stateName": "Maharashtra",
          "countryName": "India",
          "street": this.editProfileForm.controls['streetAddress'].value
        }
      ],
      "businessDetails": {
        "businessName": this.editProfileForm.controls['businessDetails'].value,
        "whatsAppNumber": this.editProfileForm.controls['whatsappNo'].value,
        "webSite": this.editProfileForm.controls['website'].value,
        "skillSet": skillSet
      }
    }
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.updateProfile(data).subscribe((response) => {
        this.loading.dismiss();
        this.successToast.present();
        setTimeout(()=>{
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        this.errorToast.present();
        this.loading.dismiss();
      })
    })

  }

}
