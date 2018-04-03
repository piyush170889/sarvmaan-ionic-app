import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectSearchable } from 'ionic-select-searchable';
import { TermModalPage } from '../term-modal/term-modal';
import { LoginPage } from '../login/login';
import { ApiService } from '../../api-services/api.services';

@IonicPage()
@Component({
  selector: 'page-vendor-registration',
  templateUrl: 'vendor-registration.html',
})
export class VendorRegistrationPage {

  public PhoneForm: FormGroup;
  public OtpForm: FormGroup;
  public regForm: FormGroup;
  public showPhoneForm: boolean = true;
  public showRegistrationForm: boolean = false;
  public showOtpForm: boolean = false;
  public showInputLoader = false;
  public otpMessageObj:any ={
    otpErrorBox: false,
    msg: ''
  } 

  constructor(
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public apiService: ApiService
  ) {
    this.PhoneForm = this._FORMBUILDER.group({
      'phoneNo': ['', 
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[0-9]+')
        ]
    ]
    });

    this.OtpForm = this._FORMBUILDER.group({
      'otp': ['', 
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('[0-9]+')
      ]
  ]
    });

    this.regForm = this._FORMBUILDER.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'businessDetails': ['', Validators.required],
      'language': ['', Validators.required],
      'contactNumber': ['', Validators.required],
      'emailId': ['', Validators.required],            
      'password': ['', Validators.required],
      'ConfirmPass': ['', Validators.required],
      'termsAndCondition': ['', Validators.required],


    });
  }
  portChange(event: { component: SelectSearchable, value: any }) {
    console.log('port:', event.value);
  }

  submitPhoneNo() {    
    // this.showPhoneForm = false;
    // this.showOtpForm = true;
    this.showInputLoader = true;
    let data = {
      "cellNumber": this.PhoneForm.controls['phoneNo'].value,
      "deviceInfo": "abc"
    }
    this.apiService.verifyContactAndSendOtp(data).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {        
        this.showPhoneForm = false;
        this.showOtpForm = true;
        this.showInputLoader = false;
      } else {
        alert(response.responseMessage.message);
      }
    }, (error)=>{
      if(error.hasOwnProperty('responseMessage')){
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = error.responseMessage.message;
        this.showInputLoader = false;
      }
    })
  }

  submitOtp() {
    // this.showOtpForm = false;
    // this.showRegistrationForm = true;
    // this.regForm.controls['contactNumber'].setValue(this.PhoneForm.controls['phoneNo'].value);
    this.showInputLoader = true;
    let data = {
      "cellNumber":this.PhoneForm.controls['phoneNo'].value,
      "deviceInfo":"abc",
      "otp" : this.OtpForm.controls['otp'].value
    }
    
    this.apiService.verifyOtp(data).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        this.showOtpForm = false;
        this.showRegistrationForm = true;
        this.showInputLoader = false;
        this.regForm.controls['contactNumber'].setValue(this.PhoneForm.controls['phoneNo'].value);
      } else {
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = response.responseMessage.message;
        //alert(response.responseMessage.message);
      }
    }, (err)=>{
      if(err.hasOwnProperty('responseMessage')){
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = err.responseMessage.message;
        this.showInputLoader = false;
      }
    })    
  }

  submitVendorRegistration(){

    let data = {
    "firstName": this.regForm.controls['firstName'].value,
    "lastName": this.regForm.controls['lastName'].value,
    "contactNumber": this.regForm.controls['contactNumber'].value,
    "emailId": this.regForm.controls['emailId'].value,
    "password": this.regForm.controls['password'].value,
    "language": 'EN',
    "termsAndCondition": 1,
    "businessDetails": {
   	 "businessName": this.regForm.controls['businessDetails'].value
    }
}

    
    this.apiService.vendorRegistration(data).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        alert('registration success');
        //this.navCtrl.push();
        this.navCtrl.setRoot(LoginPage);
      } else {
        alert(response.responseMessage.message);
      }
    })    
  }

  logIn(): void {
    //  let email : any = this.form.controls['username'].value,
    //      password : any = this.form.controls['password'].value;

  }

  ionViewDidLoad() {
    this.getMasterDataList();
    console.log('ionViewDidLoad VendorRegistrationPage');
  }
  public openTermNconditionModal() {
    var data = { message: 'hello world' };
    var modalPage = this.modalCtrl.create('TermModalPage', data);
    modalPage.present();
  }
  masterDataList: any = {
    language: [],
    Skillset: []
  };
  getMasterDataList() {
    this.apiService.getMasterDataList('').subscribe((response) => {
      this.masterDataList.language = response.masterDataToList[0].masterDataList;
      this.masterDataList.Skillset = response.masterDataToList[1].masterDataList;
    })
  }

}
