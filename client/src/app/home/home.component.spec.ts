import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {Emoji} from "../emoji";
import {Observable} from "rxjs/Observable";
import {FormsModule} from "@angular/forms";
import {HomeService} from "./home.service";
import {AuthService, SocialUser} from "angularx-social-login";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('Adding an emoji', () => {

    let component: HomeComponent;

    let fixture: ComponentFixture<HomeComponent>;

    const newEmoji: Emoji = {
        _id: '',
        owner: 'test dummy',
        mood: 3,
        intensity: 1,
        date: '', //date will be created during the test so that it matches what is made in component.addEmoji
        userId: '',
    };

    const newId = 'nick_id';

    let calledEmoji: Emoji;

    //let parseEmotionIntensity:

    let homeServiceStub: {
        addEmoji: (newEmoji: Emoji) => Observable<{'$oid': string}>
    };

    let authServiceStub: {
        authState: Observable<SocialUser>
    };

    let mockMatDialog: {
        open: (ResponseComponent, any) => {
            afterClosed: () => void
        };
    };

    beforeEach(() => {
        calledEmoji = null;
        // stub UserService for test purposes
        homeServiceStub = {
            addEmoji: (emojiToAdd: Emoji) => {
                calledEmoji = emojiToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };

        // set usedId to empty string for testing purposes
        localStorage.setItem('userId', '');

        authServiceStub = {
            authState: Observable.of(
                {
                    provider: '',
                    id: '',
                    email: '',
                    name: 'test dummy',
                    photoUrl: '',
                    firstName: 'test',
                    lastName: 'dummy',
                    authToken: '',
                    idToken: '',
                }
            )
        };

        /*mockMatDialog = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };*/

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, HttpClientTestingModule],
            declarations: [HomeComponent], // declare the test component
            providers: [
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: HomeService, useValue: homeServiceStub},
                {provide: AuthService, useValue: authServiceStub},]
        });

    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls HomeService.addEmoji', () => {
        expect(calledEmoji).toBeNull();

        component.emoji._id = newEmoji._id;
        component.emoji.owner = newEmoji.owner;
        component.emoji.mood = newEmoji.mood;
        component.emoji.intensity = newEmoji.intensity;
        const date = new Date();
        newEmoji.date = date.toString(); //set date for new emoji right before calling the method

        component.addEmoji(); //date for component.emoji is set within this method

        expect(calledEmoji).toEqual(newEmoji);
    });


    it('tests parsemoodintensity', () =>{
        expect(component.parseEmotionIntensity(1, 1)).toEqual("Frustrated");
        expect(component.parseEmotionIntensity(1, 2)).toEqual("Angry");
        expect(component.parseEmotionIntensity(2, 1)).toEqual("Anxious");
        expect(component.parseEmotionIntensity(2, 2)).toEqual("Worried");
        expect(component.parseEmotionIntensity(3, 1)).toEqual("Happy");
        expect(component.parseEmotionIntensity(3, 2)).toEqual("Content");
        expect(component.parseEmotionIntensity(3, 3)).toEqual("Ecstatic");
        expect(component.parseEmotionIntensity(4, 1)).toEqual("Meh");
        expect(component.parseEmotionIntensity(4, 2)).toEqual("Bleh");
        expect(component.parseEmotionIntensity(5, 1)).toEqual("Unhappy");
        expect(component.parseEmotionIntensity(5, 2)).toEqual("Sad");
        expect(component.parseEmotionIntensity(5, 3)).toEqual("Miserable");
    });

    it('tests updateEmojiIntensity', () => {

        //This tests the 'wrap' feature of the emoji carousel's intensity swipe. (Max 2 Intensities)
        expect(component.updateEmojiIntensity(1, 1, 1)).toEqual(2);
        expect(component.updateEmojiIntensity(1, 2, 1)).toEqual(1);
        expect(component.updateEmojiIntensity(-1, 1, 1)).toEqual(2);
        expect(component.updateEmojiIntensity(-1, 2, 1)).toEqual(1);

        //This also tests the 'wrap' feature of the emoji carousel's intensity swipe. (Max 3 Intensities)
        expect(component.updateEmojiIntensity(1, 1, 5)).toEqual(2);
        expect(component.updateEmojiIntensity(1, 2, 5)).toEqual(3);
        expect(component.updateEmojiIntensity(1, 3, 5)).toEqual(1);
        expect(component.updateEmojiIntensity(-1, 3, 5)).toEqual(2);
        expect(component.updateEmojiIntensity(-1, 1, 5)).toEqual(3);
        expect(component.updateEmojiIntensity(-1, 2, 5)).toEqual(1);
    });

    it('tests updateEmojiMood', () => {

        //This tests the 'wrap' feature of the emoji carousel's intensity swipe. (Max 2 Intensities)
        expect(component.updateEmojiMood(1, 1, true)).toEqual(2);
        expect(component.updateEmojiMood(1, 2, true)).toEqual(3);
        expect(component.updateEmojiMood(1, 3, true)).toEqual(4);
        expect(component.updateEmojiMood(1, 4, true)).toEqual(5);
        expect(component.updateEmojiMood(1, 5, true)).toEqual(1);

        expect(component.updateEmojiMood(-1, 5, true)).toEqual(4);
        expect(component.updateEmojiMood(-1, 4, true)).toEqual(3);
        expect(component.updateEmojiMood(-1, 3, true)).toEqual(2);
        expect(component.updateEmojiMood(-1, 2, true)).toEqual(1);
        expect(component.updateEmojiMood(-1, 1, true)).toEqual(5);
    });

});
