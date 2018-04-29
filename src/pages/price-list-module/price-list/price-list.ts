import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ApiServiceProvider } from '../../../api-services/globalApi.services';
import { AddProductPricePage } from '../../../pages/price-list-module/add-product-price/add-product-price';

@Component({
  selector: 'page-price-list',
  templateUrl: 'price-list.html',
})
export class PriceListPage {

  constructor(
    public navCtrl: NavController,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }
  loading: Loading;
  loadingConfig: any;
  priceList: any = [];
  deleteSuccess: any;

  ionViewWillEnter() {
    console.log('ionViewDidLoad PriceListPage');
    this.getVendorPriceList();
    this.deleteSuccess = this.toastCtrl.create({
      message: 'Product deleted successfully.',
      duration: 900,
      position: 'top',
    });

  }

  getVendorPriceList() {
    this.priceList = [];
    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.getDataRequest('vendors', false)
        .subscribe(response => {          
          this.priceList = response.vendorPriceList;
          this.loading.dismiss();
        }, error => {
          this.loading.dismiss();
          alert('Unable to fetch price list. An server error occured.');
          this.navCtrl.pop();
        });
    });
  }

  deleteVendorPrice(item) {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.deleteDataRequest('vendor/' + item.id)
        .subscribe(response => {
          this.loading.dismiss();
          this.deleteSuccess.present();

          setTimeout(() => {
            this.getVendorPriceList();
          }, 800)

        }, error => {
          this.loading.dismiss();
          alert('Unable to delete. An server Error occured')
        });
    });
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });
  }

  addProductPrice() {
    this.navCtrl.push(AddProductPricePage, { id: 'ADD_NEW' });
  }

  updateProductPrice(selectedProduct) {
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
