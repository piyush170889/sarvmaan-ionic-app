import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

declare const alertify: any;

@Component({
  selector: 'page-select-product-list',
  templateUrl: 'select-product-list.html',
})
export class SelectProductListPage {

  showLevel1 = null;
  showLevel2 = null;
  pages: any = [
    {
      "category":"PC",
      "subs": [
        {
          "subcategory":"Processor",
          "manufactures": [
            {
              "manufacture":"Intel"
            },
            {
              "manufacture":"AMD"
            }
          ]
        },
        {
          "subcategory":"Motherboard",
          "manufactures": [
            {
              "manufacture":"Asus"
            },
            {
              "manufacture":"AMD"
            },
            {
              "manufacture":"GigaByte"
            },
            {
              "manufacture":"Intel"
            }
          ]
        },
        {
          "subcategory":"Memory",
          "manufactures": [
            {
              "manufacture":"Visipro"
            },
            {
              "manufacture":"Crucial"
            },
            {
              "manufacture":"VenomRX"
            }
          ]
        }
      ]
    },
    {
      "category":"Laptop",
      "subs": [
        {
          "subcategory":"Notebook",
          "manufactures": [
            {
              "manufacture":"Lenovo"
            },
            {
              "manufacture":"Dell"
            }
          ]
        },
        {
          "subcategory":"Netbook",
          "manufactures": [
            {
              "manufacture":"Lenovo"
            },
            {
              "manufacture":"Dell"
            },
            {
              "manufacture":"Acer"
            },
            {
              "manufacture":"HP"
            }
          ]
        }
      ]
    },
    {
      "category":"Printer",
      "subs": [
        {
          "subcategory":"Laserjet",
          "manufactures": [
            {
              "manufacture":"HP"
            },
            {
              "manufacture":"Brother"
            },
            {
              "manufacture":"Canon"
            },
            {
              "manufacture":"Samsung"
            }
          ]
        },
        {
          "subcategory":"Deskjet",
          "manufactures": [
            {
              "manufacture":"HP"
            },
            {
              "manufacture":"Canon"
            },
            {
              "manufacture":"Epson"
            }
          ]
        }
      ]
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad PriceListPage');
    this.getProductNameList();    
  }

  getProductNameList(){
  //   this.priceList = [];
  //   this.createLoader();
  //   this.loading.present().then(() => {
  //   this.apiService.getDataRequest('vendors', false)
  //        .subscribe(response => {
  //          this.priceList = response.vendorPriceList;           
  //          this.loading.dismiss();
  //        }, error => {
  //         this.loading.dismiss();
  //         alert('Server error occured.') 
  //        });
  //  });
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

}
