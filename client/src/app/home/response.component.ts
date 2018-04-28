import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent implements OnInit{

    //Used for sanitizing URLS.
    public safeURL: SafeResourceUrl;
    public unsafeURL: string;

    constructor(
        public dialogRef: MatDialogRef<ResponseComponent>,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: { response: number }) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

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
                return "I'm sorry to hear that.";
            case 3:
                return "Ok, sounds good.";
            case 4:
                return "I'm glad that you're doing well!";
            case 5:
                return ">Wow! That's great!";
        }
    }

    ngOnInit()
    {
        this.getRandomVideoInPlaylist(this.data.response);
    }
}

