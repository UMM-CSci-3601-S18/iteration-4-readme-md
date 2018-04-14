import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {CustomModule} from './custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {AuthService, SocialUser} from "angularx-social-login";
import {Observable} from "rxjs/Observable";
import {AuthResponse} from "./AuthResponse";
import {LoginService} from "./login.service";

describe('AppComponent', () => {
    let appInstance: AppComponent;
    let appFixture: ComponentFixture<AppComponent>;
    let debugElement: DebugElement;

    let authServiceStub: {
        authState: Observable<SocialUser>,
        signIn: (providerId: string) => Promise<SocialUser>,
        signOut: () => Promise<any>
    };

    let loginServiceStub: {
        authenticate: (authId: string) => Promise<AuthResponse>
    };


    beforeEach(() => {
        //stub authService
        authServiceStub = {
            authState: Observable.of({
                provider: '',
                id: '',
                email: '',
                name: 'test dummy',
                photoUrl: '',
                firstName: 'test',
                lastName: 'dummy',
                authToken: '',
                idToken: 'testToken',
            }),
            signIn: providerId => {
                return new Promise(resolve => {
                    let user = {
                        provider: '',
                        id: '',
                        email: '',
                        name: 'test dummy',
                        photoUrl: '',
                        firstName: 'test',
                        lastName: 'dummy',
                        authToken: '',
                        idToken: 'testToken',
                    };

                    // set authstate to the user
                    authServiceStub.authState = Observable.of(user);

                    resolve(user);
                });

            },
            signOut: () => {
                return new Promise(resolve => {
                    //set user to null when signing out
                    appInstance.user = null;
                    resolve('Signed Out');
                });
            }
        };

        loginServiceStub = {
            authenticate: authId => {
                return new Promise(resolve => {
                    resolve({
                        iss: '',
                        sub: '',
                        azp: '',
                        aud: '557763158088-rb4bkc622e0lkc5tnksua58b187n3r33.apps.googleusercontent.com',
                        iat: '',
                        exp: '',

                        email: '',
                        email_verified: true,
                        name : 'test dummy',
                        picture: '',
                        given_name: '',
                        family_name: '',
                        locale: '',
                    });
                });
            }
        };

        TestBed.configureTestingModule({
            imports: [
                CustomModule,
                AppModule
            ],
            providers: [{provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub},
                {provide: LoginService, useValue: loginServiceStub}],
        });

        appFixture = TestBed.createComponent(AppComponent);

        appInstance = appFixture.componentInstance;

        debugElement = appFixture.debugElement;
    });

    it('should create the app', () => {
        expect(appFixture).toBeTruthy();
    });

    it(`should have as title 'app'`, () => {
        expect(appInstance.title).toEqual('Sunshine Journal');
    });

    it('user should be null after logging out', () => {
        appInstance.ngOnInit();
        expect(appInstance.user.name).toBe('test dummy')
        appInstance.signOut();
        expect(appInstance.user).toBeNull();
    });

});
