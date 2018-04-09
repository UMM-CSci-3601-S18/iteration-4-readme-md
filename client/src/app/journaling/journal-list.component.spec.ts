import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from './journal';
import {JournalListComponent} from './journal-list.component';
import {JournalListService} from './journal-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {AuthService, SocialUser} from "angular4-social-login";

describe('Journal list', () => {

    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub JournalService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.of([
                {
                    _id: "5aa0b36e401cfced5f36b1a7",
                    subject: "York",
                    body: "You can do it",
                    date: "Sun Feb 04 1979 13:35:46 GMT-0600 (CST)",
                    email: "york@fake.com"
                },
                {
                    _id: "5aa0b36ef2d33e651859bd70",
                    subject: "Sutton",
                    body: "There you go",
                    date: "Sun Oct 28 2012 03:04:31 GMT-0500 (CDT)",
                    email: "sutton@fakeemail.com"
                },
                {
                    _id: "5aa0b36e5c1d05d2cb0460a4",
                    subject: "Madelyn",
                    body: "There you go",
                    date: "Thu Sep 25 2003 14:45:37 GMT-0500 (CDT)",
                    email: "madelyn@madelyn.com"
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
                }
            )
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [JournalListComponent],
            // providers:    [ JournalListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the journals', () => {
        expect(journalList.journals.length).toBe(3);
    });

    it('contains a journal with subject \'York\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'York')).toBe(true);
    });

    it('contain a journal with subject \'Sutton\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Sutton')).toBe(true);
    });

    it('doesn\'t contain a journal with subject \'Santa\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Santa')).toBe(false);
    });

    it('has two journals with body "There you go"', () => {
        expect(journalList.journals.filter((journal: Journal) => journal.body === "There you go").length).toBe(2);
    });

    it('journal list filters by body', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalBody = 'g';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(2);
        });
    });

    it('journal list filters by subject', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalSubject = "York";
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

    it('journal list filters by subject and body', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalSubject = "Madelyn";
        journalList.journalBody = 'go';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

});

//sometimes randomly fails, so we are skipping it (by using xdescribe)
xdescribe('Misbehaving Journal List', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    beforeEach(() => {
        // stub JournalService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
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
                }
            )
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalListService', () => {
        // Since the observer throws an error, we don't expect journals to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});


describe('Adding a journal', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;
    const newJournal: Journal = {
        _id: "5aa0b36e1f57545f27a26b69",
        subject: "Pennington",
        body: "Get it done",
        date: "Sun Feb 07 1982 22:41:23 GMT-0600 (CST)",
        email: "pennington@pennington.com"
    };
    const newId = 'pennington_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let authServiceStub: {
        authState: Observable<SocialUser>
    };
    let mockMatDialog: {
        open: (AddJournalComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (journalToAdd: Journal) => {
                calledJournal = journalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
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
                }
            )
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [
                {provide: JournalListService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AuthService, useValue: authServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalListService.addJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});
