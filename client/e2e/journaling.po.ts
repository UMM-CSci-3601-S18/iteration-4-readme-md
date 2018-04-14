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

    static getPageTitle(): promise.Promise<string> {
        const title = element(by.css('#journal-list-title'));
        return title.getText();
    }

    getJournalText() {
        const card = element(by.css('.matCardJournals'));
        return card.getText();
    }

    selectJournal(search: string){
        const input = element(by.id('selectJournal'));
        input.click();
        const subjectInput = element(by.id('searchjournals'));
        subjectInput.click();
        subjectInput.sendKeys(search);
    }





}
