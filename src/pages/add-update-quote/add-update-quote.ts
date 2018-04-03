import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-add-update-quote',
  templateUrl: 'add-update-quote.html',
})
export class AddUpdateQuotePage {
  public addQuoteForm: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder
  ) {
    this.addQuoteForm = this._FORMBUILDER.group({
      'workTitle': ['', [Validators.required]],
      'clientName': ['', [Validators.required]],
      'contactNo': ['', [Validators.required]],
      'streetAddress': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'tnc': ['', [Validators.required]]    
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUpdateQuotePage');
  }

}
