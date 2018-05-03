import {Component, OnInit} from '@angular/core';
import {Emoji} from '../emoji';
import {HomeService} from "./home.service";
import {MatDialog, MatSnackBar} from '@angular/material';
import {ResponseComponent} from "./response.component";
import {AppComponent} from "../app.component";
import {AuthService, SocialUser} from "angularx-social-login";
import {environment} from "../../environments/environment";

// Selector will change when we know more

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    public emoji: Emoji = {_id: '', owner: '', date: '', mood: 3, intensity: 1, email: localStorage.getItem('email')};
    public email: string = localStorage.getItem('email');
    public user: SocialUser;
    public name: string;

    public lastMood = 3;
    public lastIntensity = 1;

    constructor(public homeService: HomeService, public dialog: MatDialog, public snackBar: MatSnackBar,
                public authService: AuthService) {

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
        });
    }

    openDialog(): void {
        const response = this.emoji.mood;
        const dialogRef = this.dialog.open(ResponseComponent, {
            width: '500px',
            data: { response }
        });
    }

    addEmoji(): void {

        const date = new Date();
        this.emoji.date = date.getTime().toString();
        this.emoji.owner = this.user.name;
        this.emoji.email = this.user.email;

        this.homeService.addEmoji(this.emoji).subscribe(
            addEmojiResult => {
                console.log('emoji '+ addEmojiResult + ' successfully added');
                this.openSnackBar('Emotion Saved', 'OK');
            },
            err => {
                // This should probably be turned into some sort of meaningful response.
                console.log('There was an error adding the user.');
                console.log('The error was ' + JSON.stringify(err));
                this.openSnackBar('There was an error communicating with the server. Your entry was not saved.', 'OK');
            });

            this.openDialog();
    }

    //This function is used to turn the number of the matslider into a word to be
    //displayed in the html.
    parseEmotionIntensity(mood: number, intensity: number){
        if(mood == 1){
            if(intensity == 1) {return "Frustrated"}
            else return "Angry"
        }
        else if(mood == 2){
            if(intensity == 1) {return "Anxious"}
            else return "Worried"
        }
        else if(mood == 3){
            if(intensity == 1) {return "Happy"}
            else if(intensity == 2) {return "Content"}
            else return "Ecstatic"
        }
        else if(mood == 4){
            if(intensity == 1) {return "Meh"}
            else return "Bleh"
        }
        else if(mood == 5){
            if(intensity == 1) {return "Unhappy"}
            else if (intensity == 2) {return "Sad"}
            else return "Miserable"
        }

        // If for some reason it gets here..
        return null;
    }

    parseSwipeDirection(mood: number){
        if(mood < this.lastMood) {
            if(mood == 1 && this.lastMood == 5) {
                return "right";
            }
            else if(mood == 5 && this.lastMood == 1) {
                return "left";
            }
            else{
                return "left";
            }
        }
        else if(mood == this.lastMood) {
            return "none";
        }
        else {
            if(mood == 1 && this.lastMood == 5) {
                return "right";
            }
            else if(mood == 5 && this.lastMood == 1) {
                return "left";
            }
            else{
                return "right"
            }
        }

    }

    // This function pertains to intensity carousel. It allows the value of emoji.intensity to
    // 'wrap around', but due to variable amounts of intensities across emotions, keeps track of
    // which only have 2 total intensities, and 3 total intensities.
    updateEmojiIntensity(num: number, intensity: number, mood: number){

        //Keep Track of last intensity.
        this.lastIntensity = intensity;

        var currentNumber = intensity;
        currentNumber = currentNumber + num;

        // Find which moods have 2 intensities verses 3 intensities.
        switch(mood){
            case 1:
            case 2:
            case 4:
                if(currentNumber < 1) currentNumber = 2;
                else if(currentNumber > 2) currentNumber = 1;
                return currentNumber;

            case 3:
            case 5:
                if(currentNumber < 1) currentNumber = 3;
                else if(currentNumber > 3) currentNumber = 1;
                return currentNumber;
        }
    }

    updateEmojiMood(num: number, mood: number, update: boolean){

        if(update)
        {
            //Reset Intensity on each press of "previous" or "next" buttons.
            this.emoji.intensity = 1;

            //Keep Track of last mood.
            this.lastMood = mood;
        }

        var currentNumber = mood;
        currentNumber = currentNumber + num;
        if(currentNumber < 1) currentNumber = 5;
        if(currentNumber > 5) currentNumber = 1;
        return currentNumber;
    }

    ngOnInit(){
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
    }

}



