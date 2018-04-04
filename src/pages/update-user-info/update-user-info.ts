import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api-services/api.services';

//@IonicPage()
@Component({
  selector: 'page-update-user-info',
  templateUrl: 'update-user-info.html',
})
export class UpdateUserInfoPage {

  public requestedPage: any;
  public errorToast:any;
  public successToast:any;
  public passwordUpdateForm:FormGroup;
  public emailUpdateForm:FormGroup;
  public contactUpdateForm:FormGroup;
  public otpForm:FormGroup;
  public showPasswordMatch: boolean = false;
  public showPasswordMismatch:boolean = false;
  public otpMessageObj:any ={
    otpErrorBox: false,
    msg: ''
  } 
  loading: Loading;
  loadingConfig: any;
  pageListToShow: any = {
    updatePassword: false,
    updateEmail: false,
    updateContact: false,
    otp: false
  }

  constructor(public apiServices: ApiService, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private _FORMBUILDER: FormBuilder) {
    this.requestedPage = navParams.get("id");

    this.passwordUpdateForm = this._FORMBUILDER.group({
      'oldPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    });
    this.emailUpdateForm = this._FORMBUILDER.group({
      'emailId': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]]
    });
    this.contactUpdateForm = this._FORMBUILDER.group({
      'cellNumber': ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]+')
      ]]
    });
    this.otpForm = this._FORMBUILDER.group({
      'otp': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('[0-9]+')
      ]]
    });
  }
  passwordChange(){
    //setTimeout(()=>{
      if(this.passwordUpdateForm.controls['newPassword'].value == this.passwordUpdateForm.controls['confirmPassword'].value){
        this.showPasswordMatch = true;
        this.showPasswordMismatch =  false;
      }else{
        this.showPasswordMatch = false;
        this.showPasswordMismatch =  true;
      }
   // }, 200)
  }
  ionViewDidLoad() {
    this.successToast = this.toastCtrl.create({
      message: 'Profile Updated Successfully.',
      duration: 700,
      position: 'bottom'
    });

    if (this.requestedPage == 'EMAIL') {
      this.pageListToShow.updateEmail = true;
    } else if (this.requestedPage == 'CONTACT') {
      this.pageListToShow.updateContact = true;
    } else {
      this.pageListToShow.updatePassword = true;
    }

  }

  updatePassword() {    
    let data = {
      'oldPassword': this.passwordUpdateForm.controls['oldPassword'].value,
      'newPassword': this.passwordUpdateForm.controls['newPassword'].value      
    }    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.changePassword(data).subscribe((response) => {
        this.loading.dismiss();
        this.successToast.present();
        setTimeout(()=>{
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        //this.errorToast.present();
        alert(err.responseMessage.message)
        this.loading.dismiss();
      })
    })
  }

  updateEmail() {    
    let data = {
      'emailId': this.emailUpdateForm.controls['emailId'].value
    }    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.updateEmail(data).subscribe((response) => {
        this.loading.dismiss();
        this.successToast.present();
        setTimeout(()=>{
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        alert(err.responseMessage.message)
        this.loading.dismiss();
      })
    })
  }

  sendOtp() {    
    let data = {
      "cellNumber": this.contactUpdateForm.controls['cellNumber'].value,
      "deviceInfo": "abc"
    }
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.verifyContactAndSendOtp(data).subscribe((response) => {
        this.loading.dismiss();
        this.pageListToShow.otp = true;
        this.pageListToShow.updateContact = false;
       // this.successToast.present();
        // setTimeout(()=>{
        //   this.navCtrl.pop();
        // }, 1000)
      }, (err) => {
        if(err.hasOwnProperty('responseMessage')){
          this.otpMessageObj.otpErrorBox = true;
          this.otpMessageObj.msg = err.responseMessage.message;
        }       
        //this.errorToast.present();
        this.loading.dismiss();
      })
    })

  }

  updateContact() {    
    let data = {
      'cellNumber': this.contactUpdateForm.controls['cellNumber'].value,
      'otp': this.otpForm.controls['otp'].value
    }    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.updateContact(data).subscribe((response) => {
        this.loading.dismiss();
        this.successToast.present();
        setTimeout(()=>{
          this.navCtrl.pop();
        }, 1000)
      }, (err) => {
        if(err.hasOwnProperty('responseMessage')){
          this.otpMessageObj.otpErrorBox = true;
          this.otpMessageObj.msg = err.responseMessage.message;
        }  
        this.loading.dismiss();
      })
    })

  }


// loader initilization
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
