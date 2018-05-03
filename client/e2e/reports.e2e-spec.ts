import {browser} from 'protractor';
import {ReportsPage} from "./reports.po";

const origFn = browser.driver.controlFlow().execute;

describe('Tests reports page functionality: filtering of selected emotions and checking that they are there', () => {
    let page: ReportsPage;

    beforeEach(() => {
        page = new ReportsPage();
    })

    it("Should filter reports by mood",()  => {
       ReportsPage.navigateTo();
       page.filterReports('Angry');

       var exists = page.getEmoji("angry");
       expect(exists).toBe(true);
    });
})
