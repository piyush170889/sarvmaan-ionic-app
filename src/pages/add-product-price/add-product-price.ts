import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, NavParams, ToastController } from 'ionic-angular';
import { ApiServiceProvider } from '../../api-services/globalApi.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectProductListPage } from '../select-product-list/select-product-list'

@Component({
  selector: 'page-add-product-price',
  templateUrl: 'add-product-price.html',
})
export class AddProductPricePage {

  addProductForm: FormGroup;
  loading: Loading;
  loadingConfig: any;
  requestType: any;
  updateRequestData: any;
  public newPriceAddSuccess: any;
  public updatePriceAddSuccess: any;

  constructor(
    public navCtrl: NavController,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.addProductForm = this._FORMBUILDER.group({
      'productName': ['', Validators.required],
      'p1': ['', Validators.required],
      'p2': ['', Validators.required],
      'p3': ['', Validators.required],
      'notes': ['', Validators.required]
    });

    this.requestType = navParams.get("id");
    if (this.requestType == 'UPDATE') {
      this.updateRequestData = navParams.get("data")
    }

  }

  ionViewWillEnter() {
    this.updatePriceAddSuccess = this.toastCtrl.create({
      message: 'Product price updated successfully.',
      duration: 900,
      position: 'bottom'
    });

    this.newPriceAddSuccess = this.toastCtrl.create({
      message: 'New product price add successfully.',
      duration: 900,
      position: 'bottom'
    });
    console.log('ionViewDidLoad AddProductPricePage');
    if (this.requestType == 'UPDATE') {
      this.addProductForm.controls['productName'].setValue(this.updateRequestData.product.productName);
      this.addProductForm.controls['p1'].setValue(this.updateRequestData.firstPrice);
      this.addProductForm.controls['p2'].setValue(this.updateRequestData.secondPrice);
      this.addProductForm.controls['p3'].setValue(this.updateRequestData.thirdPrice);
      this.addProductForm.controls['notes'].setValue(this.updateRequestData.info);
    }

  }

  saveProductPrice() {
    if (this.requestType == 'UPDATE') {
      this.updateProductPrice();
    } else {
      this.addNewProductPrice();
    }    
  }

  updateProductPrice(){
    let data = {
      "product": {
        "productId": "asdasds",
        "productName": "Electrsjkha"
      },
      "firstPrice": this.addProductForm.controls['p1'].value,
      "secondPrice": this.addProductForm.controls['p2'].value,
      "thirdPrice": this.addProductForm.controls['p3'].value,
      "info": this.addProductForm.controls['notes'].value,
      "isActive": 1,
      "createdTs": "",
      "modifiedTs": "",
      "createdBy": "",
      "modifiedBy": ""
    }

    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.updateDataRequest('vendor/'+ this.updateRequestData.id, data)
        .subscribe(response => {
          this.loading.dismiss();
          this.updatePriceAddSuccess.present();
          setTimeout(() => {
            this.navCtrl.pop();
          }, 1000)
        }, error => {
          this.loading.dismiss();
          alert('Server error occured.')
        });
    });
  }

  addNewProductPrice(){
    let data = {
      "product": {
        "productId": "asdasds",
        "productName": "Electrsjkha"
      },
      "firstPrice": this.addProductForm.controls['p1'].value,
      "secondPrice": this.addProductForm.controls['p2'].value,
      "thirdPrice": this.addProductForm.controls['p3'].value,
      "info": this.addProductForm.controls['notes'].value,
      "isActive": 1,
      "createdTs": "",
      "modifiedTs": "",
      "createdBy": "",
      "modifiedBy": ""
    }

    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.saveDataRequest('vendor', data, false)
        .subscribe(response => {
          this.loading.dismiss();
          this.newPriceAddSuccess.present();
          setTimeout(() => {
            this.navCtrl.pop();
          }, 1000)
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

  navigateToSelectProduct() {
    this.navCtrl.push(SelectProductListPage);
  }

  cancelClicked() {
    this.navCtrl.pop();
  }

}
