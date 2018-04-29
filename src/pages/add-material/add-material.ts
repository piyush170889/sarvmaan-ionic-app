import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, Events } from 'ionic-angular';
import { AddMaterialListPage } from '../add-material-list/add-material-list'; 
import { ProductListPage } from '../product-list-page/product-list-page';
import { ApiService } from '../../api-services/api.services';
import { HomePage } from '../home/home';
import { EditMaterialListPage } from '../../pages/edit-material-list/edit-material-list';
import { QuotationDetailsPage } from '../../pages/quotation-details/quotation-details';
import { AddUpdateQuotePage } from '../../pages/add-update-quote/add-update-quote';

@IonicPage()
@Component({
  selector: 'page-add-material',
  templateUrl: 'add-material.html',
})
export class AddMaterialPage {
  
   uniqueId: any;
   productNameList: any = [];
   allProductsDropdown : any = [];
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
   perUnitRate: any;
   saveMaterialToQuotationData: any = [];
   discount: any;
   checked: any;
   disabled: boolean = false;
   editDataParams: any;
   pageName: any;

   loading: Loading;
   loadingConfig: any;

   addMaterialData: any = [];
   quoteID: any;
   productId: any;

   disableRateList : boolean = false;
   hideDiscount : boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private toastCtrl: ToastController,
    public events: Events,  
    public apiServices: ApiService, 
    private loadingCtrl: LoadingController
  ) {

    this.uniqueId = Math.random().toString(36).substr(2, 9);
    this.materialId = this.uniqueId;
    this.pageName = this.navParams.get('pageName');
    this.quoteID = this.navParams.get('quoteID');

   if(this.navParams.get('pageName') == 'edit'){
        
        this.navParams.get('materialListArray').forEach((v,k) => {
        this.productName = v.productName;
        this.total = v.totalAmt;
        this.custRate = v.perUnitRate;
        this.perUnitRate = v.perUnitRate;
        this.notes = v.notes;
        this.materialId = v.materialId;
        this.quantity = v.quantity;
        this.checked = v.checked;
        this.productId = v.productId;
        this.productNameList.push({'name':this.productName});
        console.log(this.productNameList)
        this.disabled = true;
        
        this.disableRateList = true;
        
        this.rateList = [
          '12000','15000','10000'
        ];
        
       });
    }else if(this.navParams.get('pageName') == 'editMaterialLocally'){
      this.hideDiscount = true;  
      this.navParams.get('materialListArray').forEach((v,k) => {
      this.productName = v.productName;
      this.total = v.totalAmt;
      this.custRate = v.perUnitRate;
      this.perUnitRate = v.perUnitRate;
      this.notes = v.notes;
      this.materialId = v.materialId;
      this.quantity = v.quantity;
      this.checked = v.checked;
      this.productId = v.productId;
      this.productNameList.push({'name':this.productName});
      console.log(this.productNameList)
      this.disabled = true;

      this.disableRateList = true;
      this.rateList = [
        '12000','15000','10000'
      ];
      
     });

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

  }else{
        /*this.productNameList = [
          {'name':'Product One', 'id':'2'},
          {'name':'Product Two', 'id':'3'},
          {'name':'Product Three', 'id':'4'},
          {'name':'Product Four', 'id':'7'}
        ];*/

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
    }
    
    

   this.unitList = [
    'Hundreds','Thousands','Lacs','Crore'
   ];
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterialPage');
  }

  gotoaddMateriallist() {

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

    console.log(this.data)
    
    if(
      this.materialId == '' || this.materialId == undefined
      || this.quantity == '' || this.quantity == undefined
      || this.notes == '' || this.notes == undefined
     ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 2000,
        position: 'top'
      });
      toast.present();
     }else{
          
        this.saveMaterialToQuotationData.push(this.data); 
          
        let toast = this.toastCtrl.create({
          message: 'Added successfully !',
          duration: 2000,
          position: 'top'
        });
        toast.present();
  
        if(this.navParams.get('pageName') == 'edit'){
           
          this.saveMaterialToQuotationData.forEach((v,k) => {
          this.createLoader();
          this.loading.present().then(() => {
              this.apiServices.editMaterialInQuotation(this.quoteID,v).subscribe((response) => {
                this.navCtrl.push(QuotationDetailsPage, {id: this.quoteID});
                this.loading.dismiss();
                
              }, (err) => {
                this.loading.dismiss();
              })
            })

           });

        }else if(this.navParams.get('pageName') == 'add'){
             
          this.createLoader();
          this.loading.present().then(() => {
          this.apiServices.addMaterialToQuotation(this.quoteID,this.data).subscribe((response) => {
              this.navCtrl.push(AddMaterialListPage, {
                  pageName: 'add',
                  quoteID: this.quoteID
              });
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

        }else if(this.navParams.get('pageName') == 'editMaterialLocally'){
             
          this.events.publish('event-saveMaterialToQuotationData', this.saveMaterialToQuotationData);
          this.navCtrl.pop();
                    
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
            this.navCtrl.pop();
            this.navCtrl.push(AddMaterialListPage, {productData: this.saveMaterialToQuotationData});
                    
            this.materialId =  '';
            this.productName =  '';
            this.quantity =  '';
            this. total =  '';
            this.perUnitRate = '';
            this.notes =  '';
            this.custRate = '';
            this.rate = '';
            this.discount = '';
           
           this.loading.dismiss();
         }
     } 

 }
  gotoProductlist()
  {
   
    this.navCtrl.push(ProductListPage);
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

  getRate(){
    if(this.rate == '' || this.rate == undefined){
      this.rate = 0;
    }else{
      this.perUnitRate = this.rate.split('/')[0];
      this.total = this.quantity * this.perUnitRate;
      this.custRate = '';
    }
  }

  getCustRate(){
    this.perUnitRate = this.custRate;
    this.total = this.quantity * this.perUnitRate;
    this.rate = '';
    
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

  cancelPage(){
    this.navCtrl.pop();
  }

  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
