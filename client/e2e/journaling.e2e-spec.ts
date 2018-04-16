import {JournalingPage} from './journaling.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

describe('Tests all functionality on the journaling page: from creating journals to editing them to viewing/deleting them', () => {
    let page: JournalingPage;

    beforeEach(() => {
        page = new JournalingPage();
    });

    it('Should be able to add a journal entry', ()=> {
        JournalingPage.navigateTo();
        var buttonExisted = page.addNewJournal('I love CSci', 'I do, in fact, really love CSci.');
        expect(buttonExisted).toBe(true);
    });

    it('Should be able view a journal entry', () => {
        JournalingPage.navigateTo();
        page.selectJournal("Brittany");
        expect(page.getJournalText('Brittany')).toContain('Brittany');
    });

    it('Should be able to edit a journal entry', ()=> {
        JournalingPage.navigateTo();
        page.selectJournal("Brittany");
        var buttonExisted = page.editJournal('Wow', 'Big wow');
        expect(buttonExisted).toBe(true);
    });
});
