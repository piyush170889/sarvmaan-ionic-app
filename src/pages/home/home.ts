import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, Events   } from 'ionic-angular';
import { ApiServiceProvider } from '../../api-services/globalApi.services';
import { AddUpdateQuotePage } from '../../pages/add-update-quote/add-update-quote';
import { QuotationDetailsPage } from '../../pages/quotation-details/quotation-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading;
  loadingConfig: any;
  quoteList:any = []; 
  allQuoteList:any = []; 
  sarvmaanTab:boolean = false;
  showsearchbar: boolean = false;
  searchTerm: string = '';
  searchStatus:number = 1;

  page:any = 0;
  quoteListCust:any = [];
  quoteListSarv:any = [];

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public apiService: ApiServiceProvider, public events:Events) {
    this.sarvmaanTab = false;
    
  }

  sarvmanTabClicked(){
    this.sarvmaanTab = true;
    this.searchStatus = 2;
    this.getsarvmanListSarv();
  }

  customerTabClicked(){
    this.sarvmaanTab= false;
    this.searchStatus = 1;
    this.getsarvmanList();
  }

  getsarvmanList(){
    this.page = 0;
    this.quoteList = [];
    this.createLoader();
    this.loading.present().then(() => {
    this.apiService.getDataRequest('quotation?page='+this.page+'&quote-type=ALL', false)
         .subscribe(response => {
           this.allQuoteList = response;
           //this.quoteList = response.sarvMaanQuotationDtlsList;
           this.quoteList = response.selfQuotationDtlsList;
           this.sarvmaanTab= false;
           this.loading.dismiss();
         }, error => {
           this.loading.dismiss();
           //this.errorMessage = <any>error
         });
   });
  }
  getsarvmanListSarv(){
    this.page = 0;
    this.quoteList = [];
    this.createLoader();
    this.loading.present().then(() => {
    this.apiService.getDataRequest('quotation?page='+this.page+'&quote-type=ALL', false)
         .subscribe(response => {
           this.allQuoteList = response;
           this.quoteList = response.sarvMaanQuotationDtlsList;
           this.sarvmaanTab= true;
          // this.quoteList = response.selfQuotationDtlsList;
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
  
  ionViewWillEnter() {  
    this.events.publish('user:login');
    this.createLoader(); 
    this.getsarvmanList();
  }
  
  addNewQuote(){
    this.navCtrl.push(AddUpdateQuotePage);
  }

  goToQuotationDetailsPage(id){
    this.navCtrl.push(QuotationDetailsPage, {id:id});
  }
  
  opensearchbox()
  {
    this.showsearchbar = !this.showsearchbar;
  }

  setFilteredItems(ev: any) {
 
    this.apiService.getDataRequest('quotation?page='+this.page+'&quote-type=ALL', false)
    .subscribe(response => {
      this.allQuoteList = response;
      if(this.searchStatus == 2){
        this.quoteList = response.sarvMaanQuotationDtlsList;
      }else{
        this.quoteList = response.selfQuotationDtlsList;
      }
     let val = ev.target.value;
     console.log(JSON.stringify(val));
      if (val && val.trim() != '') {
        this.quoteList = this.quoteList.filter((item) => {
          return (item.workTitle.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.clientName.toLowerCase().indexOf(val.toLowerCase()) > -1 );
        })
      } 
        //this.loading.dismiss();
    }, error => {
     // this.loading.dismiss();
      //this.errorMessage = <any>error
    });
}


doInfinite(infiniteScroll) {
  this.page = this.page + 1;
 
  setTimeout(() => {
    /*const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });*/
    //this.showSpinner = true;
    this.apiService.getDataRequest('quotation?page='+this.page+'&quote-type=ALL', false)
    .subscribe(response => {
      this.allQuoteList = response;
      this.quoteListCust = response.selfQuotationDtlsList;
      this.quoteListSarv = response.sarvMaanQuotationDtlsList;
         
      if(this.searchStatus == 1){
        for(let i=0; i<this.quoteListCust.length; i++) {
          this.quoteList.push(this.quoteListCust[i]);
        }
       
        
      }else{
        infiniteScroll.enable(false);
      }

      if(this.searchStatus == 2){
        for(let i=0; i<this.quoteListSarv.length; i++) {
          this.quoteList.push(this.quoteListSarv[i]);
        }
       
       
      }else{
        infiniteScroll.enable(false);
      }


      
    }, error => {
      this.loading.dismiss();
      //this.errorMessage = <any>error
    });

      
  infiniteScroll.complete();
  //infiniteScroll.enable(false);

  }, 500);

  } 

}
