import { Component } from '@angular/core';
import { NavController, LoadingController, Loading  } from 'ionic-angular';
import { ApiService } from '../../api-services/api.services';
import { AddUpdateQuotePage } from '../../pages/add-update-quote/add-update-quote';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading;
  loadingConfig: any;
  quoteList:any = []; 
  allQuoteList:any = []; 
  sarvmaanTab:boolean = true;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public apiServices: ApiService) {

  }

  sarvmanTabClicked(){
    this.sarvmaanTab = true;
    this.quoteList = this.allQuoteList.sarvMaanQuotationDtlsList;
  }

  customerTabClicked(){
    this.sarvmaanTab= false;
    this.quoteList = this.allQuoteList.selfQuotationDtlsList;
  }

  getsarvmanList(){
    this.createLoader();
    this.loading.present().then(() => {
    this.apiServices.getSarvamList()
         .subscribe(response => {
           this.allQuoteList = response;
           this.quoteList = response.sarvMaanQuotationDtlsList;
             this.loading.dismiss();
         }, error => {
           this.loading.dismiss();
           //this.errorMessage = <any>error
         });
   });
  }
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }
  
  ionViewDidLoad() {   
    this.createLoader(); 
    this.getsarvmanList();
  }
  
  addNewQuote(){
    this.navCtrl.push(AddUpdateQuotePage);
  }

}
