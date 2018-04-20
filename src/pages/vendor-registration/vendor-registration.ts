import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, ModalController, LoadingController, Loading, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectSearchable } from 'ionic-select-searchable';
import { TermModalPage } from '../term-modal/term-modal';
import { LoginPage } from '../login/login';
import { ApiService } from '../../api-services/api.services';
import { ApiServiceProvider } from '../../api-services/globalApi.services';

@IonicPage()
@Component({
  selector: 'page-vendor-registration',
  templateUrl: 'vendor-registration.html',
})
export class VendorRegistrationPage {
  public serverError: any = {
    show: false,
    message: ''
  };
  public requestedPage: any;
  public errorToast: any;
  public showResetPassword: boolean = false;
  public showPasswordMatch: boolean = false;
  public showPasswordMismatch: boolean = false;
  public validateChangePasswordForm: boolean = false;

  public PhoneForm: FormGroup;
  public OtpForm: FormGroup;
  public regForm: FormGroup;
  public passwordUpdateForm: FormGroup;
  public showPhoneForm: boolean = true;
  public showRegistrationForm: boolean = false;
  public showOtpForm: boolean = false;
  public showInputLoader = false;
  public showHeader: boolean = false;
  public pageHeading: any = 'Sign up';
  public otpMessageObj: any = {
    otpErrorBox: false,
    msg: '',
    otpSendSuccess: true
  }

