import {ComponentFixture, TestBed, async} from '@angular/core/testing';


import {GoalsService} from "./goals.service";
import {GoalsComponent} from "./goals.component";
import {Goal} from "./goals";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {AuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('Goal list', () => {

    let goals: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub GoalService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    _id: "5aa0b36ecf40cfd384c299fd",
                    purpose: "Go to bed earlier",
                    category: "Health",
                    name: "test",
                    status:true,
                    userId: "brittany@gmail.com",
                },
                {
                    _id: "5aa0b36e50d6094af8e91aba",
                    purpose: "Go to bed earlier",
                    category: "Health",
                    name: "test2",
                    status: false,
                    userId: "cathleen@gmail.com",
                },
                {
                    _id: "5aa0b36e3f417437ce3c502a",
                    purpose: "Get groceries",
                    category: "Chores",
                    name: "test3",
                    status: true,
                    userId: "martinez@gmail.com",
                }
            ])
        };

        authServiceStub = {
            authState: Observable.of(
                {
                    provider: '',
                    id: '',
                    email: '',
                    name: 'test dummy',
                    photoUrl: '',
                    firstName: 'test',
                    lastName: 'dummy',
                    authToken: '',
                    idToken: '',
                }
            )
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            // providers:    [ GoalsService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goals = fixture.componentInstance;
            fixture.detectChanges();

        });
    }));

    it('contains all the goals', () => {
        expect(goals.goals.length).toBe(3);
    });

    it('contains a _id named \'5aa0b36ecf40cfd384c299fd\'', () => {
        expect(goals.goals.some((goal: Goal) => goal._id === '5aa0b36ecf40cfd384c299fd')).toBe(true);
    });


    it('doesn\'t contains an _id \'asdfasdfasdf\'', () => {
        expect(goals.goals.some((goal: Goal) => goal._id === 'asdfasdfasdf')).toBe(false);
    });




        /*
            it('has two goals that are 37 years old', () => {
                expect(goals.goals.filter((goal: Goal) => goal.age === 37).length).toBe(2);
            });

            it('goal list filters by name', () => {
                expect(goals.filteredGoals.length).toBe(3);
                goals.goalName = 'a';
                goals.refreshGoals().subscribe(() => {
                    expect(goals.filteredGoals.length).toBe(2);
                });
            });
        */
});

// describe('Misbehaving Goals', () => {
//     let goals: GoalsComponent;
//     let fixture: ComponentFixture<GoalsComponent>;
//
//     let goalsServiceStub: {
//         getGoals: () => Observable<Goal[]>
//     };
//
//     let authServiceStub: {
//         authState: Observable<SocialUser>
//     };
//
//
//     beforeEach(() => {
//         // stub GoalService for test purposes
//         goalsServiceStub = {
//             getGoals: () => Observable.create(observer => {
//                 observer.error('Error-prone observable');
//             })
//         };
//
//         authServiceStub = {
//             authState: Observable.of(
//                 {
//                     provider: '',
//                     id: '',
//                     email: '',
//                     name: 'test dummy',
//                     photoUrl: '',
//                     firstName: 'test',
//                     lastName: 'dummy',
//                     authToken: '',
//                     idToken: '',
//                 }
//             )
//         };
//
//         TestBed.configureTestingModule({
//             imports: [FormsModule, CustomModule],
//             declarations: [GoalsComponent],
//             providers: [{provide: GoalsService, useValue: goalsServiceStub},
//                 {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
//                 {provide: AuthService, useValue: authServiceStub}]
//         });
//     });
//
//     beforeEach(async(() => {
//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(GoalsComponent);
//             goals = fixture.componentInstance;
//             fixture.detectChanges();
//         });
//     }));
//
//     it('generates an error if we don\'t set up a GoalsService', () => {
//         // Since the observer throws an error, we don't expect goals to be defined.
//         expect(goals.goals).toBeUndefined();
//     });
// });


describe('Goals Mat Dialogs', () => {
    let goals: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    let goalDeleted: boolean;
    const newGoal: Goal = {
        _id: "5aa0b36e9c7d66070b9231e4",
        purpose: "To feel better",
        category: "Activity",
        name: "test",
        status: false,
        userId: "enid@gmail.com",
    };
    const newId = 'enid_id';

    let calledGoal: Goal;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addGoal: (newGoal: Goal) => Observable<{'$oid': string}>,
        deleteGoal: (id: string) => Observable<object>,
    };
    let authServiceStub: {
        authState: Observable<SocialUser>
    };
    let mockMatDialog: {
        open: (AddGoalComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        goalDeleted = false;
        // stub GoalService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.of([]),
            addGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            },
            deleteGoal: (id: string) => {
                goalDeleted = true;
                return Observable.of({
                    '$oid' : id
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newGoal);
                    }
                };
            }
        };
        authServiceStub = {
            authState: Observable.of(
                {
                    provider: '',
                    id: '',
                    email: '',
                    name: 'test dummy',
                    photoUrl: '',
                    firstName: 'test',
                    lastName: 'dummy',
                    authToken: '',
                    idToken: '',
                }
            )
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalsServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goals = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls GoalsService.addGoal in GoalComponent.openDialog()', () => {
        expect(calledGoal).toBeNull();
        goals.openDialog();
        expect(calledGoal).toEqual(newGoal);
    });

    it('calls GoalsService.deleteGoal in GoalComponent.deleteGoal()', () => {
        goals.deleteGoal('testId');
        expect(goalDeleted).toBeTruthy();
    });

});
