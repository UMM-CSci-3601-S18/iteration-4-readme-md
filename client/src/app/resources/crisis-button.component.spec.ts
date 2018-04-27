import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {resources} from './resources';
import {ResourcesService} from './resources.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {SocialUser} from "angularx-social-login";
import {CrisisButtonComponent} from "./crisis-button.component";

describe('Resource list', () => {

    let crisisButtonComponent: CrisisButtonComponent;
    let fixture: ComponentFixture<CrisisButtonComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };

    let calledClose: boolean;
    const mockMatDialogRef = {
        close() {
            calledClose = true;
        }
    };

    const testUser: SocialUser = {
        provider: '',
        id: '',
        email: '',
        name: 'test dummy',
        photoUrl: '',
        firstName: 'test',
        lastName: 'dummy',
        authToken: '',
        idToken: '',
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Lir Fealladh',
                    body: 'My father',
                    phone: '555-555-5550',
                    userId: 'Lir@Fealladh.com'

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Reina',
                    body: 'My best friend',
                    phone: '555-555-5551',
                    userId: 'Reina@myfriend.com'

                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Suicide Prevention Lifeline',
                    body: 'We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.',
                    phone: '1-800-555-5555',
                    userId: 'preventsuicide@lifeline.org'

                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [CrisisButtonComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {user: testUser} },
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CrisisButtonComponent);
            crisisButtonComponent = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the resources', () => {
        expect(crisisButtonComponent.resources.length).toBe(3);
    });

    it('contains a resource with name \'Lir Fealladh\'', () => {
        expect(crisisButtonComponent.resources.some((resource: resources) => resource.name === 'Lir Fealladh')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(crisisButtonComponent.resources.some((resource: resources) => resource.name === 'Santa')).toBe(false);
    });


    it('has one resources with phone', () => {
        expect(crisisButtonComponent.resources.filter((resource: resources) => resource.phone === '555-555-5551').length).toBe(1);
    });

});
