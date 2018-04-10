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
                    mood: 3,
                    date: 'd', //date will be created during the test so that it matches what is made in component.addEmoji
                    email: "nick@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Roch',
                    mood: 4,
                    date: '', //date will be created during the test so that it matches what is made in component.addEmoji
                    email: "roch@gmail.com",
                },
                {
                    _id: 'd',
                    owner: 'Leo',
                    mood: 5,
                    date: 'e', //date will be created during the test so that it matches what is made in component.addEmoji
                    email: "leo@gmail.com",
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

    it('emoji list filters by name', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiOwner = 'L';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });


});

describe('Misbehaving Emoji List', () => {
    let emojiList: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    let emojiListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        emojiListServiceStub = {
            getEmojis: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
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
            declarations: [ReportsComponent],
            providers: [{provide: ReportsService, useValue: emojiListServiceStub},
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

    it('generates an error if we don\'t set up a UserListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(emojiList.emojis).toBeUndefined();
    });
});



