import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api-services/api.services';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  loading: Loading;
  loadingConfig: any;
  public requestedPage: any;
  public editProfileForm: FormGroup;
  public languageUpdateForm:FormGroup;
  public updateLanguage:boolean = false;
  public pageHeading:any = 'PROFILE DETAILS';  
  // public userDetails: any = {};
  // public bussinessDetails: any = {};
  // public skillList: any = []
  // public userAddress: any = [];
  public errorToast: any;
  public successToast: any;
  constructor(
    public apiServices: ApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.requestedPage = navParams.get("id");
    this.editProfileForm = this._FORMBUILDER.group({
      'firstName': ['', Validators.required],
      'lastName': [''],
      'businessDetails': ['', Validators.required],
      'website': [''],
      'streetAddress': ['', Validators.required],
      'state': ['', Validators.required],
      'city': ['', Validators.required],
      'skillSet': [''],
      'whatsappNo': [''],
      'countryName': ['']
    });

    this.languageUpdateForm = this._FORMBUILDER.group({
      'language': ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    this.getAllMasterData();
    //this.getMasterDataList();
    this.getProfileData();


    this.errorToast = this.toastCtrl.create({
      message: 'Server error occured: Unable to update profile data.',
      duration: 3000,
      position: 'bottom'
    });
    this.successToast = this.toastCtrl.create({
      message: 'Profile Updated Successfully.',
      duration: 700,
      position: 'bottom'
    });

    if(this.requestedPage == 'LANGUAGE'){
        this.updateLanguage = true;
        this.pageHeading = 'Update Language';
    }else {
      this.updateLanguage = false;
      this.pageHeading = 'PROFILE DETAILS';
    }
  }


  getProfileData() {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getUserProfile()
        .subscribe(response => {
          if(response.appUsers.businessDetails != null){
            let skillSetData: any = [];
            response.appUsers.businessDetails.skillSet.forEach(element => {
              skillSetData.push(element.displayText)
            });
            
            this.editProfileForm.controls['businessDetails'].setValue(response.appUsers.businessDetails.businessName);
            this.editProfileForm.controls['website'].setValue(response.appUsers.businessDetails.webSite);
            this.editProfileForm.controls['streetAddress'].setValue(response.appUsers.address[0].street);
            this.editProfileForm.controls['state'].setValue(response.appUsers.address[0].stateName);
            this.editProfileForm.controls['city'].setValue(response.appUsers.address[0].cityName);
            this.editProfileForm.controls['skillSet'].setValue(skillSetData);
            this.editProfileForm.controls['whatsappNo'].setValue(response.appUsers.businessDetails.whatsAppNumber);
            this.editProfileForm.controls['countryName'].setValue(response.appUsers.address[0].countryName);              
          }
          this.editProfileForm.controls['firstName'].setValue(response.appUsers.firstName);
          this.editProfileForm.controls['lastName'].setValue(response.appUsers.lastName);
          this.languageUpdateForm.controls['language'].setValue(response.appUsers.language);            
          this.loading.dismiss();
        }, error => {
          this.loading.dismiss();
        });
    });
  }

  masterDataList: any = {
    language: [],
    Skillset: [],
    stateList: [],
    cityList: []
  };

  getAllMasterData() {
    this.apiServices.getMasterDataLocationList('').subscribe((response) => {
      if ((response.masterDataList !== null)) {
        this.masterDataList.cityList = response.locationDtlsTo.cityDtls;
        this.masterDataList.stateList = response.locationDtlsTo.stateDtls;
        this.masterDataList.language = response.masterDataList.language;
        this.masterDataList.Skillset = response.masterDataList.skillset;
      }
    })
    
  }
  createLoader(message: string = "Please wait...") { 
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
          "cityName": this.editProfileForm.value.city,
          "stateName": this.editProfileForm.value.state,
          "countryName": this.editProfileForm.value.countryName,
          "street": this.editProfileForm.value.streetAddress
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
        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        this.errorToast.present();
        this.loading.dismiss();
      })
    })

  }

  submitUpdateLanguage(){

    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.updateLanguage(this.languageUpdateForm.controls['language'].value).subscribe((response) => {
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

}
