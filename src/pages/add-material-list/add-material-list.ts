import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController, Loading, ToastController, Events  } from 'ionic-angular';
//import { ListPage } from '../list/list';

import { ApiService } from '../../api-services/api.services';
import { AddUpdateQuotePage } from '../add-update-quote/add-update-quote';
import { QuotationDetailsPage } from '../quotation-details/quotation-details';
import { ProductListPage } from '../product-list-page/product-list-page';

@IonicPage()
@Component({
  selector: 'page-add-material-list',
  templateUrl: 'add-material-list.html',
})
export class AddMaterialListPage {
 
  materialId: any;
  productNameList: any = [];
  rateList: any = [];
  unitList: any = [];

  custRate:any;
  quantity:any;
  notes:any;
  productName:any;
  rate:any;
  unit:any;

  loading: Loading;
  loadingConfig: any;
  total: any;
  perUnitRate: any;
  data: any;
  discount: any;

  productId: any;

  saveMaterialToQuotationData:any = [];

  disableRateList : boolean = false;
  hideDiscount : boolean = false;

  constructor(
     public navCtrl: NavController,
     public events: Events, 
     public navParams: NavParams, 
     private loadingCtrl: LoadingController, 
     public apiServices: ApiService, 
     private toastCtrl: ToastController
    ){

    this.materialId = Math.random().toString(36).substr(2, 9);
    
    // get productName and rateList by selectBox start
    
     events.subscribe('event-productName', (data) => {
      this.productName = data;
      this.productNameList = [];
      this.productNameList.push({'name':this.productName});
    });

    events.subscribe('event-productId', (data) => {
      console.log("productID=="+data);
      this.productId = data;
    });

    events.subscribe('event-rateList', (data) => {
    
     if(data == '' || data == []){

      this.disableRateList = true;
      this.rateList = [
        '12000','15000','10000'
      ];
      console.log( this.rateList)

     }
      
    });
    
  // get productName and rateList by selectBox end

    this.unitList = [
      'Hundreds','Thousands','Lacs','Crore'
    ];

  }

  getProductName(productName){
     
    this.productNameList.forEach((v,k) => {
    if(productName == v.name){
     
        this.createLoader();
        this.loading.present().then(() => {
          this.apiServices.getRateListByProductId(v.id).subscribe((response) => {
           
            this.loading.dismiss();
            this.rateList = [
              '12000','15000','10000'
            ];
            
          }, (err) => {
            this.loading.dismiss();
          })

    })
    }
  });
}

gotoProductlist()
{
 
  this.navCtrl.push(ProductListPage);
}


getRate(){
  if(this.rate == '' || this.rate == undefined){
    this.rate = 0;
  }else{
    this.perUnitRate = this.rate.split('/')[0];
    this.total = this.quantity * this.perUnitRate;
    this.custRate = '';
  }
}

showRateStatusMsg(){
  if(this.disableRateList == true){
    let toast = this.toastCtrl.create({
      message: 'You have not specified a price list for selected product. Please specify a custom rate list',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
}

getCustRate(){
  this.perUnitRate = this.custRate;
  this.total = this.quantity * this.perUnitRate;
  this.rate = '';
  
}

getTotalCalculate(){

  if( (this.rate == '' || this.rate == undefined) && (this.custRate == '' || this.custRate == undefined) ){
    this.perUnitRate = 0;
    this.total = this.quantity * this.perUnitRate;
  }else if((this.rate == '' || this.rate == undefined) && (this.custRate != '' || this.custRate != undefined)){
    this.perUnitRate = this.custRate;
    this.total = this.quantity * this.perUnitRate;
  }else if((this.rate != '' || this.rate != undefined) && (this.custRate == '' || this.custRate == undefined)){
    this.perUnitRate = this.rate.split('/')[0];
    this.total = this.quantity * this.perUnitRate;
  }

}

getUnit(unit){
    
}

saveMaterialToQuotation(){
    
    this.data = {
      materialId: this.materialId,
      productName: this.productName,
      quantity: this.quantity,
      discount: this.discount,
      totalAmt: this.total,
      perUnitRate: this.perUnitRate,
      notes: this.notes,
      productId: this.productId,
      checked: 'false'
    }
   
   if(
     this.materialId == '' || this.materialId == undefined
     || this.quantity == '' || this.quantity == undefined
     || this.discount == '' || this.discount == undefined
     || this.notes == '' || this.notes == undefined
     ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 2000,
        position: 'top'
      });
      toast.present();
     }else{

          if(this.navParams.get('pageName') == 'add'){
            this.createLoader();
            this.loading.present().then(() => {
              this.apiServices.addMaterialToQuotation(this.navParams.get('quoteID'),this.data).subscribe((response) => {
                this.navCtrl.push(QuotationDetailsPage, {id: this.navParams.get('quoteID')});
                this.loading.dismiss();
               
                this.materialId =  '';
                this.productName =  '';
                this.quantity =  '';
                this. total =  '';
                this.perUnitRate = '';
                this.notes =  '';
                this.custRate = '';
                this.rate = '';
                this.discount = '';
                
              }, (err) => {
                this.loading.dismiss();
              })
            })
          }else{
            this.saveMaterialToQuotationData = this.navParams.get('productData');
            this.saveMaterialToQuotationData.push(this.data);
           
            let toast = this.toastCtrl.create({
              message: 'Added successfully !',
              duration: 2000,
              position: 'top'
            });
            toast.present();
        
            this.materialId = Math.random().toString(36).substr(2, 9);
            this.productName =  '';
            this.quantity =  '';
            this. total =  '';
            this.perUnitRate = '';
            this.notes =  '';
            this.custRate = '';
            this.rate = '';
            this.discount = '';
          }
          

     }
    
  }

createLoader(message: string = "Please wait...") { // Optional Parameter
  this.loading = this.loadingCtrl.create({
    content: message
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterialListPage');
  }

  cancelPage(){
    if(this.navParams.get('pageName') == 'add'){

      this.navCtrl.push(QuotationDetailsPage, {id: this.navParams.get('quoteID')});
     
     
      this.materialId =  '';
      this.productName =  '';
      this.quantity =  '';
      this. total =  '';
      this.perUnitRate = '';
      this.notes =  '';
      this.custRate = '';
      this.rate = '';
      this.discount = '';

    }else{
      if(this.saveMaterialToQuotationData == '' || this.saveMaterialToQuotationData == undefined){
        this.saveMaterialToQuotationData = this.navParams.get('productData');
      }
      this.events.publish('event-saveMaterialToQuotationData', this.saveMaterialToQuotationData);
      this.navCtrl.pop();
    }
    
  }
 
}
