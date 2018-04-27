import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent{

    //Used for sanitizing URLS.
    public safeURL;
    public unsafeURL;


    constructor(
        public dialogRef: MatDialogRef<ResponseComponent>,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: { response: number }) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    randomVideo(response: number){
        switch(response)
        {
            //Angry
            case 1:
                //Get total number of videos from playlist
                var numVideos = this.getPlaylistSize('PLJmTiSHMC37Dx6Ohz5al_e1GljuZqvZ_M');

                //Generate a random integer between 0 and total number of videos from playlist
                var rand = Math.floor(Math.random() * numVideos);

                //Return embed playlist offset to a random video in the playlist.
                this.unsafeURL = 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37Dx6Ohz5al_e1GljuZqvZ_M&index=' + rand.toString();
                this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.unsafeURL);

            //Anxious
            case 2:
                var numVideos = this.getPlaylistSize('PLJmTiSHMC37BVBh18FtFKX-fEEroV6tQ9');
                var rand = Math.floor(Math.random() * numVideos);
                this.unsafeURL = 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37BVBh18FtFKX-fEEroV6tQ9&index=' + rand.toString();
                this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.unsafeURL);

            //Happy
            case 3:
                var numVideos = this.getPlaylistSize('PLJmTiSHMC37AO-nqegk5cEwS1ElAoQLNr');
                var rand = Math.floor(Math.random() * numVideos);
                this.unsafeURL = 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37AO-nqegk5cEwS1ElAoQLNr&index=' + rand.toString();
                this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.unsafeURL);

            //Meh
            case 4:
                var numVideos = this.getPlaylistSize('PLJmTiSHMC37D36KCVAns9LYvh1BV4m6YX');
                var rand = Math.floor(Math.random() * numVideos);
                this.unsafeURL = 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37D36KCVAns9LYvh1BV4m6YX&index=' + rand.toString();
                this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.unsafeURL);

            //Sad
            case 5:
                var numVideos = this.getPlaylistSize('PLJmTiSHMC37CvQMRHaqg-6yEQpLWjAdWu');
                var rand = Math.floor(Math.random() * numVideos);

                this.unsafeURL = 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37CvQMRHaqg-6yEQpLWjAdWu&index=' + rand.toString();
                this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.unsafeURL);
        }
    }

    //Function used for 'true' random videos in a playlist, where playlistId is the id of the youtube playlist.
    getPlaylistSize(id: string){

        //Variable to store maxsize, since including it in the subscribe causes the return type to be void.
        var size;

        //Make a query to the YouTube API to get the playlist information
        var results = this.http.get<any>('https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + id + '&maxResults=50&part=snippet%2CcontentDetails&key=AIzaSyC6ZtAit2Enk5aih6pqSeX-dMOeIhyC-fI');

        //Take the results and get the totalResults for the playlist (the size).
        results.subscribe(data =>{
            size = data.pageInfo.totalResults;
        })

        return size;
    }

    generateText(response: number){
        switch(response)
        {
            case 1:
                return "I'm so sorry to hear that. Do you need help?";

            case 2:
                return "I'm sorry to hear that.";

            case 3:
                return "Ok, sounds good."

            case 4:
                return "I'm glad that you're doing well!"

            case 5:
                return ">Wow! That's great!";
        }
    }
}

