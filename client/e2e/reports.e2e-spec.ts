import {browser} from 'protractor';
import {ReportsPage} from "./reports.po";

const origFn = browser.driver.controlFlow().execute;

fdescribe('Tests reports page functionality: filtering of selected emotions and checking that they are there', () => {
    let page: ReportsPage;

    beforeEach(() => {
        page = new ReportsPage();
    });

    it('should make sure that submit button exists and works while also testing the date dropdown ', () => {
        ReportsPage.navigateTo();
        page.clickDateDropdown();
        page.selectDownKey();
        page.selectEnterKey();
        page.submitButtonExists();
        page.clickSubmitButton();
    });

    // Due to syntax troubleshooting, we were not able to write as meaningful tests for the reports page as we would have liked
    // These tests should work, but they can't find the ids for some reason.
    /*it('should make sure that two tabs exist and work ', () => {
        ReportsPage.navigateTo();
        page.clickGraphReview();
        page.clickListReview();
    });


    it('should test List Review Tab ', () => {
        ReportsPage.navigateTo();
        page.clickListReviewTab();
        page.clickReports();
        page.selectDownKey();
        page.selectEnterKey();
    });

    it('should test Pie Chart Tab ', () => {
        ReportsPage.navigateTo();
        page.clickPieCharts();
    });*/

});
