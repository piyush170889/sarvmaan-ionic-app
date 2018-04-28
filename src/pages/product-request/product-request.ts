import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, NavParams, ToastController } from 'ionic-angular';
import { ApiServiceProvider } from '../../api-services/globalApi.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-product-request',
  templateUrl: 'product-request.html',
})
export class ProductRequestPage {
  productRequestForm: FormGroup;
  loading: Loading;
  loadingConfig: any;
  addProductRequestSuccess: any;
  productNameList: any = [
    {
      productId: 'asdasds1',
      productName: 'Product One' 
    },
    {
      productId: 'asdasds2',
      productName: 'Product Two' 
    },
    {
      productId: 'asdasds3',
      productName: 'Product Three' 
    },
    {
      productId: 'asdasds4',
      productName: 'Product Four' 
    }
 ];
  constructor(
    public navCtrl: NavController,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.productRequestForm = this._FORMBUILDER.group({
      'hierarchy': ['', Validators.required],
      'productName': ['', Validators.required],
      'notes': ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.addProductRequestSuccess = this.toastCtrl.create({
      message: 'Product request submited successfully.',
      duration: 900,
      position: 'top'
    });       
  }

  submitProductRequest(){
    let data = {
      "productCategoryId":"5ab4f3990a975a39156999ef",
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



}
