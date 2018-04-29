import { Component, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController, Events, AlertController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectSearchable } from 'ionic-select-searchable';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

import { ApiService } from '../../api-services/api.services';

import { AddMaterialPage } from '../add-material/add-material';
import { AddMaterialListPage } from '../add-material-list/add-material-list';
import { HomePage } from '../home/home';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

class State {
  public id: number;
  public displayText: string;
}
class City {
  public id: number;
  public displayText: string;
}

@Component({
  selector: 'page-add-update-quote',
  templateUrl: 'add-update-quote.html',
})
export class AddUpdateQuotePage {
  
  public addQuoteForm: FormGroup;
  states: State[];
  state: State;
  cities: City[];
  city: City;
  loading: Loading;
  loadingConfig: any;
  cityName: any;
  stateName: any;
  addtQuotationDetailData:any = [];
  materialList:any = [];
  saveMaterialToQuotationData:any = [];
  totalAmount: any;
  discount: any;
  grandTotal: any;
  quoteType: any;
  quoteStatus: any;
  paymentSchedule: any = [];

  materialListNEW:any = [];
  selectedValue: any = [];
 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public apiServices: ApiService,
    public events: Events,
    public alertCtrl: AlertController,
    private sqlite: SQLite
  ) {
    this.addQuoteForm = this._FORMBUILDER.group({
      'quoteNumber': ['', [Validators.required]],
      'workTitle': ['', [Validators.required]],
      'clientName': ['', [Validators.required]],
      'contactNo': ['', [Validators.required]],
      'streetAddress': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'tnc': ['', [Validators.required]],
      'productSts': ['','']    
    });

    this.sqlite.create({
      name: 'materialDb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS materialList(rowid INTEGER PRIMARY KEY, materialId TEXT, productName TEXT, notes TEXT, quantity INT, perUnitRate INT, totalAmt INT, productId INT, checked TEXT)', {})
    .then(res => console.log('Executed SQL'))
    .catch(e => console.log(e));

    })
    
    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getStatesAndCities().subscribe((response) => {
        this.loading.dismiss();
        this.states = response.locationDtlsTo.stateDtls;	
        this.cities = response.locationDtlsTo.cityDtls;
      }, (err) => {
        this.loading.dismiss();
      })
    })

    events.subscribe('event-saveMaterialToQuotationData', (data) => {
      this.saveMaterialToQuotationData =  data;
      console.log(this.saveMaterialToQuotationData)
      if(this.saveMaterialToQuotationData == undefined){
          this.saveMaterialToQuotationData = [];
      }

      this.totalAmount = 0;
      this.discount = 0;
      this.grandTotal = 0;
      this.addQuoteForm.controls['productSts'].setValue('false') 
      this.saveMaterialToQuotationData.forEach((v,k)=>{
         this.totalAmount =  parseInt(this.totalAmount) + parseInt(v.totalAmt);
         this.discount =   parseInt(this.discount) + parseInt(v.discount);
         this.materialList.push({
          'materialId': v.materialId,
          'productName' : v.productName,
          'notes' : v.notes,
          'quantity' : v.quantity,
          'perUnitRate' : v.perUnitRate,
          'totalAmt' : v.totalAmt,
          'productId': v.productId,
          'checked': v.checked
        }); 

      });
      
    });
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUpdateQuotePage');
  }

  stateChange(event: { component: SelectSearchable, value: any }) {
    this.stateName = event.value.stateName;
  }
  cityChange(event: { component: SelectSearchable, value: any }) {
    this.cityName = event.value.cityName;
  }
    
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  addMaterialToQuotationPage(){
    this.navCtrl.push(AddMaterialPage);
  }

  submitQuotation(){
    
    this.quoteStatus = '';

     if(
       this.addQuoteForm.controls['workTitle'].value == '' || this.addQuoteForm.controls['workTitle'].value == undefined ||
       this.addQuoteForm.controls['clientName'].value == '' || this.addQuoteForm.controls['clientName'].value == undefined ||
       this.addQuoteForm.controls['contactNo'].value == '' || this.addQuoteForm.controls['contactNo'].value == undefined ||
       this.addQuoteForm.controls['tnc'].value == '' || this.addQuoteForm.controls['tnc'].value == undefined 
     ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }else{
      let confirm = this.alertCtrl.create({
        title: '',
        message: 'Select Quotation Type',
        buttons: [
          {
            text: 'Sarvmaan',
            handler: () => {
                this.quoteType = 'SARVMAAN';
                this.sendQuotation(this.quoteType, this.quoteStatus);
            }
          },
          {
            text: 'Customer',
            handler: () => {
              this.quoteType = 'SELF';
              this.sendQuotation(this.quoteType, this.quoteStatus);
            }
          }
        ]
      });
      confirm.present();
    }

   }

  sendQuotation(quoteType, quoteStatus){
    console.log(this.materialList)
    let data = {
      "quoteNumber": this.addQuoteForm.controls['quoteNumber'].value,
      "workTitle": this.addQuoteForm.controls['workTitle'].value,
      "clientName": this.addQuoteForm.controls['clientName'].value,
      "contactNumber": this.addQuoteForm.controls['contactNo'].value, 
      "address": [
        {
          "cityName": this.cityName,
          "stateName": this.stateName,
          "countryName": "India",
          "street": this.addQuoteForm.controls['streetAddress'].value
        }
      ],
      "termsAndCondition":this.addQuoteForm.controls['tnc'].value,
      "emailId":"piyushtestupdated@gmail.com",
      "quoteStatus": quoteStatus,    //quote Status will be DRAFT quote is saved as DRAFT. If                    // it is submitted than leave this field empty
      "quoteType": quoteType, //SELF/SARVMAAN
      "grandTotal": this.totalAmount - this.discount,
      "totalAmount": this.totalAmount,
      "discount": this.discount,

      "materialList":  this.materialList,
      "paymentSchedule": this.paymentSchedule
    }

    console.log(data)
    this.createLoader();
     this.loading.present().then(() => {
     this.apiServices.addtQuotationDetail(data)
          .subscribe(response => {
            this.loading.dismiss();
            this.addtQuotationDetailData = response.quotationDtls;
            this.navCtrl.setRoot(HomePage);
          }, error => {
            this.loading.dismiss();
            //this.errorMessage = <any>error
          });
    });
  }

  saveQuotationAsDraft(){
    
    this.quoteStatus = 'DRAFT';

    if(this.addQuoteForm.controls['workTitle'].value == '' || this.addQuoteForm.controls['workTitle'].value == undefined ||
    this.addQuoteForm.controls['clientName'].value == '' || this.addQuoteForm.controls['clientName'].value == undefined ||
    this.addQuoteForm.controls['contactNo'].value == '' || this.addQuoteForm.controls['contactNo'].value == undefined ||
    this.addQuoteForm.controls['tnc'].value == '' || this.addQuoteForm.controls['tnc'].value == undefined 
    ){
      let toast = this.toastCtrl.create({
        message: 'Please fill all fields !',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }else{
      let confirm = this.alertCtrl.create({
        title: '',
        message: 'Select Quotation Type',
        buttons: [
          {
            text: 'Sarvmaan',
            handler: () => {
                this.quoteType = 'SARVMAAN';
                this.sendQuotation(this.quoteType, this.quoteStatus);
            }
          },
          {
            text: 'Customer',
            handler: () => {
              this.quoteType = 'SELF';
              this.sendQuotation(this.quoteType, this.quoteStatus);
            }
          }
        ]
      });
      confirm.present();
    }
  }

  cancelPage(){
     this.navCtrl.setRoot(HomePage);
  }

  checkboxChange(data){
   console.log(data);
   console.log(this.materialList);

   if(this.addQuoteForm.controls['productSts'].value == true){
        this.selectedValue.push({
            'materialId': data.materialId,
            'productName': data.productName,
            'notes': data.notes,
            'quantity': data.quantity,
            'perUnitRate': data.perUnitRate,
            'totalAmt': data.totalAmt,
            'productId': data.productId,
            'checked': 'true',
        });
   }
   
   console.log(
           '==materialId=='+data.materialId
         + '==productName=='+data.productName
         + '==notes=='+data.notes
         + '==quantity==' +data.quantity
         + '==perUnitRate==' +data.perUnitRate
         + '==totalAmt==' +data.totalAmt
         + '==productId=='+data.productId
         + '==checked=='+data.checked
    )

    if(this.addQuoteForm.controls['productSts'].value == true){

      this.sqlite.create({
        name: 'materialDb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
  
       // this.materialList.forEach((v,k) => {
  
      db.executeSql('INSERT INTO materialList VALUES(NULL,?,?,?,?,?,?,?,?)',[data.materialId,data.productName,data.notes,data.quantity,data.perUnitRate,data.totalAmt,data.productId,'true'])
      .then(res => {
        //alert("insert=="+JSON.stringify(res));
        //alert('saved');
      });
  
       // });
       
       db.executeSql('SELECT * FROM materialList ORDER BY rowid DESC', {})
        .then(res => {
          //alert("select=="+JSON.stringify(res));
          this.materialListNEW = [];
          for(var i=0; i<res.rows.length; i++) {
              this.materialListNEW.push({
                    rowid:res.rows.item(i).rowid,
                    materialId:res.rows.item(i).materialId,
                    productName:res.rows.item(i).productName,
                    notes:res.rows.item(i).notes,
                    quantity:res.rows.item(i).quantity,
                    perUnitRate:res.rows.item(i).perUnitRate,
                    totalAmt:res.rows.item(i).totalAmt,
                    productId:res.rows.item(i).productId,
                    checked:res.rows.item(i).checked
              })
          }

        })

  
      });

    }


    
   // this.materialListNEW = this.materialList;
   // console.log(this.materialListNEW);
    
    //this.materialListNEW = [];
   /* if(this.addQuoteForm.controls['productSts'].value == true){
      this.materialList.forEach((v,k) => {
        if(materialId == v.materialId){
         
          this.materialListNEW.push({
            'materialId': v.materialId,
            'productName' : v.productName,
            'notes' : v.notes,
            'quantity' : v.quantity,
            'perUnitRate' : v.perUnitRate,
            'totalAmt' : v.totalAmt,
            'productId': v.productId,
            'checked': 'true'
          });

        }
      });
    }else{
      this.materialListNEW.splice(this.materialListNEW.indexOf(materialId));
        
     
    }*/

   
         

       
   

   /* this.materialList.forEach((v,k) => {
      
      if(this.addQuoteForm.controls['productSts'].value == true){
            console.log('true');
            if(materialId == v.materialId){
              this.materialListNEW.push({
                'materialId': materialId,
              });
            }
             
        }
       
    });*/
    
  }

  removeMaterialToQuotationPage(){
   
      
     // alert("materialList=="+JSON.stringify(this.materialList));
      //alert("materialListNEW=="+JSON.stringify(this.materialListNEW))
     // this.materialList = [];
      
      this.materialList.forEach(element => {
        this.materialListNEW.forEach(element1 => {
              if(
                 element.materialId != element1.materialId
                ){
                  this.materialList = [];
                  this.materialList.push(element);
              }
             /* else{

                this.sqlite.create({
                  name: 'materialDb.db',
                  location: 'default'
                }).then((db: SQLiteObject) => {
            
                let query = "DELETE FROM materialList WHERE id = ?";
            
                db.executeSql(query,[element1.materialId])
                .then(res => {
                  alert("deleted=="+JSON.stringify(res));
                  
                });
              })

              }*/

        });
      });
      
      //alert("materialList222=="+JSON.stringify(this.materialList));
     
    
    
      
  }

  EditMaterialToQuotationPage(){
    console.log(this.addQuoteForm.controls['productSts'].value) 
    console.log(this.materialListNEW);

    console.log("selectedValue=="+JSON.stringify(this.selectedValue));

      this.selectedValue.forEach((v,k) => {
  
        this.navCtrl.push(AddMaterialPage, {
              'pageName':'editMaterialLocally',
               materialListArray:this.selectedValue
        });

       

     });
    
  }

    
}