  constructor(
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private apiService: ApiServiceProvider
  ) {
    this.requestedPage = navParams.get("id");
    if (this.requestedPage == "changePassword") {
      this.showHeader = true;
      this.pageHeading = 'Change password';
    } else if (this.requestedPage == "forgot") {
      this.pageHeading = 'Reset password'
    }
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
      'contactNumber': ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]+')
      ]],
      'emailId': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'password': ['', Validators.required],
      'ConfirmPass': ['', Validators.required],
      'termsAndCondition': [false, Validators.required],
    });
    this.passwordUpdateForm = this._FORMBUILDER.group({
      'newPassword': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    });
  }


  passwordChange() {
    this.passwordChangeError.show = false;
    if (this.passwordUpdateForm.controls['newPassword'].value == this.passwordUpdateForm.controls['confirmPassword'].value) {
      if (this.passwordUpdateForm.controls['newPassword'].value != '' && this.passwordUpdateForm.controls['confirmPassword'].value != '') {
        this.showPasswordMatch = true;
        this.showPasswordMismatch = false;
        this.validateChangePasswordForm = true;
      }
    } else {
      this.showPasswordMatch = false;
      this.showPasswordMismatch = true;
      this.validateChangePasswordForm = false;
    }
  }
  passwordChangeError: any = {
    show: false,
    msg: ''
  }
  passwordUpdateSuccessToast: any;
  updatePassword() {

    let data = {
      "otp": this.OtpForm.controls['otp'].value,
      "deviceInfo": "abcd",
      "newPassword": this.passwordUpdateForm.controls['newPassword'].value
    }
    this.createLoader();
    this.loading.present().then(() => {

      this.apiService.saveDataRequest('ext/forget-password', data, true).subscribe((response) => {
        this.loading.dismiss();
        this.passwordUpdateSuccessToast.present();
        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        //this.errorToast.present();
        this.passwordChangeError.show = true;
        this.showPasswordMatch = false;
        this.showPasswordMismatch = false;
        this.passwordChangeError.msg = 'Server response: ' + err.responseMessage.message;
        //alert(err.responseMessage.message)
        this.loading.dismiss();
      })
    })
  }


  public toast: any;
  ionViewDidLoad() {
    this.errorToast = this.toastCtrl.create({
      message: 'Server error occured: Unable to update profile data.',
      duration: 3000,
      position: 'bottom'
    });
    this.getMasterDataList();
    this.toast = this.toastCtrl.create({
      message: 'Registration successfully',
      duration: 3000
    });
    this.passwordUpdateSuccessToast = this.toastCtrl.create({
      message: 'Password updated sucessfully..',
      duration: 700,
      position: 'bottom'
    });
    console.log('ionViewDidLoad VendorRegistrationPage');
  }

  portChange(event: { component: SelectSearchable, value: any }) {
    console.log('port:', event.value);
  }

  submitPhoneNo() {
    if (this.requestedPage == 'forgot') {
      //this.showResetPassword = true;
      this.submitPhoneForForgotPassword();
    } else {
      this.submitPhoneForRegistration();

      //this.showRegistrationForm = true;
    }
  }

  submitPhoneForRegistration() {
    this.showInputLoader = true;
    let data = {
      "cellNumber": this.PhoneForm.controls['phoneNo'].value,
      "deviceInfo": "abc"
    }
    this.apiService.saveDataRequest('register/verify-contact-and-send-otp', data, true).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        this.showPhoneForm = false;
        this.showOtpForm = true;
        this.showInputLoader = false;
        this.otpMessageObj.otpErrorBox = false;
        this.otpMessageObj.otpSendSuccess = true;
        this.OtpForm.controls['otp'].setValue('');
      } else {
        alert(response.responseMessage.message);
      }
    }, (error) => {
      if (error.hasOwnProperty('responseMessage')) {
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = error.responseMessage.message;
        this.showInputLoader = false;
      }
    })
  }

  submitPhoneForForgotPassword() {
    this.showInputLoader = true;
    let data = {
      "cellNumber": this.PhoneForm.controls['phoneNo'].value,
      "deviceInfo": "abc"
    }
    this.apiService.saveDataRequest('ext/send-otp', data, true).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        this.showPhoneForm = false;
        this.showOtpForm = true;
        this.showInputLoader = false;
        this.otpMessageObj.otpErrorBox = false;
        this.otpMessageObj.otpSendSuccess = true;
        this.OtpForm.controls['otp'].setValue('');
      } else {
        alert(response.responseMessage.message);
      }
    }, (error) => {
      if (error.hasOwnProperty('responseMessage')) {
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = error.responseMessage.message;
        this.showInputLoader = false;
      }
    })
  }

  phoneFieldChangeEvent() {
    this.otpMessageObj.otpErrorBox = false;
  }

  submitOtp() {
    // this.showOtpForm = false;
    // this.showRegistrationForm = true;
    // this.regForm.controls['contactNumber'].setValue(this.PhoneForm.controls['phoneNo'].value);
    this.showInputLoader = true;
    let data = {
      "cellNumber": this.PhoneForm.controls['phoneNo'].value,
      "deviceInfo": "abc",
      "otp": this.OtpForm.controls['otp'].value
    }
    // if(this.requestedPage == 'forgot'){          
    //   this.showResetPassword = true;
    // }

    this.apiService.saveDataRequest('ext/verify-otp', data, true).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        if (this.requestedPage == 'forgot') {
          this.showResetPassword = true;
        } else {
          this.showRegistrationForm = true;
        }
        this.showOtpForm = false;
        this.showInputLoader = false;
        this.regForm.controls['contactNumber'].setValue(this.PhoneForm.controls['phoneNo'].value);
      } else {
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = response.responseMessage.message;
        //alert(response.responseMessage.message);
      }
    }, (err) => {
      if (err.hasOwnProperty('responseMessage')) {
        this.otpMessageObj.otpErrorBox = true;
        this.otpMessageObj.msg = err.responseMessage.message;
        this.otpMessageObj.otpSendSuccess = false;
        this.showInputLoader = false;
      }
    })
  }
  otpFieldChangeEvent() {
    this.otpMessageObj.otpErrorBox = false;
  }

  isValidRegForm:boolean = false;

  regPasswordChange() {
    if(this.regForm.controls['password'].value == this.regForm.controls['ConfirmPass'].value &&
    this.regForm.get('firstName').valid &&
    this.regForm.get('lastName').valid &&
    this.regForm.get('businessDetails').valid &&
    this.regForm.get('language').valid  &&
    this.regForm.get('contactNumber').valid &&
    this.regForm.get('emailId').valid &&
    this.regForm.get('password').valid &&
    this.regForm.get('ConfirmPass').valid &&
    this.regForm.get('termsAndCondition').valid)
    {
      this.isValidRegForm = true;
      //this.regForm.valid = true
    }else {
      this.isValidRegForm = false;
    }    
  }

  submitVendorRegistration() {

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


    this.apiService.saveDataRequest('register/vendor-reg', data, true).subscribe((response) => {
      if (response.responseMessage.status == "200" && response.responseMessage.message == "OK") {
        //alert('registration success');
        this.toast.present();
        //this.navCtrl.push();
        this.navCtrl.setRoot(LoginPage);
      } else {
        alert(response.responseMessage.message);
      }
    }, (err) => {
      this.errorToast.present();
      //this.loading.dismiss();
    })
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
    this.apiService.getDataRequest('/ext/master-data-all').subscribe((response) => {
      if ((response.masterDataList !== null)) {
        this.masterDataList.language = response.masterDataList.language;
        this.masterDataList.Skillset = response.masterDataList.skillset;
      }
    }, )
  }
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
