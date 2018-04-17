import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddMaterialListPage } from '../add-material-list/add-material-list'; 
/*import { ProductListPage } from '../product-list/product-list';*/


@IonicPage()
@Component({
  selector: 'page-add-material',
  templateUrl: 'add-material.html',
})
export class AddMaterialPage {
   uniqueId: any;
   productNameList: any = [];
   rateList: any = [];
   unitList: any = [];

   custRate:any;
   amount:any;
   notes:any;
   productName:any;
   rate:any;
   unit:any;
   materialId: any;
   quantity: any;

   editData:any = [];
   data:any;
   total: any= 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.uniqueId = Math.random().toString(36).substr(2, 9);
    console.log(this.uniqueId);
    this.materialId = this.uniqueId;

    console.log(this.navParams.get('pageName'))
    console.log(JSON.stringify(this.navParams.get('materialListArray')))
   
    if(this.navParams.get('pageName') == 'edit'){
        
      this.navParams.get('materialListArray').forEach((v,k) => {
        this.productName = v.productName;
        this.amount = v.totalAmt;
        //this.unit = this.navParams.get('materialListArray').perUnitRate
        this.custRate = v.perUnitRate;
        this.notes = v.notes;
        this.uniqueId = v.materialId;
        this.data = {
          'materialId': this.uniqueId,
          'productName':this.productName,
          'notes':	this.notes,
          'quantity':	v.quantity,
          'perUnitRate':	this.custRate,
          'totalAmt':	this.total,
          'checked': v.checked
        };
        

      });

      console.log(this.data)
        
        
    }
    
    
   
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterialPage');
  }

  gotoaddMateriallist()
  {
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

    this.data = {
      materialId: this.uniqueId,
      productName: this.productName,
      quantity: this.quantity,
      unit: this.unit,
      totalAmt: this.total,
      perUnitRate: this.rate,
      notes: this.notes
    }
    console.log(this.data)
    
    this.navCtrl.push(AddMaterialListPage, {productData: this.data});
  }
  gotoProductlist()
  {
    //this.navCtrl.push(ProductListPage);
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


}
