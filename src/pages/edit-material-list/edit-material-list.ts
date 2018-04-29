import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ApiService } from '../../api-services/api.services';

import { AddMaterialPage } from '../add-material/add-material';
import { AddMaterialListPage } from '../add-material-list/add-material-list';
import { QuotationDetailsPage } from '../quotation-details/quotation-details';

@IonicPage()
@Component({
  selector: 'page-edit-material-list',
  templateUrl: 'edit-material-list.html',
})
export class EditMaterialListPage {
  id: any;
  loading: Loading;
  loadingConfig: any;
  quotationDetailsData: any = [];
  disabledForCancel: boolean = false;
  disabledForEdit: boolean = false;
  chkBoxStatus: boolean = false;
  deleteBtnColor: any = 'dark';
  editBtnColor: any = 'dark';
  materialList: any = [];
  new_materialList: any = [];
  materialListArray: any = [];
  delMaterialId: any = [];

  showsearchbar: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public apiServices: ApiService,
    private toastCtrl: ToastController
  ) {
    this.id = this.navParams.get('id');

    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getQuotationDetail(this.navParams.get('id'))
        .subscribe(response => {
          this.loading.dismiss();
          this.quotationDetailsData = response.quotationDtls;
          this.materialList = this.quotationDetailsData.materialList;

          this.materialList.forEach((itemObj, key) => {

            this.new_materialList.push({
              'materialId': itemObj.materialId,
              'productName': itemObj.productName,
              'notes': itemObj.notes,
              'quantity': itemObj.quantity,
              'perUnitRate': itemObj.perUnitRate,
              'totalAmt': itemObj.totalAmt,
              'productId': itemObj.productId,
              'checked': 'false'
            });

          });


          if (this.materialListArray.length == 0) {
            this.disabledForCancel = false;
            this.disabledForEdit = false;

            this.editBtnColor = 'dark';
            this.deleteBtnColor = 'dark';

            return false;
          }

        }, error => {
          this.loading.dismiss();
        });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditMaterialListPage');
  }

  ionViewWillEnter() {
    this.disabledForCancel = true;
    this.disabledForEdit = true;

    this.editBtnColor = 'secondary';
    this.deleteBtnColor = 'primary';

  }

  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  checkboxChange(status) {

    this.materialListArray = [];
    this.new_materialList.forEach((itemObj, key) => {
      if (itemObj.checked == true) {

        this.materialListArray.push({
          'materialId': itemObj.materialId,
          'productName': itemObj.productName,
          'notes': itemObj.notes,
          'quantity': itemObj.quantity,
          'perUnitRate': itemObj.perUnitRate,
          'totalAmt': itemObj.totalAmt,
          'productId': itemObj.productId,
          'checked': itemObj.checked
        });
      }
    });

    if (this.materialListArray.length == 0) {
      this.disabledForCancel = false;
      this.disabledForEdit = false;

      this.editBtnColor = 'dark';
      this.deleteBtnColor = 'dark';

      return false;
    } else if (this.materialListArray.length == 1) {

      this.disabledForCancel = true;
      this.disabledForEdit = true;

      this.editBtnColor = 'secondary';
      this.deleteBtnColor = 'primary';

      return false;
    } else if (this.materialListArray.length > 1) {

      this.disabledForCancel = true;
      this.disabledForEdit = false;

      this.editBtnColor = 'dark';
      this.deleteBtnColor = 'secondary';

      return false;
    }


  }

  goToMaterialPage() {
    this.navCtrl.push(AddMaterialPage, {
      'pageName': 'edit',
      materialListArray: this.materialListArray,
      quoteID: this.navParams.get('id')
    });
  }

  addMaterial() {
    this.navCtrl.push(AddMaterialPage, {
      'pageName': 'add',
      quoteID: this.navParams.get('id')
    });
  }

  deleteMaterial() {
    this.id = this.navParams.get('id');
    this.materialListArray.forEach((v, k) => {
      this.delMaterialId.push({
        'materialId': v.materialId
      });
    });

    let delMaterialIdData = {
      "materialIdList": this.delMaterialId
    }



    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.deleteMaterialInQuotation(this.navParams.get('id'), delMaterialIdData)
        .subscribe(response => {
          this.loading.dismiss();
          this.navCtrl.push(QuotationDetailsPage, { id: this.navParams.get('id') });


        }, error => {
          this.loading.dismiss();
          let toast = this.toastCtrl.create({
            message: error.responseMessage.message,
            duration: 2000,
            position: 'top'
          });
          toast.present();
        });
    });

  }

  opensearchbox() {
    this.showsearchbar = !this.showsearchbar;
  }

  setFilteredItems(ev: any) {

    this.apiServices.getQuotationDetail(this.navParams.get('id'))
      .subscribe(response => {

        this.quotationDetailsData = response.quotationDtls;
        this.new_materialList = this.quotationDetailsData.materialList;

        let val = ev.target.value;
        if (val && val.trim() != '') {
          this.new_materialList = this.new_materialList.filter((item) => {
            return (item.productName.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }

      }, error => {
        //this.errorMessage = <any>error
      });
  }

}


