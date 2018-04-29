import { Component } from '@angular/core';
import { Events, NavController, LoadingController, Loading, NavParams, ToastController } from 'ionic-angular';
import { ApiServiceProvider } from '../../../api-services/globalApi.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductListPage } from '../../product-list-page/product-list-page';

@Component({
  selector: 'page-product-request',
  templateUrl: 'product-request.html',
})
export class ProductRequestPage {
  productRequestForm: FormGroup;
  loading: Loading;
  loadingConfig: any;
  addProductRequestSuccess: any;
  selectedProduct: any = {
    productName: '',
    productId: ''
  };

  constructor(
    public navCtrl: NavController,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController,
    public events: Events
  ) {
    this.productRequestForm = this._FORMBUILDER.group({
      'hierarchy': ['', Validators.required],
      'productName': ['', Validators.required],
      'notes': ['', Validators.required]
    });

    events.subscribe('event-productName', (data) => {
      this.selectedProduct.productName = data;
    });

    events.subscribe('event-productId', (data) => {
      this.selectedProduct.productId = data;
    });
  }

  ionViewWillEnter() {
    this.addProductRequestSuccess = this.toastCtrl.create({
      message: 'Product request submited successfully.',
      duration: 900,
      position: 'top'
    });

    if (this.selectedProduct.productId != '' && this.selectedProduct.productName != '') {
      this.productRequestForm.controls['hierarchy'].setValue(this.selectedProduct.productName);
    }
  }

  submitProductRequest() {
    let data = {
      "productCategoryId": this.selectedProduct.productId,
      "productName": this.productRequestForm.controls['productName'].value,
      "notes": this.productRequestForm.controls['notes'].value
    }

    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.saveDataRequest('product-request', data, false)
        .subscribe(response => {
          this.loading.dismiss();
          this.addProductRequestSuccess.present();
          setTimeout(() => {
            this.navCtrl.pop();
          }, 2000)
        }, error => {
          this.loading.dismiss();
          alert('Server error occured.')
        });
    });

    //alert('API required.')
  }


  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  cancelClicked() {
    this.navCtrl.pop();
  }
  navigateToSelectProduct() {
    this.navCtrl.push(ProductListPage);
  }



}
