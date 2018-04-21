import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { VendorRegistrationPage } from '../vendor-registration/vendor-registration';
import { ApiService } from '../../api-services/api.services';
import { ApiServiceProvider } from '../../api-services/globalApi.services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public selectedLoginType: any;
  public form: FormGroup;
  public showInputLoader = false;
  //public loginErrorShow: boolean = false;
  public loginError: any = {
    show: false,
    msg: ''
  }
  constructor(
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _AUTH: AuthProvider,
    private services: ApiService,
    private apiService: ApiServiceProvider
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

    this.apiService.doLoginRequest('oauth/token?username=' + data.username + '&password=' + data.password + '&grant_type=password').subscribe((response) => {
      if (response) {
        this.navCtrl.setRoot(HomePage);
      } else {
        this.loginError.show = true;
        this.loginError.msg = 'An server error occured.';
      }
    }, (err) => {
      if (err.error == "invalid_grant") {
        this.loginError.show = true;
        this.loginError.msg = 'Invalid username and password.';
      }
    })
  }

  naviagateToRegistration(requestedPage) {
    this.navCtrl.push(VendorRegistrationPage, { id: requestedPage });
  }

  fieldChangeEvent() {
    this.loginError.show = false;
    this.loginError.msg = '';
  }


  ionViewDidLoad() {
    this.selectedLoginType;
    console.log('ionViewDidLoad LoginPage');
  }

}
