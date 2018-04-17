import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'server-error',
  templateUrl: 'server-error.html'
})
export class ServerErrorComponent {
  @Input() message;
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  }

}
