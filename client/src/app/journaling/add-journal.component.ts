import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';

@Component({
    selector: 'app-add-journal.component',
    templateUrl: 'add-journal.component.html',
})

export class AddJournalComponent implements OnInit{

    public prompts: String[] = ["What are you grateful for?","What scares you?","How are you Feeling?", "What do you love about your life?","Today I accomplished...","Who made you feel good this week?","What did you enjoy doing this week?","What would you do if you knew you could not fail?","What are your best character traits?","What did you learn this week?","What did you do this week that moved you closer to reaching your goals?"];

    public prompt: String;

    //var  prompt = this.generateRandomPrompt;

    constructor(
        public dialogRef: MatDialogRef<AddJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    generateRandomPrompt(): void {
       this.prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
    }

    ngOnInit (): void {
        this.generateRandomPrompt();
    }
}
