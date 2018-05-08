import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events, Select } from 'ionic-angular';
import { AddMaterialListPage } from '../add-material-list/add-material-list';
/*import { ProductListPage } from '../product-list/product-list';*/
import { ApiService } from '../../api-services/api.services';

@IonicPage()
@Component({
  selector: 'product-list-page',
  templateUrl: 'product-list-page.html',
})
export class ProductListPage {

  @ViewChild('select1') select1: Select;

  getAllCategories: any = [];
  showLevel1 = null;
  showLevel2 = null;
  productCategoryList: any = [];
  productCategoryListNew: any = [];
  productsList: any = [];
  productsListData: any = [];
  loading: Loading;
  loadingConfig: any;
  tempCatergoryID: any = 0;
  subCategories: any = [];
  sub_Sub_Categories: any = [];
  productListData: any = [];
  getProductNames: any = [];
  getProductData: any = [];
  showProductDropdown: boolean = false;
  rateList: any = [];
  isFromProductRequestPage: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public events: Events,
    private loadingCtrl: LoadingController,
    public apiServices: ApiService
  ) {
    if (navParams.get("id") == 'PRODUCT_REQUEST') {
      this.isFromProductRequestPage = true;
    } else {
      this.isFromProductRequestPage = false;
    }
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getAllCategoryList()
        .subscribe(response => {
          this.loading.dismiss();
          this.getAllCategories = Array.of(response);
          this.getAllCategories.forEach((v, k) => {
            this.productCategoryListNew = v.productCategoryList;
            this.productCategoryListNew.forEach((v1, k1) => {


              if (v1.parentCategoryId == "") {
                this.productsListData.push({ "catName": v1.categoryName, "id": v1.id, "child": this.getCategoriesChild(v1.id) });
                this.productCategoryList.push(v1);
              }
            });
          });
        });
    }, error => {
      this.loading.dismiss();
      //this.errorMessage = <any>error
    });

  }

  /*Display Recursive List :start */

  list = this.productsListData;
  selectedList: any = [];
  onSelect(list: any): void {

    list.hide = !list.hide;
    this.selectedList = Array.of(list);

    console.log(this.selectedList);
    this.selectedList.forEach(element => {

      if (element.child.length == 0) {
        if (this.isFromProductRequestPage) {
          this.events.publish('event-productName', list.catName);
          this.events.publish('event-productId', list.id);
          this.navCtrl.pop();
        } else {
          console.log('get prod api');
          console.log(element.id);
          this.getProducts(element.id);
        }
      }
    });

  }

  /*Display Recursive List :End */

  getCategoriesChild(id) {
    let dataArray = [];
    this.productCategoryListNew.forEach((v, k) => {

      if (v.parentCategoryId == id) {
        dataArray.push({ "catName": v.categoryName, "id": v.id, "child": this.getCategoriesChild(v.id) });
      }

    })

    return dataArray;
  }

  getSubCategories(id) {

    this.subCategories = [];
    this.productCategoryListNew.forEach((v, k) => {

      if (v.parentCategoryId == id) {
        this.subCategories.push(v);
      }

    });

    if (this.subCategories.length == 0) {

      this.getProducts(id);
    }
  }
  getSub_Sub_Categories(id) {

    this.sub_Sub_Categories = [];
    this.productCategoryListNew.forEach((v, k) => {

      if (v.parentCategoryId == id) {
        this.sub_Sub_Categories.push(v);
      }

    });

    if (this.sub_Sub_Categories.length == 0) {
      this.getProducts(id);
    }
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterialPage');
  }


  getProducts(id) {
    this.getProductData = [];
    this.getProductNames = [];

    this.apiServices.getProductsByCatId(id)
      .subscribe(response => {

        this.getProductNames = response.productsList;
        this.showProductDropdown = true;
        this.getProductNames.forEach((v, k) => {

          this.getProductData.push(
            {
              'productName': v.productName,
              'id': v.id
            }
          );
        });

        console.log(this.getProductData);
        if (this.getProductData != '') {
          setTimeout(() => {
            this.select1.open();
          }, 150);
        } else {
          let toast = this.toastCtrl.create({
            message: 'No Products Available',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        }

      }, error => {
        //this.errorMessage = <any>error
      });

  }

  getProductName(productName) {

    if (productName != '') {

      this.getProductData.forEach((v, k) => {
        if (productName == v.productName) {

          this.createLoader();
          this.loading.present().then(() => {
            this.apiServices.getRateListByProductId(v.id).subscribe((response) => {

              console.log(response.rateList)
              this.loading.dismiss();
              if (response.rateList == '') {
                this.rateList = [];
                this.events.publish('event-productName', productName);
                this.events.publish('event-productId', v.id);
                this.events.publish('event-rateList', this.rateList);
                this.navCtrl.pop();
              } else {
                this.rateList = response.rateList;
                console.log("rtList==" + this.rateList)
                this.events.publish('event-productName', productName);
                this.events.publish('event-productId', v.id);
                this.events.publish('event-rateList', this.rateList);
                this.navCtrl.pop();
              }


            }, (err) => {
              this.loading.dismiss();
            })
          })
        }
      });

    }
  }



  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
