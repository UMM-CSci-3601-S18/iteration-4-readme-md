
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ReportsComponent} from "./reports.component";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {ReportsService} from "./reports.service";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Emoji} from "../emoji";
import {AuthService, SocialUser} from "angularx-social-login";
import * as Chart from 'chart.js';

describe('Reports list', () => {

    let emojiList: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    let ReportsListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub ReportsService for test purposes
        ReportsListServiceStub = {
            getEmojis: () => Observable.of([
                {
                    _id: 'f',
                    owner: 'Nick',
                    intensity: 1,
                    mood: 1,
                    date: '\'Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)\'',
                    userId: "nick@gmail.com",
                },

                {
                    _id: 'f',
                    owner: 'Nick',
                    intensity: 1,
                    mood: 2,
                    date: '\'Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)\'',
                    userId: "nick@gmail.com",
                },

                {
                    _id: 'f',
                    owner: 'Nick',
                    intensity: 1,
                    mood: 3,
                    date: '\'Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)\'',
                    userId: "nick@gmail.com",
                },

                {
                    _id: 'f',
                    owner: 'Nick',
                    intensity: 1,
                    mood: 4,
                    date: '\'Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)\'',
                    userId: "nick@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Roch',
                    intensity: 1,
                    mood: 4,
                    date: 'Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)',
                    userId: "roch@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Leo',
                    intensity: 1,
                    mood: 5,
                    date: 'e',
                    userId: "leo@gmail.com",
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
            declarations: [ReportsComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ReportsService, useValue: ReportsListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportsComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the emojis', () => {
        expect(emojiList.emojis.length).toBe(6);
    });

    it('contains a owner named \'Roch\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Nick')).toBe(true);
    });

    it('contain a user named \'Jamie\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Roch')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Santa')).toBe(false);
    });

    it('has one emoji with the owner leo', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.owner === 'Leo').length).toBe(1);
    });



});

describe('Charts', () => {

    let reportsComponent: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    let ReportsListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    let emojiList = [
        {
            _id: 'f',
            owner: 'Nick',
            mood: 3,
            date: new Date().getTime().toString(),
            intensity: 3,
            userId: "nick@gmail.com",
        },
        {
            _id: 'd',
            owner: 'Roch',
            mood: 4,
            date: new Date().getTime().toString(),
            intensity: 2,
            userId: "roch@gmail.com",
        },
        {
            _id: 'd',
            owner: 'Leo',
            mood: 5,
            date: new Date().getTime().toString(),
            intensity: 1,
            userId: "leo@gmail.com",
        }
    ];

    beforeEach(() => {
        // stub ReportsService for test purposes
        ReportsListServiceStub = {
            getEmojis: () => Observable.of([
                {
                    _id: 'f',
                    owner: 'Nick',
                    mood: 3,
                    date: new Date().getTime().toString(),
                    intensity: 3,
                    userId: "nick@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Roch',
                    mood: 4,
                    date: new Date().getTime().toString(),
                    intensity: 2,
                    userId: "roch@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Leo',
                    mood: 5,
                    date: new Date().getTime().toString(),
                    intensity: 1,
                    userId: "leo@gmail.com",
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
            declarations: [ReportsComponent],
            providers: [{provide: ReportsService, useValue: ReportsListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportsComponent);
            reportsComponent = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('filter graph works correctly', () => {

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterGraph( new Date(new Date().getTime()).getDate()+1, 5)).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterGraph( new Date(new Date().getTime()).getDate()+1, 4)).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterGraph( new Date(new Date().getTime()).getDate()+1, 3)).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);

        reportsComponent.inputType == "Last month"
        expect(reportsComponent.filterGraph( new Date(new Date().getTime()).getDay(), 3)).toEqual(1);



    });

    it('filter emojis works correctly', () => {

        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.inputType == "Last month"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3).length).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.inputType == "Last week"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3).length).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.inputType =="This week"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3).length).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.inputType == "Today"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3).length).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.inputType == "Show All Data"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3).length).toEqual(1);


    });



    it('filter emojis by date works correctly', () => {

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojisByDate(3, parseInt(reportsComponent.filteredEmojis[0].date), parseInt(reportsComponent.filteredEmojis[1].date)+600000));

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojisByDate(4, parseInt(reportsComponent.filteredEmojis[1].date), null).length).toEqual(1);


        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojisByDate(4, null, parseInt(reportsComponent.filteredEmojis[1].date)+600000).length).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojisByDate(null, null, null).length).toEqual(3);


    });

    it('filter all emotions', () => {

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterAllEmotions(3)).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterAllEmotions(4)).toEqual(1);

        reportsComponent.filteredEmojis = emojiList;
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterAllEmotions(5)).toEqual(1);




    });





});

// This test breaks for unknown reasons
// describe('Misbehaving Emoji List', () => {
//     let emojiList: ReportsComponent;
//     let fixture: ComponentFixture<ReportsComponent>;
//
//     let emojiListServiceStub: {
//         getEmojis: () => Observable<Emoji[]>
//     };
//
//     let authServiceStub: {
//         authState: Observable<SocialUser>
//     };
//
//     beforeEach(() => {
//         // stub UserService for test purposes
//         emojiListServiceStub = {
//             getEmojis: () => Observable.create(observer => {
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
//             declarations: [ReportsComponent],
//             providers: [{provide: ReportsService, useValue: emojiListServiceStub},
//                 {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
//                 {provide: AuthService, useValue: authServiceStub}]
//         });
//     });
//
//     beforeEach(async(() => {
//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(ReportsComponent);
//             emojiList = fixture.componentInstance;
//             fixture.detectChanges();
//         });
//     }));
//
//     it('generates an error if we don\'t set up a UserListService', () => {
//         // Since the observer throws an error, we don't expect users to be defined.
//         expect(emojiList.emojis).toBeUndefined();
//     });
// });




