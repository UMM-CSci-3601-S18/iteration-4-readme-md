import {Component, Inject, OnInit} from '@angular/core';
import {JournalListService} from './journal-list.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AddJournalComponent} from './add-journal.component';
import {EditJournalComponent} from "./edit-journal.component";
import {environment} from "../../environments/environment";
import {SelectJournalComponent} from "./select-journal.component";
import {AuthService} from "angularx-social-login";
import {SocialUser} from "angularx-social-login";

@Component({
    selector: 'app-journal-list-component',
    templateUrl: 'journal-list.component.html',
    styleUrls: ['./journal-list.component.css'],
})

export class JournalListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public journalSubject: string;
    public journalBody: string;
    public journalDate: any;
    public user: SocialUser;

    public journalSearch: string;

    /*public prompts: String[] = ["What are you grateful for?","What scares you?","How are you Feeling?", "What do you love about your life?","Today I accomplished...","Who made you feel good this week?","What did you enjoy doing this week?","What would you do if you knew you could not fail?","What are your best character traits?","What did you learn this week?","What did you do this week that moved you closer to reaching your goals?"];
    public prompt: String;*/


    public selectedJournal: Journal;

    // Inject the JournalListService into this component.
    constructor(public journalListService: JournalListService,
                public dialog: MatDialog,
                public authService: AuthService,) {

        if(environment.production === false) {

        }
    }




    openDialog(): void {
        const newJournal: Journal = {_id: '', subject: '', body: '', date: '', userId: localStorage.getItem('userId')};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '500px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.addNewJournal(result).subscribe(
                addJournalResult => {
                    this.selectedJournal = newJournal;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    // openDialogSelect(): void {
    //     const newJournal: Journal = {_id: '', subject: '', body: '', date: '', userId: localStorage.getItem('userId')};
    //     const dialogRef = this.dialog.open(SelectJournalComponent, {
    //         width: '500px',
    //         data: { journal: newJournal }
    //     });
    //
    //     dialogRef.afterClosed().subscribe(result => {
    //         if(result != null) {
    //             this.selectedJournal = result;
    //         }
    //     });
    // }


    openDialogReview(editJournal: Journal): void {
        console.log(editJournal._id + ' ' + editJournal.subject);
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '500px',
            data: { journal: editJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.editJournal(result).subscribe(
                editJournalResult => {

                    if(result != null) {
                        this.selectedJournal = result;
                    }
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteJournal(_id: string){
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {
                this.refreshJournals();
                this.loadService();
                this.selectedJournal = null;
            },
            err => {
                console.log(err);
                this.refreshJournals();
                this.loadService();
                this.selectedJournal = null;
            }
        );
    }

    loadService(): void {
        this.journalListService.getJournals(localStorage.getItem('userId')).subscribe(
            journals => {
                this.journals = journals;
                this.filteredJournals = this.journals;
            },
            err => {
                console.log(err);
            }
        );
    }


    public getReadableDate(dateString: string): string {
        if(dateString == '') {
            return '';
        }
        const date = new Date(dateString);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    public filterJournals(searchString: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by the searchString, look in body and subject
        if (searchString != null) {
            searchString = searchString.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchString || journal.subject.toLowerCase().indexOf(searchString) !== -1 || journal.body.toLowerCase().indexOf(searchString) !== -1;
            });
        }

        return this.filteredJournals;
    }


    /**
     * Starts an asynchronous operation to update the journals list
     *
     */
    refreshJournals(): Observable<Journal[]> {
        // Get Journals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals(localStorage.getItem('userId'));
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalSearch);
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    /**
     * we might want the server to search for entries instead of angular ?
     loadService(): void {
        this.journalListService.getJournals(this.userCompany).subscribe(
            users => {
                this.users = users;
                this.filteredUsers = this.users;
            },
            err => {
                console.log(err);
            }
        );
    }
     **/

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
        this.refreshJournals();
        /*this.generateRandomPrompt();*/
    }


    /*generateRandomPrompt(): void {
        this.prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
    }*/
}
