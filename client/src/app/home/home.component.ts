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

    public emoji: Emoji = {_id: '', owner: '', date: '', mood: 5, userId: localStorage.getItem('userId')};
    public user: SocialUser;
    public name: string;

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
        this.emoji.date = date.toString();
        this.emoji.owner = this.user.name;
        this.emoji.userId = localStorage.getItem('userId');

        this.homeService.addEmoji(this.emoji).subscribe(
            addEmojiResult => {
                console.log('emoji '+ addEmojiResult + ' successfully added');
                this.openSnackBar('Emotion Saved', 'OK');
            },
            err => {
                // This should probably be turned into some sort of meaningful response.
                console.log('There was an error adding the emotion.');
                console.log('The error was ' + JSON.stringify(err));
                this.openSnackBar('There was an error communicating with the server. Your entry was not saved.', 'OK');
            });

            this.openDialog();
    }

    //This function is used to turn the number of the matslider into a word to be
    //displayed in the html.
    parseEmotion(num: number){
        switch(num)
        {
            case 1:
                return "sad";
            case 2:
                return "down";
            case 3:
                return "meh";
            case 4:
                return "happy";
            case 5:
                return "radiant";
        }

        //If for some reason it gets here..
        return null;
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



