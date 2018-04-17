import { Component, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectSearchable } from 'ionic-select-searchable';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

import { ApiService } from '../../api-services/api.services';

import { AddMaterialPage } from '../add-material/add-material';
import { AddMaterialListPage } from '../add-material-list/add-material-list';
import { HomePage } from '../home/home';

class State {
  public id: number;
  public displayText: string;
}
class City {
  public id: number;
  public displayText: string;
}

@Component({
  selector: 'page-add-update-quote',
  templateUrl: 'add-update-quote.html',
})
export class AddUpdateQuotePage {
  
  public addQuoteForm: FormGroup;
  states: State[];
  state: State;
  cities: City[];
  city: City;
  loading: Loading;
  loadingConfig: any;
  cityName: any;
  stateName: any;
  addtQuotationDetailData:any = [];
  materialList:any = [];
  saveMaterialToQuotationData:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public apiServices: ApiService
  ) {
    this.addQuoteForm = this._FORMBUILDER.group({
      'quoteNumber': ['', [Validators.required]],
      'workTitle': ['', [Validators.required]],
      'clientName': ['', [Validators.required]],
      'contactNo': ['', [Validators.required]],
      'streetAddress': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'tnc': ['', [Validators.required]]    
    });

    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getStatesAndCities().subscribe((response) => {
        this.loading.dismiss();
        this.states = response.locationDtlsTo.stateDtls;	
        this.cities = response.locationDtlsTo.cityDtls;
      }, (err) => {
        this.loading.dismiss();
      })
    })

   this.saveMaterialToQuotationData =  this.navParams.get('saveMaterialToQuotationData');
   if(this.saveMaterialToQuotationData == undefined){
      this.saveMaterialToQuotationData = [];
   }
   console.log(this.saveMaterialToQuotationData.custRate+"--"+this.saveMaterialToQuotationData.totalAmt);

   this.materialList.push({
       'materialId': this.saveMaterialToQuotationData.materialId,
       'productName' : this.saveMaterialToQuotationData.productName,
       'notes' : this.saveMaterialToQuotationData.notes,
       'quantity' : this.saveMaterialToQuotationData.quantity,
       'perUnitRate' : this.saveMaterialToQuotationData.rate,
       'totalAmt' : this.saveMaterialToQuotationData.totalAmt
   }); 
    console.log(this.materialList);

  if(this.materialList == '' || this.materialList == undefined){
    this.materialList = [];
  }
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUpdateQuotePage');
  }

  stateChange(event: { component: SelectSearchable, value: any }) {
    console.log(event.value.stateName);
    this.stateName = event.value.stateName;
  }
  cityChange(event: { component: SelectSearchable, value: any }) {
    console.log(event.value.cityName);
    this.cityName = event.value.cityName;
  }
    
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  addMaterialToQuotationPage(){
    this.navCtrl.push(AddMaterialPage);
  }

  submitQuotation(){
    
    if(this.addQuoteForm.controls['workTitle'].value == '' || this.addQuoteForm.controls['workTitle'].value == undefined ||
    this.addQuoteForm.controls['clientName'].value == '' || this.addQuoteForm.controls['clientName'].value == undefined ||
    this.addQuoteForm.controls['contactNo'].value == '' || this.addQuoteForm.controls['contactNo'].value == undefined ||
    this.addQuoteForm.controls['tnc'].value == '' || this.addQuoteForm.controls['tnc'].value == undefined 
    ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    let data = {
      "quoteNumber": this.addQuoteForm.controls['quoteNumber'].value,
      "workTitle": this.addQuoteForm.controls['workTitle'].value,
      "clientName": this.addQuoteForm.controls['clientName'].value,
      "contactNumber": this.addQuoteForm.controls['contactNo'].value, 
      "address": [
        {
          "cityName": this.cityName,
          "stateName": this.stateName,
          "countryName": "India",
          "street": this.addQuoteForm.controls['streetAddress'].value
        }
      ],
      "termsAndCondition":this.addQuoteForm.controls['tnc'].value,
      "emailId":"piyushtestupdated@gmail.com",
      "quoteStatus":"",    //quote Status will be DRAFT quote is saved as DRAFT. If                    // it is submitted than leave this field empty
      "quoteType":"SELF",//SELF/SARVMAAN
      "grandTotal": this.saveMaterialToQuotationData.totalAmt,
      "totalAmount": this.saveMaterialToQuotationData.totalAmt,
      "discount": this.saveMaterialToQuotationData.custRate,

      "materialList": this.materialList
    }

    console.log(data)
    this.createLoader();
     this.loading.present().then(() => {
     this.apiServices.addtQuotationDetail(data)
          .subscribe(response => {
            this.loading.dismiss();
            this.addtQuotationDetailData = response.quotationDtls;
            this.navCtrl.setRoot(HomePage);
          }, error => {
            this.loading.dismiss();
            //this.errorMessage = <any>error
          });
    });

  }

  saveQuotationAsDraft(){
    
    if(this.addQuoteForm.controls['workTitle'].value == '' || this.addQuoteForm.controls['workTitle'].value == undefined ||
    this.addQuoteForm.controls['clientName'].value == '' || this.addQuoteForm.controls['clientName'].value == undefined ||
    this.addQuoteForm.controls['contactNo'].value == '' || this.addQuoteForm.controls['contactNo'].value == undefined ||
    this.addQuoteForm.controls['tnc'].value == '' || this.addQuoteForm.controls['tnc'].value == undefined 
    ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    let data = {
      "quoteNumber": this.addQuoteForm.controls['quoteNumber'].value,
      "workTitle": this.addQuoteForm.controls['workTitle'].value,
      "clientName": this.addQuoteForm.controls['clientName'].value,
      "contactNumber": this.addQuoteForm.controls['contactNo'].value, 
      "address": [
        {
          "cityName": this.cityName,
          "stateName": this.stateName,
          "countryName": "India",
          "street": this.addQuoteForm.controls['streetAddress'].value
        }
      ],
      "termsAndCondition":this.addQuoteForm.controls['tnc'].value,
      "emailId":"piyushtestupdated@gmail.com",
      "quoteStatus":"DRAFT",    //quote Status will be DRAFT quote is saved as DRAFT. If                    // it is submitted than leave this field empty
      "quoteType":"SELF",//SELF/SARVMAAN
      "grandTotal": this.saveMaterialToQuotationData.totalAmt,
      "totalAmount": this.saveMaterialToQuotationData.totalAmt,
      "discount": this.saveMaterialToQuotationData.custRate,

      "materialList": this.materialList
    }

    console.log(data)
    this.createLoader();
     this.loading.present().then(() => {
     this.apiServices.addtQuotationDetail(data)
          .subscribe(response => {
            this.loading.dismiss();
            this.addtQuotationDetailData = response.quotationDtls;
            this.navCtrl.setRoot(HomePage);
          }, error => {
            this.loading.dismiss();
            //this.errorMessage = <any>error
          });
    });
  }

    
}
