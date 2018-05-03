import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Journal} from './journal';
import {environment} from '../../environments/environment';


@Injectable()
export class JournalListService {
    readonly baseUrl: string = environment.API_URL + 'journaling';

    constructor(private http: HttpClient) {
    }

    getJournals(userId: string): Observable<Journal[]> {
        return this.http.get<Journal[]>(this.baseUrl + '?userId=' + userId);
    }

    getJournalById(id: string): Observable<Journal> {
        return this.http.get<Journal>(this.baseUrl + '/' + id);
    }

    addNewJournal(newJournal : Journal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.baseUrl + '/new', newJournal, httpOptions);
    }

    editJournal(editedJournal: Journal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        console.log(editedJournal);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.baseUrl + '/edit', editedJournal, httpOptions);
    }

    deleteJournal(id: string): Observable<{'$oid': string}>{
        console.log ("here!");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.baseUrl + '/delete/' + id);
        console.log(this.http.delete(this.baseUrl + '/delete/' + id, httpOptions));

        return this.http.delete<{'$oid': string}>(this.baseUrl + '/delete/' + id, httpOptions);
    }
}
