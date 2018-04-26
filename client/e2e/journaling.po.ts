import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class JournalingPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/journaling');
    }

    addNewJournal(subject: string, body: string) {
        const tabinput = element(by.id('md-tab-label-0-1'));
        tabinput.click();
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
        const input = element(by.id('editJournal'));
        input.click();
        const subjectInput = element(by.id('subjectField'));
        subjectInput.click();
        subjectInput.clear();
        subjectInput.sendKeys(subject);
        const bodyInput = element(by.id('bodyField'));
        bodyInput.click();
        bodyInput.clear();
        bodyInput.sendKeys(body);
        const button = element(by.css('#confirmAddJournalButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

    getJournalText(search: string) {
        const card = element(by.cssContainingText('.mat-expansion-panel-header-title', search));
        return card.getText();
    }

    selectJournal(search: string){
        const input = element(by.id('md-tab-label-0-0'));
        input.click();

        // //search for journal
        const subjectInput = element(by.id('journalSubject'));
        subjectInput.click();
       subjectInput.sendKeys(search);
        //
        // //click journal
        const journal = element(by.cssContainingText('.mat-expansion-panel-header-title',search));
         journal.click();

    }





}
