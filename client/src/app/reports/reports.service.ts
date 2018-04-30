import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Emoji} from '../emoji';
import {environment} from '../../environments/environment';

@Injectable()
export class ReportsService {
    readonly baseUrl: string = environment.API_URL + 'emojis';

    constructor(private http: HttpClient) {
    }




    getEmojis(userEmail: string, ): Observable<Emoji[]> {
        // if (startDate == null && endDate == null){
            return this.http.get<Emoji[]>(this.baseUrl + '?email=' + userEmail);
        // } else{
        //     return this.http.get<Emoji[]>(this.baseUrl + '?email=' + userEmail + '&date=' + startDate + ',' + endDate);
        // }
    }
}
