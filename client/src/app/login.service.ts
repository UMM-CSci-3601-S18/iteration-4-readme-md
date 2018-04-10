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
    // Returns true if authenticated, false if not
    authenticate(authToken: string): Promise<AuthResponse> {

        //return a promise instead of a callback
        return new Promise((resolve, reject) => {
            this.http.get<any>('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + authToken).subscribe(
                authResponse => {
                    resolve(authResponse);
                },
                err => {
                    console.log(err);
                    reject(err);
                }
            );
        });
    }

}
