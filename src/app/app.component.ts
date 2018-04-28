import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { ApiService } from '../api-services/api.services';

import { ApiServiceProvider } from '../api-services/globalApi.services';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PriceListPage } from '../pages/price-list-module/price-list/price-list';
import { ProductRequestPage } from '../pages/product-request-module/product-request/product-request';
import { ProfilePage } from '../pages/profile-module/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
//import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  loading: Loading;
  loadingConfig: any;
  sessionErrorToast:any;
  profileData: any = {
    name: '',
    profession: '',
    imageUrl: 'assets/imgs/user.png'
  }

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public apiServices: ApiService,
    public apiService: ApiServiceProvider,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    public toastCtrl: ToastController,
    public events: Events
  ) {

    events.subscribe('user:login', () => {
      this.getSideMenuData();
    });
    
    events.subscribe('user:tokenRefreshed', () => {
      this.checkAuthorization();
    });

    

    events.subscribe('user:loginFail', () => { 
      this.sessionErrorToast = this.toastCtrl.create({
        message: 'Unable to authenticate user. Please login.',
        duration: 3000,
        position: 'top'
      });
      setTimeout(()=>{
        localStorage.clear();
        this.rootPage = LoginPage;
      }, 1000) 
      this.sessionErrorToast.present();          
    });

    


    translate.addLangs(["en", "marathi"]);
    translate.setDefaultLang('en');
    translate.use('en');

    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'PriceList', component: PriceListPage },
      { title: 'ProductRequest', component: ProductRequestPage },
      { title: 'Login', component: LoginPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Settings', component: SettingsPage }
    ];
  }

  ionViewDidLoad() {
    this.sessionErrorToast = this.toastCtrl.create({
      message: 'Unable to authenticate user. Please login to proceed.',
      duration: 700,
      position: 'top'
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();      
      this.checkAuthorization();
    });
  }

  checkAuthorization() {    
    this.createLoader();
    this.loading.present().then(() => {
      this.apiService.getDataRequest('profile', false)
        .subscribe(response => {
          this.loading.dismiss();
          localStorage.setItem('quoteNotification', response.appUsers.isNotifyQuotation);
          this.profileData.name = response.appUsers.firstName + ' ' + response.appUsers.lastName;
          if (response.appUsers.businessDetails != null) {
            if (response.appUsers.businessDetails.logo == null) {
              this.profileData.imageUrl = 'assets/imgs/user.png';
            } else {
              this.profileData.imageUrl = response.appUsers.businessDetails.logo;
            }
            this.profileData.profession = response.appUsers.businessDetails.businessName;
          } else {
            this.profileData.profession = '';
            this.profileData.imageUrl = 'assets/imgs/user.png';
          }
          this.rootPage = HomePage;
        }, (error) => {
          this.loading.dismiss();
          //alert('Server error occured.');         
        });
    })
  }


  getSideMenuData(){
    this.apiService.getDataRequest('profile', false)
    .subscribe(response => {
      localStorage.setItem('quoteNotification', response.appUsers.isNotifyQuotation);
      this.profileData.name = response.appUsers.firstName + ' ' + response.appUsers.lastName;
      if (response.appUsers.businessDetails != null) {
        if (response.appUsers.businessDetails.logo == null) {
          this.profileData.imageUrl = 'assets/imgs/user.png';
        } else {
          this.profileData.imageUrl = response.appUsers.businessDetails.logo;
        }
        this.profileData.profession = response.appUsers.businessDetails.businessName;
      } else {
        this.profileData.profession = '';
        this.profileData.imageUrl = 'assets/imgs/user.png';
      }
    })
  }

  createLoader(message: string = "Checking authentication..") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  openPage(page) {

    let getSelectedIndex: any;

    this.pages.forEach((item, index) => {
      if (item.title == page) {
        getSelectedIndex = item;
      }
    })

    if (page == 'Logout') {
      localStorage.clear();
      this.nav.setRoot(LoginPage);
    }
    else {
      this.nav.push(getSelectedIndex.component);
    }
  }
}
