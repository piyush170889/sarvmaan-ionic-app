import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import './AppSettings';
import { AppSettings } from './AppSettings';
import { HelperService } from './helperServices'

@Injectable()

export class ApiService {
    constructor(private http: Http, private headers: HelperService) {

    }
    vendorRegistration(argument) {
        return this.http.post(AppSettings.API_ENDPOINT + 'register/vendor-reg', argument)
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    login(argument) {        
        let url = AppSettings.API_ENDPOINT + 'oauth/token?username=' + argument.username + '&password=' + argument.password + '&grant_type=password';       
        let header = this.headers.createLoginHeaderOptions();
        return this.http.post(url, '', header)
            .map((response) => {
                let res = response.json();
                //if(res.hasOwnProperty('access_token') && res.hasOwnProperty('refresh_token')){
                    localStorage.setItem('token', res.access_token);
                    localStorage.setItem('refreshToken', res.refresh_token);
                    localStorage.setItem('isLogin', 'true');
                    return true;                    
                  //}else{
                    //alert('Login error.');
                    //return false;                      
                  //}
            })
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    refreshToken(){
        let url = AppSettings.API_ENDPOINT + 'oauth/token?grant_type=refresh_token&refresh_token=' + localStorage.getItem('refreshToken');        
         let header = this.headers.createLoginHeaderOptions();
         return this.http.post(url, '', header)
             .map((response) => {
                 let res = response.json();
                 if(res.hasOwnProperty('access_token')){
                    localStorage.setItem('token', res.access_token);
                    localStorage.setItem('refreshToken', res.refresh_token);
                    localStorage.setItem('isLogin', 'true');
                    return true;                    
                  }else{
                    alert('Login error.');
                    return false;                      
                  }                 
                })
             .catch((err: Response) => {
                 let details = err.json();
                 return Observable.throw(details);
             });
    }

    getSarvamList() {
        return this.http.get(AppSettings.API_ENDPOINT + 'quotation?page=0&quote-type=ALL', this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                    this.refreshToken();
                  }else{
                    alert('server error occoured.')
                }
                return Observable.throw(details);
            });
    }

    getUserProfile() {
        return this.http.get(AppSettings.API_ENDPOINT + 'profile', this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details:any = err.json();
                if(details.hasOwnProperty('error') && details.error == 'invalid_token'){
                    this.refreshToken();
                  }else{
                    alert('server error occoured.')
                }
                return Observable.throw(details);
            });
    }

    updateProfile(argument) {
        return this.http.put(AppSettings.API_ENDPOINT + 'profile', argument, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    updateLogo(argument) {
        let data = {
            "logo": argument
        }

        return this.http.post(AppSettings.API_ENDPOINT + 'profile-logo', data, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    updateContact(argument) {
        let data =
            {
                "cellNumber": argument.cellNumber,
                "deviceInfo": "rahuldevice",
                "otp": argument.otp
            }
        return this.http.put(AppSettings.API_ENDPOINT + 'contact-number', data, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    sendEmail(argument) {
        let data =
        {
            "emailId": argument
        }        
        return this.http.post(AppSettings.API_ENDPOINT + 'send-email', data, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    updateEmail(argument) {
        let url = 'v1/update-emailid?emailId=' + argument.emailId;            
        return this.http.post(AppSettings.API_ENDPOINT + url, '')
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    changePassword(argument) {        
        let data = {
            "oldPassword":argument.oldPassword,
            "newPassword":argument.newPassword
        }
        
        return this.http.put(AppSettings.API_ENDPOINT + 'v1/change-password', data, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    forgotPassword(argument) {        
        let data = {
            "otp":argument.otp,
            "deviceInfo":"abcd",
            "newPassword": argument.newPassword        
        }
        
        return this.http.post(AppSettings.API_ENDPOINT + 'ext/forget-password', data)
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    getQuotationList(argument){
        return this.http.get(AppSettings.API_ENDPOINT + 'quotation', this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    getQuotationDetail(argument){
        return this.http.get(AppSettings.API_ENDPOINT + 'quotation/'+ argument, this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    addQuotation(argument){
        return this.http.post(AppSettings.API_ENDPOINT + 'quotation/', argument, this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    editQuotation(argument){
        return this.http.put(AppSettings.API_ENDPOINT + 'quotation', argument, this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    addMaterialInQuotation(argument){
        return this.http.post(AppSettings.API_ENDPOINT + 'quotation/'+argument.id, argument.data, this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    editMaterialInQuotation(argument){
        return this.http.put(AppSettings.API_ENDPOINT + 'quotation/'+argument.id, argument.data, this.headers.createHeaderOptions())
        .map(response => response.json())
        .catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details);
        });
    }

    getMasterDataList(argument) {
        return this.http.post(AppSettings.API_ENDPOINT + '/ext/master-data', {
            "masterDataList": [{
                "group": "language"
            },
            {
                "group": "skillset"
            }
        ]
        })
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    getMasterDataLocationList(argument) {
        return this.http.get(AppSettings.API_ENDPOINT + '/ext/master-data-all')
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    verifyContactAndSendOtp(argument) {
        return this.http.post(AppSettings.API_ENDPOINT + 'register/verify-contact-and-send-otp', argument)
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    verifyOtp(argument) {
        return this.http.post(AppSettings.API_ENDPOINT + 'ext/verify-otp', argument)
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }
} 