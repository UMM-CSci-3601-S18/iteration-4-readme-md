import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {environment} from "../environments/environment";
import {AuthResponse} from "./AuthResponse";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) {
    }

    // Sends a request to google's endpoint with the authentication token.
    // Returns a promise for a json response
    authenticate(authToken: string): Promise<string> {

        //return a promise instead of using a callback
        return new Promise((resolve, reject) => {
            this.http.post<string>(environment.API_URL + 'login', {code: authToken}).subscribe(
                userId => {
                    resolve(userId);
                },
                err => {
                    console.log(err);
                    reject(err);
                }
            );
        });
    }

}
