import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { VendorRegistrationPage } from '../vendor-registration/vendor-registration';
import { ApiService } from '../../api-services/api.services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
      
  public selectedLoginType: any;
  public form: FormGroup;  
  public showInputLoader = false;  
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
  }


  logIn(): void {    
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

  naviagateToRegistration(requestedPage){
    this.navCtrl.push(VendorRegistrationPage, {id : requestedPage});
  }  

  fieldChangeEvent(){
    this.loginErrorShow = false;
  }


  ionViewDidLoad() {
    this.selectedLoginType;
    console.log('ionViewDidLoad LoginPage');
  }

}
