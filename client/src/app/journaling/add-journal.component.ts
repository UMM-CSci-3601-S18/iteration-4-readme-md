import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';

@Component({
    selector: 'app-add-journal.component',
    templateUrl: 'add-journal.component.html',
})

export class AddJournalComponent {

    public prompts: String[] = ["test1","test2","How are you Feeling?"];

    public prompt: String = this.generateRandomPrompt();

    //var  prompt = this.generateRandomPrompt;

    constructor(
        public dialogRef: MatDialogRef<AddJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    generateRandomPrompt(): String {
       return this.prompts[Math.floor(Math.random() * this.prompts.length)];
    }
}
