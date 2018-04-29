import { Component, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController, Events, AlertController  } from 'ionic-angular';
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
  selector: 'edit-quotation-page',
  templateUrl: 'edit-quotation-page.html',
})
export class EditQuotePage {
  
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
  totalAmount: any;
  discount: any;
  grandTotal: any;
  quoteType: any;
  quoteStatus: any;

  quotationDetailsData:any = [];
  address:any = [];
  paymentSchedule: any = [];
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public apiServices: ApiService,
    public events: Events,
    public alertCtrl: AlertController
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

    console.log(this.navParams.get('quotationId'));
    
   
      this.apiServices.getStatesAndCities().subscribe((response) => {
        //this.loading.dismiss();
        this.states = response.locationDtlsTo.stateDtls;	
        this.cities = response.locationDtlsTo.cityDtls;
      }, (err) => {
        //this.loading.dismiss();
      })
   

    this.createLoader();
    this.loading.present().then(() => {
    this.apiServices.getQuotationDetail(this.navParams.get('quotationId'))
         .subscribe(response => {
           this.loading.dismiss();
           this.quotationDetailsData = response.quotationDtls;

           this.addQuoteForm.controls['workTitle'].setValue(this.quotationDetailsData.workTitle);
           this.addQuoteForm.controls['clientName'].setValue(this.quotationDetailsData.clientName);
           this.addQuoteForm.controls['contactNo'].setValue(this.quotationDetailsData.contactNumber);
           this.addQuoteForm.controls['tnc'].setValue(this.quotationDetailsData.termsAndCondition);
           this.discount =  this.quotationDetailsData.discount;
           this.totalAmount = this.quotationDetailsData.totalAmount;
           this.grandTotal = this.quotationDetailsData.grandTotal;
           this.paymentSchedule = this.quotationDetailsData.paymentSchedule;
           this.address =  this.quotationDetailsData.address;
           this.address.forEach((v,k)=>{
           this.addQuoteForm.controls['streetAddress'].setValue(v.street);
           this.addQuoteForm.controls['city'].setValue(v.cityName);
           this.addQuoteForm.controls['state'].setValue(v.stateName);
          })
           console.log(this.address);
           

         }, error => {
           this.loading.dismiss();
           //this.errorMessage = <any>error
         });
   });

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
    
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  addMaterialToQuotationPage(){
    this.navCtrl.push(AddMaterialPage);
  }

  submitQuotation(){
    
    this.quoteStatus = '';

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
    }else{

      this.sendQuotation();
      
    }

   }

  sendQuotation(){
   
  
    let data =  {
      "id": this.navParams.get('quotationId'),
      "workTitle": this.addQuoteForm.controls['workTitle'].value,
      "clientName":  this.addQuoteForm.controls['clientName'].value,
      "contactNumber": this.addQuoteForm.controls['contactNo'].value,
      "emailId": "piyushtestupdated@gmail.com",
      "termsAndCondition": this.addQuoteForm.controls['tnc'].value,
      "quoteStatus": "DRAFT",
      "grandTotal": this.grandTotal,
      "totalAmount":  this.totalAmount,
      "discount": this.discount,
      "address":[{
          "street": this.addQuoteForm.controls['streetAddress'].value,
          "cityName": this.addQuoteForm.controls['city'].value,
          "stateName": this.addQuoteForm.controls['state'].value,
          "countryName": "India"
      }],
      "paymentSchedule": this.paymentSchedule
  }

    console.log(data)
    this.createLoader();
     this.loading.present().then(() => {
     this.apiServices.editQuotation(data)
          .subscribe(response => {
            this.loading.dismiss();
            this.addtQuotationDetailData = response.quotationDtls;
            //this.navCtrl.pop();
            this.navCtrl.setRoot(HomePage);
          }, error => {
            this.loading.dismiss();
            //this.errorMessage = <any>error
          });
    });
  }

  cancelButton(){
    this.navCtrl.setRoot(HomePage);
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

}
