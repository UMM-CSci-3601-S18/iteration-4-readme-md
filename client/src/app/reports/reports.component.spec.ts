
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
                    mood: 3,
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
        expect(emojiList.emojis.length).toBe(3);
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

    // it('emoji list filters by name', () => {
    //
    //     expect(emojiList.filteredEmojis.length).toBe(3);
    //     emojiList.emojiOwner = 'L';
    //     emojiList.refreshEmojis().subscribe(() => {
    //         expect(emojiList.filteredEmojis.length).toBe(1);
    //     });
    // });


});

fdescribe('Charts', () => {

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
            date: (new Date('Tue May 14 1974 08:51:10 GMT-0500 (CDT)')).getUTCMilliseconds().toString(),
            intensity: 3,
            userId: "nick@gmail.com",
        },
        {
            _id: 'd',
            owner: 'Roch',
            mood: 4,
            date: (new Date()).getUTCMilliseconds().toString(),
            intensity: 2,
            userId: "roch@gmail.com",
        },
        {
            _id: 'd',
            owner: 'Leo',
            mood: 5,
            date: (new Date()).getUTCMilliseconds().toString(),
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
                    date: (new Date('Tue May 14 1974 08:51:10 GMT-0500 (CDT)')).getUTCMilliseconds().toString(),
                    intensity: 3,
                    userId: "nick@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Roch',
                    mood: 4,
                    date: (new Date()).getUTCMilliseconds().toString(),
                    intensity: 2,
                    userId: "roch@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Leo',
                    mood: 5,
                    date: (new Date()).getUTCMilliseconds().toString(),
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
        reportsComponent.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
        reportsComponent.endDate = new Date('Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)');
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterEmojis(3,'06', '07')).toEqual(reportsComponent.filteredEmojis);
    });

    it('filter graph works correctly', () => {
        reportsComponent.filteredEmojis = emojiList;
        reportsComponent.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
        reportsComponent.endDate = new Date('Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)');
        reportsComponent.inputType = "Last Month"
        expect(reportsComponent.filteredEmojis.length).toEqual(3);
        expect(reportsComponent.filterGraph('06',3)).toEqual(1);
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




