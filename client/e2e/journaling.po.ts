import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class JournalingPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/journaling');
    }

    addNewJournal(subject: string, body: string) {
        const input = element(by.id('addNewJournal'));
        input.click();
        const subjectInput = element(by.id('subjectField'));
        subjectInput.click();
        subjectInput.sendKeys(subject);
        const bodyInput = element(by.id('bodyField'));
        bodyInput.click();
        bodyInput.sendKeys(body);
        const button = element(by.css('#confirmAddJournalButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

    editJournal(subject: string, body: string) {
        const input = element(by.id('editButton'));
        input.click();
        const subjectInput = element(by.id('subjectField'));
        subjectInput.click();
        subjectInput.clear();
        subjectInput.sendKeys(subject);
        const bodyInput = element(by.id('bodyField'));
        bodyInput.click();
        subjectInput.clear();
        bodyInput.sendKeys(body);
        const button = element(by.css('#confirmAddJournalButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

/*
    getJournalText() {
        const card = element(by.id('journal.subject'));
        return card.getText();
    }*/

    /*getJournalText(subject: string) {
        const card = element(by.id(subject));
        return card.getText();
    }*/

    clickSelectJournalButton() {
        const elementToGet = element(by.id('selectJournal'))
        elementToGet.click();
    }

    getJournalText() {
        const card = element(by.cssContainingText('.mat-list-item-content', 'I love CSci'));
        card.getText();
    }

/*    selectJournal(search: string){
        const input = element(by.id('selectJournal'));
        input.click();
        /!*const subjectInput = element(by.id('searchjournals'));
        subjectInput.click();
        subjectInput.sendKeys(search);*!/
    }*/





}
