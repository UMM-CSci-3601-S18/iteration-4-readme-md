import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';
import {Goal} from "./goals";

@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + 'goals';

    constructor(private http: HttpClient) {
    }

    addGoal(newGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.baseUrl + '/new', newGoal, httpOptions);
    }

    getGoalById(id: string): Observable<Goal> {
        return this.http.get<Goal>(this.baseUrl + '/' + id);
    }

    getGoals(userId: string): Observable<Goal[]> {
        return this.http.get<Goal[]>(this.baseUrl + '?userId=' + userId);
    }

    editGoal(editedGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goal with the goal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.baseUrl + '/edit', editedGoal, httpOptions);
    }

    deleteGoal(goalID: String) {
        console.log ("here!");

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.baseUrl + '/delete/' + goalID);
        console.log(this.http.delete(this.baseUrl + '/delete/' + goalID, httpOptions));
        // Send post request to add a new goal with the goal data as the body with specified headers.
        return this.http.delete(this.baseUrl + '/delete/' + goalID, httpOptions);
    }
}
