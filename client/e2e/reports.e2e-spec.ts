import {JournalingPage} from './journaling.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';
import {ReportsPage} from "./reports.po";

const origFn = browser.driver.controlFlow().execute;

fdescribe('Reports Page', () => {
    let page: ReportsPage;

    beforeEach(() => {
        page = new ReportsPage();
    })

    it("Should filter reports by mood",()  => {
       ReportsPage.navigateTo();
       page.filterReports('Sad');

       var exists = page.getEmoji('sad');
       expect(exists).toBe(true);
    });
})
