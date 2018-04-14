import {AppPage} from './app.po';
import {browser} from 'protractor';

describe('angular-spark-lab', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should load', () => {
        AppPage.navigateTo();
    });

    it('should make sure that each nav-bar item exists and then clicks each ', () => {
        browser.driver.manage().window().maximize(); //makes E2E test window fullscreen :)
        AppPage.navigateTo();
        page.homeButtonExists();
        page.clickHomeButton();
        AppPage.navigateTo();
        page.journalButtonExists();
        page.clickJournalButton();
        AppPage.navigateTo();
        page.resourceButtonExists();
        page.clickResourceButton();
        AppPage.navigateTo();
        page.reportButtonExists();
        page.clickReportButton();
        AppPage.navigateTo();
        page.goalButtonExists();
        page.clickGoalButton();
        AppPage.navigateTo();
        page.crisisButtonExists();
        page.clickCrisisButton();
        AppPage.navigateTo();
        page.aboutButtonExists();
        page.clickAboutButton();
    });

});
