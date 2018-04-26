import { Component } from '@angular/core';
import { NavController, LoadingController, Loading   } from 'ionic-angular';
import { ApiServiceProvider } from '../../api-services/globalApi.services';
import { AddProductPricePage } from '../../pages/add-product-price/add-product-price';

@Component({
  selector: 'page-price-list',
  templateUrl: 'price-list.html',
})
export class PriceListPage {

  constructor(
    public navCtrl: NavController, 
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController) {
  }
  loading: Loading;
  loadingConfig: any;
  priceList:any = []; 

  ionViewWillEnter() {
    console.log('ionViewDidLoad PriceListPage');
    this.getVendorPriceList();
  }

  getVendorPriceList(){
    this.priceList = [];
    this.createLoader();
    this.loading.present().then(() => {
    this.apiService.getDataRequest('vendors', false)
         .subscribe(response => {
           this.priceList = response.vendorPriceList;           
           this.loading.dismiss();
         }, error => {
          this.loading.dismiss();
          alert('Server error occured.') 
         });
   });
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  addProductPrice(){
    this.navCtrl.push(AddProductPricePage, { id: 'ADD_NEW'});
  }
  
  updateProductPrice(selectedProduct){
    let dataSet = {
      product: selectedProduct.product,
      id: selectedProduct.id,
      info: selectedProduct.info, 
      firstPrice: selectedProduct.firstPrice,
      secondPrice: selectedProduct.secondPrice,
      thirdPrice: selectedProduct.thirdPrice
    }
    this.navCtrl.push(AddProductPricePage, { id: 'UPDATE', data: dataSet });
  }

}
