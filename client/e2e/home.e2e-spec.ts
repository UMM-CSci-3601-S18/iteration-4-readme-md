import {HomePage} from './home.po';
import {browser, element, by} from 'protractor';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    // origFn.call(browser.driver.controlFlow(), function () {
    //     return protractor.promise.delayed(100);
    // });
    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });

    //Adds 'Happy'
    it('should add an entry', () => {
        HomePage.navigateTo();

        //Click the submit button
        page.clickSubmitButton();
    });

    // Adds 'Frustrated'
    it('should add an entry by clicking left twice then submitting', () => {
        HomePage.navigateTo();

        //Click Twice on the 'Left' button.
        page.clickNavLeftEmojiButton();
        page.clickNavLeftEmojiButton();

        //Get the src value of the currently selected emoji, should be 'frustrated'
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/1/1.png');

        //Click submit
        page.clickSubmitButton();

    });

    //Adds 'Angry'
    it('should add an entry by clicking right three times, then up once', () => {
        HomePage.navigateTo();

        //Click Right three times.
        page.clickNavRightEmojiButton();
        page.clickNavRightEmojiButton();
        page.clickNavRightEmojiButton();

        //Click Up once.
        page.clickNavUpEmojiButton();

        //Get the src value of the currently selected emoji, should be 'Angry'
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/1/2.png');

        //Click submit
        page.clickSubmitButton();
    });

    //Adds 'Content'
    it('should add an entry by clicking down once', () => {
        HomePage.navigateTo();

        //Click down once
        page.clickNavDownEmojiButton();

        //Get the src value of the currently selected emoji, should be 'Content'.
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/3/2.png');

        //Click submit
        page.clickSubmitButton();
    });

    it('should display two emojis next to the main one that are correct', () => {
        HomePage.navigateTo();

        //Get the src value of the currently selected emoji, should be 'Happy'.
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/3/1.png');

        //Get the src value of the emoji to the right, should be 'Meh'.
        expect(element(by.id('rightEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/4/1.png');

        //Get the src value of the emoji to the left, should be 'Anxious'.
        expect(element(by.id('leftEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/2/1.png');

    });


    it('should click right then display two emojis next to the main one correctly', () => {
        HomePage.navigateTo();

        //Click right
        page.clickNavRightEmojiButton()

        //Get the src value of the currently selected emoji, should be 'Meh'.
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/4/1.png');

        //Get the src value of the emoji to the right, should be 'Unhappy'.
        expect(element(by.id('rightEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/5/1.png');

        //Get the src value of the emoji to the left, should be 'Happy'.
        expect(element(by.id('leftEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/3/1.png');

    });

    it('should click right 10 times', () => {
        HomePage.navigateTo();

        //Click right 10 times.
        for(var i = 0; i < 10; i++)
        {
            page.clickNavRightEmojiButton();
        }

        //Get the src value of the currently selected emoji, should be 'Content', having looped all the way around
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/3/1.png');

    });

    it('should click up 10 times', () => {
        HomePage.navigateTo();

        //Click up 10 times.
        for(var i = 0; i < 10; i++)
        {
            page.clickNavUpEmojiButton();
        }

        //Get the src value of the currently selected emoji, should be 'Ecstatic', having looped all the way around
        expect(element(by.id('currentEmoji')).getAttribute('src')).toEqual('http://localhost:49152/assets/Emojis/3/3.png');
    });

    it('should contain the crisis button', () => {
        HomePage.navigateTo();
        expect(element(by.id('crisis-button'))).toBeDefined();
    });

    it('should add an entry and check that a video shows up', () => {
        HomePage.navigateTo();
        page.clickSubmitButton();
        expect(element(by.id('responseVideo'))).toBeDefined();
        expect(element(by.id('responseVideo')).getAttribute('src')).not.toEqual('');
    });

});
