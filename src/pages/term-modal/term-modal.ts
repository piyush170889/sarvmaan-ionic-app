import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-term-modal',
  templateUrl: 'term-modal.html',
})
export class TermModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    console.log(this.navParams.get('message'));
  }
  public closeModal(){
    this.viewCtrl.dismiss();
}
}
