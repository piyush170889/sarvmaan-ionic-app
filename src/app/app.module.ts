import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';


import { SelectSearchableModule } from 'ionic-select-searchable';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PriceListPage } from '../pages/price-list-module/price-list/price-list';
import { ProductRequestPage } from '../pages/product-request-module/product-request/product-request';
import { AddProductPricePage } from '../pages/price-list-module/add-product-price/add-product-price';
import { SelectProductListPage } from '../pages/price-list-module/select-product-list/select-product-list';
import { ProfilePage } from '../pages/profile-module/profile/profile';
import { VendorRegistrationPage } from '../pages/vendor-registration/vendor-registration';
import { AddUpdateQuotePage } from '../pages/add-update-quote/add-update-quote';
import { EditProfilePage } from '../pages/profile-module/edit-profile/edit-profile';
import { UpdateUserInfoPage } from '../pages/profile-module/update-user-info/update-user-info';
import { SettingsPage } from '../pages/settings/settings';
import { QuotationDetailsPage } from '../pages/quotation-details/quotation-details';
import { EditMaterialListPage } from '../pages/edit-material-list/edit-material-list';
import { AddMaterialPage } from '../pages/add-material/add-material';
import { AddMaterialListPage } from '../pages/add-material-list/add-material-list';
import { ProductListPage } from '../pages/product-list-page/product-list-page';
import { EditQuotePage } from '../pages/edit-quotation-page/edit-quotation-page';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiService } from '../api-services/api.services';
import { ApiServiceProvider } from '../api-services/globalApi.services';
import { HelperService } from '../api-services/helperServices';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    VendorRegistrationPage,
    PriceListPage,
    ProductRequestPage,
    AddProductPricePage,
    SelectProductListPage,
    ProfilePage,
    AddUpdateQuotePage,
    EditProfilePage,
    UpdateUserInfoPage,
    SettingsPage,
    QuotationDetailsPage,
    EditMaterialListPage,
    AddMaterialPage,
    AddMaterialListPage,
    ProductListPage,
    EditQuotePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SelectSearchableModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ["places"]
    }),
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
    LoginPage,
    VendorRegistrationPage,
    PriceListPage,
    ProductRequestPage,
    AddProductPricePage,
    SelectProductListPage,
    ProfilePage,
    AddUpdateQuotePage,
    EditProfilePage,
    UpdateUserInfoPage,
    SettingsPage,
    QuotationDetailsPage,
    EditMaterialListPage,
    AddMaterialPage,
    AddMaterialListPage,
    ProductListPage,
    EditQuotePage
  ],
  providers: [
    ImagePicker,
    Base64,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiService,
    HelperService,
    SQLite,
    ApiServiceProvider
  ]
})
export class AppModule { }

