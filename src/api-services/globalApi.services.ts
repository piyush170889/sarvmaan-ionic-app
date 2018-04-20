import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import './AppSettings';
import { AppSettings } from './AppSettings';
import { HelperService } from './helperServices'

@Injectable()

export class ApiServiceProvider {
    constructor(private http: Http, private headers: HelperService) {

    }


    getDataRequest(url, isAuth?) {
        if (isAuth) {
            return this.http.get(AppSettings.API_ENDPOINT + url)
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                        this.refreshToken();
                      }
                    return Observable.throw(details);
                });
        } else {
            return this.http.get(AppSettings.API_ENDPOINT + url, this.headers.createHeaderOptions())
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                        this.refreshToken();
                      }
                    return Observable.throw(details);
                });
        }
    }

    updateDataRequest(url, argument) {
        return this.http.put(AppSettings.API_ENDPOINT + url, argument, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                    this.refreshToken();
                  }
                return Observable.throw(details);
            });
    }

    saveDataRequest(url, argument, isAuth?) {
        if (isAuth) {
            let header = this.headers.createLoginHeaderOptions();
            return this.http.post(AppSettings.API_ENDPOINT + url, argument, header)
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    return Observable.throw(details);
                });
        } else {
            return this.http.post(AppSettings.API_ENDPOINT + url, argument, this.headers.createHeaderOptions())
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                        this.refreshToken();
                      }
                    return Observable.throw(details);
                });
        }
    }

    deleteDataRequest(url) {
        return this.http.delete(AppSettings.API_ENDPOINT + url, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                if(details.hasOwnProperty('error') && details['error'] == 'invalid_grant'){
                    this.refreshToken();
                  }
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

}