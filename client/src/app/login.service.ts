import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {environment} from "../environments/environment";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) {
    }

    authenticate(authToken: string): Observable<any> {
        return this.http.get<any>('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + authToken);
    }

}
