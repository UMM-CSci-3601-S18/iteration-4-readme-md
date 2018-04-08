//Currently doesn't do

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {resources} from './resources';
import {environment} from '../../environments/environment';
import {ResourcesComponent} from "./resources.component";


@Injectable()
export class ResourcesService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourcesUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    addResources(newResources: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        if (this.parameterPresent('email')) {
            this.removeParameter('email')
            let locationOfQuestionMark = this.resourcesUrl.indexOf('?')
            this.resourcesUrl = this.resourcesUrl.substring(0, locationOfQuestionMark) + this.resourcesUrl.substring(locationOfQuestionMark + 1, this.resourcesUrl.length)

            return this.http.post<{ '$oid': string }>(this.resourcesUrl + '/new', newResources, httpOptions);
        }
    }

    getResourcesById(id: string): Observable<resources> {
        return this.http.get<resources>(this.resourcesUrl + '/' + id);
    }

    getResources(userEmail: string): Observable<resources[]> {
        this.filterByEmail(userEmail);
        return this.http.get<resources[]>(this.resourcesUrl);
    }


    filterByEmail(userEmail?: string): void {
            if(!(userEmail == null || userEmail === '')) {
            if (this.parameterPresent('email=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('email=');
            }
            if (this.resourcesUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.resourcesUrl += 'email=' + userEmail + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.resourcesUrl += '?email=' + userEmail + '&';
            }
        }
    else {
            if (this.parameterPresent('email=')) {
                let start = this.resourcesUrl.indexOf('email=');
                const end = this.resourcesUrl.indexOf('&', start);
                if (this.resourcesUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.resourcesUrl = this.resourcesUrl.substring(0, start) + this.resourcesUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
            return this.resourcesUrl.indexOf(searchParam) !== -1;
        }

    private removeParameter(searchParam: string) {
            const start = this.resourcesUrl.indexOf(searchParam);
            let end = 0;
            if (this.resourcesUrl.indexOf('&') !== -1) {
                end = this.resourcesUrl.indexOf('&', start) + 1;
            } else {
                end = this.resourcesUrl.indexOf('&', start);
            }
            this.resourcesUrl = this.resourcesUrl.substring(0, start) + this.resourcesUrl.substring(end);
        }
}
