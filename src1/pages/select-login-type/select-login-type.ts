import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelectLoginTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-login-type',
  templateUrl: 'select-login-type.html',
})
export class SelectLoginTypePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLoginTypePage');
  }

  navigateToLogin(selectedLoginType){
    this.navCtrl.push('Login', {
      id: selectedLoginType
  });
  }

}
