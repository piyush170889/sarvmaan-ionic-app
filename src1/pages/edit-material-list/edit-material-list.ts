import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ApiService } from '../../api-services/api.services';

import { AddMaterialPage } from '../add-material/add-material';
import { AddMaterialListPage } from '../add-material-list/add-material-list';

@IonicPage()
@Component({
  selector: 'page-edit-material-list',
  templateUrl: 'edit-material-list.html',
})
export class EditMaterialListPage {
  id: any;
  loading: Loading;
  loadingConfig: any;
  quotationDetailsData:any = [];
  disabledForCancel:boolean = false;
  disabledForEdit:boolean = false;
  chkBoxStatus:boolean = false;
  deleteBtnColor:any = 'dark';
  editBtnColor:any = 'dark';
  materialList:any=[];
  new_materialList:any=[];
  materialListArray:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, public apiServices: ApiService) {
     
    this.id = this.navParams.get('id');
     console.log(this.id)
     this.createLoader();
     this.loading.present().then(() => {
     this.apiServices.getQuotationDetail(this.navParams.get('id'))
          .subscribe(response => {
            this.loading.dismiss();
            this.quotationDetailsData = response.quotationDtls;
            this.materialList = this.quotationDetailsData.materialList;
       
        this.materialList.forEach((itemObj,key)=>{
              
          this.new_materialList.push({
            'materialId': itemObj.materialId,
            'productName':itemObj.productName,
            'notes':	itemObj.notes,
            'quantity':	itemObj.quantity,
            'perUnitRate':	itemObj.perUnitRate,
            'totalAmt':	itemObj.totalAmt,
            'checked': 'false'
          });
              
          });
          console.log(JSON.stringify(this.new_materialList));
          
          if(this.materialListArray.length == 0){
            this.disabledForCancel = false;
            this.disabledForEdit = false;
        
            this.editBtnColor = 'dark';
            this.deleteBtnColor = 'dark';
        
            return false;
          }

      }, error => {
            this.loading.dismiss();
            //this.errorMessage = <any>error
          });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditMaterialListPage');
  }

  ionViewWillEnter(){
    this.disabledForCancel = true;
    this.disabledForEdit = true;

    this.editBtnColor = 'secondary';
    this.deleteBtnColor = 'primary';

  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  checkboxChange(status){
    
    console.log(JSON.stringify(this.new_materialList));
    this.materialListArray = [];
    this.new_materialList.forEach((itemObj,key)=>{
      if(itemObj.checked==true){
      console.log(itemObj.materialId)
      this.materialListArray.push({
        'materialId': itemObj.materialId,
        'productName':itemObj.productName,
        'notes':	itemObj.notes,
        'quantity':	itemObj.quantity,
        'perUnitRate':	itemObj.perUnitRate,
        'totalAmt':	itemObj.totalAmt,
        'checked': itemObj.checked
      });
      }
  });

  console.log(JSON.stringify(this.materialListArray));
  console.log(JSON.stringify(this.materialListArray.length));
  if(this.materialListArray.length == 0){
    this.disabledForCancel = false;
    this.disabledForEdit = false;

    this.editBtnColor = 'dark';
    this.deleteBtnColor = 'dark';

    return false;
  }else if(this.materialListArray.length == 1){

    this.disabledForCancel = true;
    this.disabledForEdit = true;

    this.editBtnColor = 'secondary';
    this.deleteBtnColor = 'primary';

    return false;
  }else if(this.materialListArray.length > 1){

    this.disabledForCancel = true;
    this.disabledForEdit = false;

    this.editBtnColor = 'dark';
    this.deleteBtnColor = 'secondary';

    return false;
  }

   
  }

  goToMaterialPage(){
    console.log(JSON.stringify(this.materialListArray));
    this.navCtrl.push(AddMaterialPage, {'pageName':'edit',
                                         materialListArray:this.materialListArray
                                        });
  }

}
