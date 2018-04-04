import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { ApiService } from '../api-services/api.services';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PriceListPage } from '../pages/price-list/price-list';
import { ProfilePage } from '../pages/profile/profile';
import { VendorRegistrationPage } from '../pages/vendor-registration/vendor-registration';


import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;// = LoginPage;
  loading: Loading;
  loadingConfig: any;
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
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'PriceList', component: PriceListPage },
      { title: 'List', component: ListPage },
      { title: 'Login', component: LoginPage },
      { title: 'SignUp', component: VendorRegistrationPage },
      { title: 'Profile', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.refreshToken();

    });
  }

  checkAuthorization() {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.getUserProfile()
        .subscribe(response => {
          this.loading.dismiss();
          //this.profileData = response;
          this.profileData.name = response.appUsers.firstName + '' + response.appUsers.lastName;
          this.profileData.profession = response.appUsers.businessDetails.skillSet[0].displayText;
          this.profileData.imageUrl = response.appUsers.businessDetails.logo == null ? 'assets/imgs/user.png' : response.appUsers.businessDetails.logo ;
          //this.profileData = response;
          this.rootPage = HomePage;
        }, (error) => {
          this.loading.dismiss();
          if (error.error == "invalid_token") {
            this.refreshToken();
            //this.rootPage = LoginPage;
            localStorage.clear();
          } else {
            this.rootPage = LoginPage;
            //this.rootPage = VendorRegistrationPage
            localStorage.clear();
          }
        });
    });
  }


  refreshToken() {
    this.createLoader();
    this.loading.present().then(() => {
      this.apiServices.refreshToken()
        .subscribe(response => {
          this.loading.dismiss();
          //this.rootPage = HomePage;
          this.checkAuthorization();
        }, (error) => {
          this.loading.dismiss();
          if (error.error == "invalid_grant") {
            this.rootPage = LoginPage;
            localStorage.clear();
          }
        });
    });
  }

  createLoader(message: string = "Checking authentication..") { // Optional Parameter
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



    //this.nav.setRoot(page.component);
    if (localStorage.getItem('isLogin') == 'true')// page == 'Login')
    {
      //this.nav.setRoot(page.component);
      this.nav.push(getSelectedIndex.component);
    } else if (page == 'Logout') {
      localStorage.clear();
    }

    // Otherwise reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    else {
      localStorage.clear();
      this.nav.setRoot(this.pages[3].component);
    }
  }
}
