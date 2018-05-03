import {Component, OnInit} from '@angular/core';
import {Emoji} from '../emoji';
import {HomeService} from "./home.service";
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService, SocialUser} from "angularx-social-login";
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

// Selector will change when we know more

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    //Used for sanitizing URLS.
    public safeURL: SafeResourceUrl;
    public unsafeURL: string;

    public emoji: Emoji = {_id: '', owner: '', date: '', mood: 3, intensity: 1, userId: localStorage.getItem('userId')};
    public user: SocialUser;
    public name: string;

    public lastMood = 3;
    public lastIntensity = 1;

    constructor(public homeService: HomeService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public authService: AuthService,
                private http: HttpClient,
                private sanitizer: DomSanitizer,){
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
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
            },
            () =>{
                this.getRandomVideoInPlaylist(this.emoji.mood);
            });

            //this.openDialog();

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
        //get a random video from the meh playlist by default
        this.getRandomVideoInPlaylist(3);
    }


    /*
    START YOUTUBE API EMBEDDING HERE
     */

    //This function sets the URL to display to be safe.
    updateSafeUrl(video_id: string){
        this.unsafeURL = 'https://www.youtube.com/embed/' + video_id;
        this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeURL);
    }

    //Function to get random video from a playlist.
    getRandomVideoInPlaylist(response: number)
    {

        //The ID of the YouTube video we will be getting.
        var id: string;

        //Change which playlist we are looking at based on response entered.
        switch(response)
        {
            case 1:
                id = 'PLJmTiSHMC37Dx6Ohz5al_e1GljuZqvZ_M';
                break;

            case 2:
                id = 'PLJmTiSHMC37BVBh18FtFKX-fEEroV6tQ9';
                break;

            case 3:
                id = 'PLJmTiSHMC37AO-nqegk5cEwS1ElAoQLNr';
                break;

            case 4:
                id = 'PLJmTiSHMC37D36KCVAns9LYvh1BV4m6YX';
                break;

            case 5:
                id = 'PLJmTiSHMC37CvQMRHaqg-6yEQpLWjAdWu';
                break;
        }

        //Make a query to the YouTube API to get the playlist information
        var results = this.http.get<any>('https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + id + '&maxResults=50&part=snippet%2CcontentDetails&key=AIzaSyC6ZtAit2Enk5aih6pqSeX-dMOeIhyC-fI');

        //Take the results and select a random video from within the playlist.
        results.subscribe(
            (data) =>
            {
                var max = data.pageInfo.totalResults;
                var rand = Math.floor(Math.random() * (max - 1));
                var random_video_id = data.items[rand].contentDetails.videoId;
                this.updateSafeUrl(random_video_id);
            },
            (error) =>
            {
                console.log("There was an error accessing the Google API. Perhaps daily queries exceeded?")
            },
            () =>
            {
                //Nothing
            }
        );
    }

    generateText(response: number)
    {
        switch(response)
        {
            case 1:
                return "I'm so sorry to hear that. Do you need help?";
            case 2:
                return "I'm so sorry to hear that. Do you need help?";
            case 3:
                return "Wow! That's great!";
            case 4:
                return "Ok, sounds good.";
            case 5:
                return "I'm sorry to hear that.";

        }
    }

    iframeMod(dim: string){

        var size = window.innerWidth;

        if(dim == 'width')
        {
            //If Computer
            if(size > 800){return 768}
            //If Mobile
            else{return 384}
        }
        else
        {
            //If Computer
            if(size > 800){return 432}
            //If Mobile
            else{return 216}
        }

    }

}



