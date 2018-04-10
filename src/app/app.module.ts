import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';


import { SelectSearchableModule } from 'ionic-select-searchable';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TermModalPage } from '../pages/term-modal/term-modal';
import { LoginPage } from '../pages/login/login';
import { PriceListPage } from '../pages/price-list/price-list';
import { ProfilePage } from '../pages/profile/profile';
import { VendorRegistrationPage } from '../pages/vendor-registration/vendor-registration';
import { AddUpdateQuotePage } from '../pages/add-update-quote/add-update-quote';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { UpdateUserInfoPage } from '../pages/update-user-info/update-user-info';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ApiService } from '../api-services/api.services';
import { HelperService } from '../api-services/helperServices';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,        
    VendorRegistrationPage,
    PriceListPage,
    ProfilePage,
    AddUpdateQuotePage,
    EditProfilePage,
    UpdateUserInfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SelectSearchableModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,    
    LoginPage,
    VendorRegistrationPage,
    PriceListPage,
    ProfilePage,
    AddUpdateQuotePage,
    EditProfilePage,
    UpdateUserInfoPage
  ],
  providers: [
    ImagePicker,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiService,
    HelperService
  ]
})
export class AppModule {}

