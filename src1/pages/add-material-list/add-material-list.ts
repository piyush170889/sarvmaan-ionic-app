import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController, Loading } from 'ionic-angular';
import { ListPage } from '../list/list';

import { ApiService } from '../../api-services/api.services';
import { AddUpdateQuotePage } from '../add-update-quote/add-update-quote';

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

  saveMaterialToQuotationData:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, public apiServices: ApiService) {

    console.log(this.navParams.get('productData'));
    this.materialId = this.navParams.get('productData').materialId;
    console.log(this.materialId);
    this.notes = this.navParams.get('productData').notes
    this.productNameList = [
       'Product One','Product Two','Product Three','Product Four'
    ];

    this.rateList = [
      '12000','15000','10000'
    ];

   this.unitList = [
    'Hundreds','Thousands','Lacs','Crore'
   ];

  }

  getProductName(productName){
    console.log(productName)
  }

  getRate(rate){
    console.log(rate.split('/')[0])
    this.total = this.quantity * rate.split('/')[0];
   
}

getCustRate(rate){
  console.log(rate)
  this.total = this.quantity * rate;
 
}

  getUnit(unit){
    console.log(unit)
  }

  saveMaterialToQuotation(){
    console.log(this.rate.split('/')[0])
    console.log(this.custRate)
    if(this.rate.split('/')[0] != '' &&  this.custRate != ''){
       this.rate = '';
       this.rate = this.custRate;
       console.log(this.rate)
    }else if(this.rate.split('/')[0] != '' &&  this.custRate == ''){
      this.rate = this.rate.split('/')[0];
      console.log(this.rate)
    }else if(this.rate.split('/')[0] != '' &&  this.custRate == ''){
      this.rate = this.rate.split('/')[0];
      console.log(this.rate)
    }
    let data = {
        productName: this.productName,
        quantity: this.quantity,
        //unit: this.unit,
        perUnitRate: this.rate,
        notes: this.notes,
        materialId: this.materialId,
        totalAmt: this.navParams.get('productData').totalAmt,
        custRate: this.custRate
    }
    console.log(data)

    this.saveMaterialToQuotationData = data;
    this.navCtrl.push(AddUpdateQuotePage,{saveMaterialToQuotationData: this.saveMaterialToQuotationData})
   // this.saveMaterialToQuotationData = [];
    /* this.createLoader();
      this.loading.present().then(() => {
      this.apiServices.addMaterialToQuotation(data)
           .subscribe(response => {
             this.loading.dismiss();
             console.log(response)
             //this.saveMaterialToQuotationData = response.quotationDtls;
           }, error => {
             this.loading.dismiss();
             //this.errorMessage = <any>error
           });
     });*/

}

createLoader(message: string = "Please wait...") { // Optional Parameter
  this.loading = this.loadingCtrl.create({
    content: message
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterialListPage');
  }
 
}
