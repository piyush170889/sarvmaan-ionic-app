import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
//import { Headers } from '@angular/http/src/headers';
//import { RequestOptions } from '@angular/http/src/base_request_options';

@Injectable()

export class HelperService {
    loadingConfig:any;
    constructor(private http: Http) {

    }
    createHeaderOptions(){
        let token = localStorage.getItem('token');
        let headers = new Headers({            
            'Authorization': 'Bearer  '+ token
        })
        let options = new RequestOptions({
            headers: headers
        })
        return options;
    }

    createLoginHeaderOptions(){
        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + "c2Fydm1hYW46c2Fydm1hYW4tc2VjcmV0"); 
       
        // let headers = new Headers({            
        //     'Authorization': 'Basic d2VzYXZlOndlc2F2ZS1zZWNyZXQ='
        // })
        let options = new RequestOptions({
            headers: headers
        })
        return options;
    }

    // showLoader(){
    //     this.loadingConfig = this.loadingCtrl.create({
    //         content: 'Loading....',
    //         duration: 3000,
    //         spinner: 'crescent',
    //         dismissOnPageChange: true
    //       });
    // }

}