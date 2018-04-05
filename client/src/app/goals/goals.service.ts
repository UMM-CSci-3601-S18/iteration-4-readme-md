import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';
import {Goal} from "./goals";

@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + 'goals';
    private goalsUrl: string = this.baseUrl;
    private userEmail: string = localStorage.getItem('email');

    constructor(private http: HttpClient) {
    }

    addGoal(newGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        if(this.parameterPresent('email')){
            this.removeParameter('email')
            let locationOfQuestionMark = this.goalsUrl.indexOf('?')
            this.goalsUrl = this.goalsUrl.substring(0, locationOfQuestionMark) + this.goalsUrl.substring(locationOfQuestionMark + 1, this.goalsUrl.length)
        }

        // Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalsUrl + '/new', newGoal, httpOptions);
    }

    getGoalById(id: string): Observable<Goal> {
        return this.http.get<Goal>(this.goalsUrl + '/' + id);
    }

    getGoals(): Observable<Goal[]> {
        this.filterByEmail(this.userEmail);
        return this.http.get<Goal[]>(this.goalsUrl);
    }

    //////Starting Here

    filterByEmail(userEmail?: string): void {
        if(!(userEmail == null || userEmail === '')) {
            if (this.parameterPresent('email=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('email=');
            }
            if (this.goalsUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.goalsUrl += 'email=' + userEmail + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.goalsUrl += '?email=' + userEmail + '&';
            }
        }
        else {
            if (this.parameterPresent('email=')) {
                let start = this.goalsUrl.indexOf('email=');
                const end = this.goalsUrl.indexOf('&', start);
                if (this.goalsUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.goalsUrl = this.goalsUrl.substring(0, start) + this.goalsUrl.substring(end + 1);
            }
        }
    }

    //added just in case
    filterByCategory(goalCategory?: string): void {
        if (!(goalCategory == null || goalCategory === '')) {
            if (this.parameterPresent('category=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('category=');
            }
            if (this.goalsUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.goalsUrl += 'category=' + goalCategory + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.goalsUrl += '?category=' + goalCategory + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('category=')) {
                let start = this.goalsUrl.indexOf('category=');
                const end = this.goalsUrl.indexOf('&', start);
                if (this.goalsUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.goalsUrl = this.goalsUrl.substring(0, start) + this.goalsUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.goalsUrl.indexOf(searchParam) !== -1;
    }

    private removeParameter(searchParam: string) {
        const start = this.goalsUrl.indexOf(searchParam);
        let end = 0;
        if (this.goalsUrl.indexOf('&') !== -1) {
            end = this.goalsUrl.indexOf('&', start) + 1;
        } else {
            end = this.goalsUrl.indexOf('&', start);
        }
        this.goalsUrl = this.goalsUrl.substring(0, start) + this.goalsUrl.substring(end);
    }

    editGoal(editedGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        if(this.parameterPresent('email')){
            this.removeParameter('email')
            let locationOfQuestionMark = this.goalsUrl.indexOf('?')
            this.goalsUrl = this.goalsUrl.substring(0, locationOfQuestionMark) + this.goalsUrl.substring(locationOfQuestionMark + 1, this.goalsUrl.length)
        }
        
        // Send post request to add a new goal with the goal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalsUrl + '/edit', editedGoal, httpOptions);
    }

    deleteGoal(goalID: String) {
        console.log ("here!")
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        if(this.parameterPresent('email')){
            this.removeParameter('email')
            let locationOfQuestionMark = this.goalsUrl.indexOf('?')
            this.goalsUrl = this.goalsUrl.substring(0, locationOfQuestionMark) + this.goalsUrl.substring(locationOfQuestionMark + 1, this.goalsUrl.length)
        }
        console.log(this.goalsUrl + '/delete/' + goalID)
    console.log(this.http.delete(this.goalsUrl + '/delete/' + goalID, httpOptions))
        // Send post request to add a new goal with the goal data as the body with specified headers.
        return this.http.delete(this.goalsUrl + '/delete/' + goalID, httpOptions);
    }
}
