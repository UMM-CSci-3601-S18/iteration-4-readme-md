import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Goal} from "./goals";
import {GoalsService} from "./goals.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGoalComponent} from "./add-goals.component";
import {MatSnackBar} from '@angular/material';
import {AuthService, SocialUser} from "angularx-social-login";
import {environment} from "../../environments/environment";
@Component({
    selector: 'app-goals-component',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.css']
})


export class GoalsComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public goals: Goal[];
    public filteredGoals: Goal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    // These are the target values used in searching.
    public goalPurpose: string;
    public goalCategory: string;
    public goalName: string;
    public user: SocialUser;
    public goalStatus: boolean;

    // Inject the GoalListService into this component.
    constructor(public goalsService: GoalsService, public dialog: MatDialog,
                public snackBar: MatSnackBar, public authService: AuthService) {

    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    private highlightedID: {'$oid': string} = { '$oid': '' };



    openDialog(): void {
        const newGoal: Goal =
            {
            _id: '',
            purpose: '',
            category: '',
            name: '',
            status: false,
            email: this.user.email,
            };
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '500px',
            data: { goal: newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalsService.addGoal(result).subscribe(
                addGoalResult => {
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteGoal(_id: string){
        this.goalsService.deleteGoal(_id).subscribe(
            goals => {
                this.refreshGoals();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshGoals();
                this.loadService();
            }
        );
    }

    goalSatisfied(_id: string, thePurpose: string, theCategory: string, theName, email: string,) {
        const updatedGoal: Goal = {_id: _id, purpose: thePurpose, category: theCategory, name: theName, status: true, email: email};
        this.goalsService.editGoal(updatedGoal).subscribe(
            editGoalsResult => {
                this.highlightedID = editGoalsResult;
                this.refreshGoals();
            },
            err => {
                console.log('There was an error editing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    public filterGoals(searchStatus:boolean): Goal[] {

        this.filteredGoals = this.goals;

        // Filter by status
        if (searchStatus != null) {

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return goal.status === searchStatus;
            });
        }




        return this.filteredGoals;
    }


    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<Goal[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const goalListObservable: Observable<Goal[]> = this.goalsService.getGoals(this.user.email);
        goalListObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalStatus);
            },
            err => {
                console.log(err);
            });
        return goalListObservable;
    }

    loadService(): void {
        this.goalsService.getGoals(this.user.email).subscribe(
            goals => {
                this.goals = goals;
                this.filteredGoals = this.goals;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        if(environment.envName != 'e2e') {
            this.authService.authState.subscribe((user) => {
                this.user = user;
            });
        }
        else {
            // run this code during e2e testing
            // so that we don't have to sign in
            this.user = {
                provider: '',
                id: '',
                email: 'sunshine@test.com',
                name: 'test dummy',
                photoUrl: '',
                firstName: 'test',
                lastName: 'dummy',
                authToken: '',
                idToken: 'testToken',
            };
        }
        this.refreshGoals();
    }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    getLoginName(){
        var name = this.user.name;
        return name;
    }

    parseStatus(thing: Boolean){
        if(thing == true) return "Complete"
        else return "Incomplete"
    }

}
