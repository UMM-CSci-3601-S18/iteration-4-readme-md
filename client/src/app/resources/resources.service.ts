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

    constructor(private http: HttpClient) {
    }

    addResources(newResources: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        return this.http.post<{ '$oid': string }>(this.baseUrl + '/new', newResources, httpOptions);

    }

    getResourcesById(id: string): Observable<resources> {
        return this.http.get<resources>(this.baseUrl + '/' + id);
    }

    /*getResources(userEmail: string): Observable<resources[]> {
        this.filterByEmail(userEmail);
        return this.http.get<resources[]>(this.resourcesUrl);
    }
    */

    getResources(userId: string): Observable<resources[]> {

        return this.http.get<resources[]>(this.baseUrl + '?userId=' + userId);
    }




    deleteResource(resourceID: string) {
        console.log ("here!");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.baseUrl + '/delete/' + resourceID);
        console.log(this.http.delete(this.baseUrl + '/delete/' + resourceID, httpOptions))
        // Send post request to add a new goal with the goal data as the body with specified headers.
        return this.http.delete (this.baseUrl + '/delete/' + resourceID, httpOptions);
    }
}
