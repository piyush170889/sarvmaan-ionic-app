import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import './AppSettings';
import { AppSettings } from './AppSettings';
import { HelperService } from './helperServices';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Events } from 'ionic-angular';

@Injectable()

export class ApiServiceProvider {
    constructor(private http: Http, private headers: HelperService, public events: Events) {


    }


    getDataRequest(url, isAuth?) {
        if (isAuth) {
            return this.http.get(AppSettings.API_ENDPOINT + url)
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                        this.refreshToken();
                    } else {
                        return Observable.throw(details);
                    }
                });
        } else {
            return this.http.get(AppSettings.API_ENDPOINT + url, this.headers.createHeaderOptions())
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                        this.refreshToken();
                    } else {
                        return Observable.throw(details);
                    }
                });
        }
    }

    updateDataRequest(url, argument) {
        return this.http.put(AppSettings.API_ENDPOINT + url, argument, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                    this.refreshToken();
                } else {
                    return Observable.throw(details);
                }
            });
    }

    saveDataRequest(url, argument, isAuth?) {
        if (isAuth) {
            return this.http.post(AppSettings.API_ENDPOINT + url, argument)
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                        this.refreshToken();
                    } else {
                        return Observable.throw(details);
                    }
                });
        } else {
            return this.http.post(AppSettings.API_ENDPOINT + url, argument, this.headers.createHeaderOptions())
                .map(response => response.json())
                .catch((err: Response) => {
                    let details = err.json();
                    if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                        this.refreshToken();
                    } else {
                        return Observable.throw(details);
                    }
                });
        }
    }

    deleteDataRequest(url) {
        return this.http.delete(AppSettings.API_ENDPOINT + url, this.headers.createHeaderOptions())
            .map(response => response.json())
            .catch((err: Response) => {
                let details = err.json();
                if (details.hasOwnProperty('error') && details['error'] == 'invalid_token') {
                    this.refreshToken();
                } else {
                    return Observable.throw(details);
                }
            });
    }


    doLoginRequest(url) {
        let header = this.headers.createLoginHeaderOptions();
        return this.http.post(AppSettings.API_ENDPOINT + url, '', header)
            .map((response) => {
                let data = response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                localStorage.setItem('isLogin', 'true');
                return true;
            })
            .catch((err: Response) => {
                let details = err.json();
                return Observable.throw(details);
            });
    }

    refreshToken() {
        let url = AppSettings.API_ENDPOINT + 'oauth/token?grant_type=refresh_token&refresh_token=' + localStorage.getItem('refreshToken');
        let header = this.headers.createLoginHeaderOptions();
        this.http.post(url, '', header).subscribe((response) => {
            let res = response.json();
            if (res.hasOwnProperty('access_token')) {
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('refreshToken', res.refresh_token);
                localStorage.setItem('isLogin', 'true');                
                this.events.publish('user:tokenRefreshed');
            } else {                
                this.events.publish('user:loginFail');
            }

        }, (err) => {
            let details = err.json();
            if (details.hasOwnProperty('error') && details['error'] == 'invalid_grant') {
                this.events.publish('user:loginFail');
            }
        })
    }

}