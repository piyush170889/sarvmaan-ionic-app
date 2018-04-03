import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  //public user : Observable;

  constructor(public http : Http) {
    console.log('Hello AuthProvider Provider');
  }

  doLogin(data) {
    
            return this.http.post('url', data)
                .map((response) => {
                    response.json()
                })            
        }

}
