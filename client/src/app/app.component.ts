import {Component, Input, OnInit} from '@angular/core';
import {gapi} from 'gapi-client';
import {environment} from "../environments/environment";
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";
import {MatDialog} from '@angular/material';
import {CrisisButtonComponent} from "./resources/crisis-button.component";
import {LoginService} from "./login.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = "Sunshine Journal";
    public user: SocialUser;
    public loggedIn: boolean;

    public buttonText: string;

    constructor(private authService: AuthService, public dialog: MatDialog, private loginService: LoginService) { }

    signInWithGoogle(): void {
        if(this.loggedIn) {
            this.signOut();
            return;
        }
        console.log('1\n');
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
        // once the user signs in, authenticate it
            .then((user) => {
                console.log('2\n');
                return this.loginService.authenticate(user.idToken);
            })

            .then((authResponse) => {
                console.log('3\n');
                // check that our client id is within the response from google
                if (authResponse.aud != '557763158088-rb4bkc622e0lkc5tnksua58b187n3r33.apps.googleusercontent.com') {
                    console.log('Error: login response did not contain our app\'s client ID');
                    this.signOut();
                } else {
                    //refreshes after login so that the name of the user can be shown
                    window.location.reload();
                    console.log(authResponse.name + ' signed in.');
                }

            })

            .catch((err) => {

                // if an error occurs, print it out and clear the data from this.user
                console.log(err);
                this.signOut();
            });
    }

    signOut(): void {
        this.authService.signOut()

            .then((res) => {
                console.log('Signed out.');
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {

            this.user = user;

            this.loggedIn = (this.user != null);
            if(this.loggedIn) {
                this.buttonText = 'Sign Out';
            }
            else {
                this.buttonText = 'Sign In';
            }
        });
    }

    openDialog(): void{
        const dialogRef = this.dialog.open(CrisisButtonComponent,{
            width: '500px',
            height: '500px', //Makes crisis button popup be a decent size and able to be scrolled. DON'T SET TO auto OR inherit :)
            data: {
                user: this.user
            }
        });
    }

}
