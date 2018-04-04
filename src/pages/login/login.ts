import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { VendorRegistrationPage } from '../vendor-registration/vendor-registration';
import { ApiService } from '../../api-services/api.services';

// @IonicPage({
//   name: 'Login',
//   segment: 'Login/:id'
// })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public showForgotPassword:boolean = true;
  public vendorSignUp = VendorRegistrationPage;
  public selectedLoginType: any;
  public form: FormGroup;
  public forgotForm: FormGroup;
  public showInputLoader = false;
  public emailSendMsg:boolean = false;
  public loginErrorShow:boolean = false;
  constructor(
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _AUTH: AuthProvider,
    private services: ApiService
  ) {
    this.form = this._FORMBUILDER.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    this.forgotForm = this._FORMBUILDER.group({
      'forgotEmail': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]]
    });
    //this.selectedLoginType = this.navParams.get('id');
  }


  logIn(): void {
    //this.navCtrl.setRoot(HomePage);
    let data = {
      username: this.form.controls['username'].value,
      password: this.form.controls['password'].value
    }
    this.services.login(data).subscribe((response) => {      
      if(response){
        this.navCtrl.setRoot(HomePage);
      }else{
        alert('Login error.');
      }      
    }, (err)=>{
        if(err.error == "invalid_grant"){
          this.loginErrorShow = true;
        }
    }) 
  }

  forgotPassword(){
    this.showForgotPassword = false;
  }
  showLogin(){
    this.showForgotPassword = true;
  }
  fieldChangeEvent(){
    this.loginErrorShow = false;
  }

  submitEmail(){    
    this.showInputLoader = true;
    let data = {
      email: this.forgotForm.controls['forgotEmail'].value
    }
    this.services.sendEmail(data).subscribe((response) => {      
      if(response){
        this.showInputLoader = false;
        this.emailSendMsg = true;
        //this.navCtrl.setRoot(HomePage);
      }else{
        alert('Server error occured.');
        this.showInputLoader = false;
      }      
    }, (error)=>{
      this.showInputLoader = false;
      //this.emailSendMsg = true;
      alert(error.responseMessage.message);
    }) 
  }

  ionViewDidLoad() {
    this.selectedLoginType;
    console.log('ionViewDidLoad LoginPage');
  }

}
