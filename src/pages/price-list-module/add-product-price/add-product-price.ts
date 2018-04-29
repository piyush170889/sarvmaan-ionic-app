import { Component } from '@angular/core';
import { Events, NavController, LoadingController, Loading, NavParams, ToastController } from 'ionic-angular';
import { ApiServiceProvider } from '../../../api-services/globalApi.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductListPage } from '../../product-list-page/product-list-page';

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
  selectedProduct:any = {
    productName: '',
    productId: ''
  };
  public newPriceAddSuccess: any;
  public updatePriceAddSuccess: any;

  

  constructor(
    public navCtrl: NavController,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private toastCtrl: ToastController,
    public events: Events
  ) {
    this.addProductForm = this._FORMBUILDER.group({
      'formProductName': ['', Validators.required],
      'p1': ['', Validators.required],
      'p2': ['', Validators.required],
      'p3': ['', Validators.required],
      'notes': ['', Validators.required]
    });

    this.requestType = navParams.get("id");
    if (this.requestType == 'UPDATE') {
      this.updateRequestData = navParams.get("data")
    }

    events.subscribe('event-productName', (data) => {
      this.addProductForm.controls['formProductName'].setValue(data);
      this.selectedProduct.productName = data;     
    });
  
    events.subscribe('event-productId', (data) => {
      this.selectedProduct.productId = data;
    });

  }  

  ionViewWillEnter() {
    this.updatePriceAddSuccess = this.toastCtrl.create({
      message: 'Product price updated successfully.',
      duration: 900,
      position: 'top'
    });

    this.newPriceAddSuccess = this.toastCtrl.create({
      message: 'New product price add successfully.',
      duration: 900,
      position: 'top'
    });
    console.log('ionViewDidLoad AddProductPricePage');
    

  }
  ionViewDidEnter(){
    setTimeout(()=>{
      if (this.requestType == 'UPDATE') {
        if (this.selectedProduct.productId != '' && this.selectedProduct.productName != '') {
          this.addProductForm.controls['formProductName'].setValue(this.selectedProduct.productName);
        }else{
          this.addProductForm.controls['formProductName'].setValue(this.updateRequestData.product.productName); 
          this.selectedProduct.productName = this.updateRequestData.product.productName;
          this.selectedProduct.productId = this.updateRequestData.product.productId;        
        }        
        this.addProductForm.controls['p1'].setValue(this.updateRequestData.firstPrice);
        this.addProductForm.controls['p2'].setValue(this.updateRequestData.secondPrice);
        this.addProductForm.controls['p3'].setValue(this.updateRequestData.thirdPrice);
        this.addProductForm.controls['notes'].setValue(this.updateRequestData.info);
      }
    }, 10)
    
  }

  saveProductPrice() {
    if (this.requestType == 'UPDATE') {
      this.updateProductPrice();
    } else {
      this.addNewProductPrice();
    }    
  }

  updateProductPrice(){
    let data = this.getSaveUpdateData();
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
    let data = this.getSaveUpdateData();
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

  getSaveUpdateData(){
    //let selectedProduct
    // this.productNameList.forEach(element => {
    //   if(element.productId == this.addProductForm.controls['formProductName'].value){
    //     selectedProduct = element;
    //   }
    // });
    let data = {
      "product": {
        "productId": this.selectedProduct.productId,
        "productName": this.selectedProduct.productName
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
return data;
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  navigateToSelectProduct() {
    this.navCtrl.push(ProductListPage);
  }

  cancelClicked() {
    this.navCtrl.pop();
  }

 

}
