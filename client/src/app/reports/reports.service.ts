import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Emoji} from '../emoji';
import {environment} from '../../environments/environment';

@Injectable()
export class ReportsService {
    readonly baseUrl: string = environment.API_URL + 'emojis';
    private emojiUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }


    getEmojis(userEmail: string): Observable<Emoji[]> {
        this.filterByEmail(userEmail);
        return this.http.get<Emoji[]>(this.emojiUrl);
    }

    filterByEmail(userEmail?: string): void {
        if(!(userEmail == null || userEmail === '')) {
            if (this.parameterPresent('email=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('email=');
            }
            if (this.emojiUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.emojiUrl += 'email=' + userEmail + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.emojiUrl += '?email=' + userEmail + '&';
            }
        }
        else {
            if (this.parameterPresent('email=')) {
                let start = this.emojiUrl.indexOf('email=');
                const end = this.emojiUrl.indexOf('&', start);
                if (this.emojiUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.emojiUrl.indexOf(searchParam) !== -1;
    }

    private removeParameter(searchParam: string) {
        const start = this.emojiUrl.indexOf(searchParam);
        let end = 0;
        if (this.emojiUrl.indexOf('&') !== -1) {
            end = this.emojiUrl.indexOf('&', start) + 1;
        } else {
            end = this.emojiUrl.indexOf('&', start);
        }
        this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end);
    }


}
