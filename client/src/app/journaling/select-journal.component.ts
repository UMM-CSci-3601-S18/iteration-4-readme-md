import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';
import {JournalListService} from "./journal-list.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-select-journal.component',
    templateUrl: 'select-journal.component.html',
})

export class SelectJournalComponent implements OnInit{

    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public journalSearch: string;

    constructor(
        public dialogRef: MatDialogRef<SelectJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal},
        public journalListService: JournalListService) {
    }

    public userEmail = localStorage.getItem('email');

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

    selectJournal(selectedJournal: Journal): void {
        this.dialogRef.close(selectedJournal);
    }

    refreshJournals(): Observable<Journal[]> {
        // Get Journals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals();
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

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.refreshJournals();
        //this.loadService();
    }

    public getReadableDate(dateString: string): string {
        if(dateString == '') {
            return '';
        }
        const date = new Date(dateString);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
}
