import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {resources} from './resources';
import {ResourcesComponent} from './resources.component';
import {ResourcesService} from './resources.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {AuthService, SocialUser} from "angularx-social-login";

describe('Resource list', () => {

    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };
    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Lir Fealladh',
                    body: 'My farther',
                    phone: '555-555-5550',
                    email: 'Lir@Fealladh.com'

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Reina',
                    body: 'My best friend',
                    phone: '555-555-5551',
                    email: 'Reina@myfriend.com'

                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Suicide Prevention Lifeline',
                    body: 'We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.',
                    phone: '1-800-555-5555',
                    email: 'preventsuicide@lifeline.org'

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
            declarations: [ResourcesComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the resources', () => {
        expect(resourceList.resources.length).toBe(3);
    });

    it('contains a resource with name \'Lir Fealladh\'', () => {
        expect(resourceList.resources.some((resource: resources) => resource.name === 'Lir Fealladh')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(resourceList.resources.some((resource: resources) => resource.name === 'Santa')).toBe(false);
    });


    it('has one resources with phone', () => {
        expect(resourceList.resources.filter((resource: resources) => resource.phone === '555-555-5551').length).toBe(1);
    });

});

describe('Misbehaving Resource List', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };
    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.create(observer => {
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
            declarations: [ResourcesComponent],
            providers: [{provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a ResourceListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(resourceList.resources).toBeUndefined();
    });
});


describe('Adding a resource', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newResource: resources = {
        _id: '',
        name: 'Bryon',
        body: "My Other Best Friend",
        phone: "555-555-5552",
        email: "bryonotherbestfriend.gov",
    };
    const newId = 'new_id';

    let calledResource: resources;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>,
        addResources: (newResource: resources) => Observable<{'$oid': string}>
    };
    let authServiceStub: {
        authState: Observable<SocialUser>
    };
    let mockMatDialog: {
        open: (AddResourceComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResource = null;
        // stub ResourceService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.of([]),
            addResources: (resourceToAdd: resources) => {
                calledResource = resourceToAdd;
                return Observable.of({
                    '$oid': newId
                });
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
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newResource);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [
                {provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls ResourcesService.addResource', () => {
        expect(calledResource).toBeNull();
        resourceList.openDialog();
        expect(calledResource).toEqual(newResource);
    });

});
