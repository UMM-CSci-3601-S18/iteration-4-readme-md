import {JournalingPage} from './journaling.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(100);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};
fdescribe('Tests all functionality on the journaling page: from creating journals to editing them to viewing/deleting them', () => {
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
