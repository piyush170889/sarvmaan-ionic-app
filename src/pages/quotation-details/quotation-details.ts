import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController } from 'ionic-angular';
import { ApiService } from '../../api-services/api.services';
import { TermModalPage } from '../../pages/vendor-registration/term-modal/term-modal';
import { EditMaterialListPage } from '../../pages/edit-material-list/edit-material-list';

@IonicPage()
@Component({
  selector: 'page-quotation-details',
  templateUrl: 'quotation-details.html',
})
export class QuotationDetailsPage {
  loading: Loading;
  loadingConfig: any;
  quotationDetailsData:any = [];
  quotationId: any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private loadingCtrl: LoadingController, public apiServices: ApiService) {
     this.quotationId = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationDetailsPage');
    this.createLoader();
    this.loading.present().then(() => {
    this.apiServices.getQuotationDetail(this.navParams.get('id'))
         .subscribe(response => {
           this.loading.dismiss();
           this.quotationDetailsData = response.quotationDtls;
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
  
  openTermsModal(msg){
    let profileModal = this.modalCtrl.create(TermModalPage, { msg: msg });
    profileModal.present();
  }

  expandList(id){
    console.log(id)
    this.navCtrl.push(EditMaterialListPage, {id:id});
  }

}
