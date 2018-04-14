import {browser, by, element, promise} from 'protractor';

export class AppPage {
    static navigateTo() {
        return browser.get('/');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    homeButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('home'));
        return element(by.id('home')).isPresent();
    }

    clickHomeButton(): promise.Promise<void> {
        this.highlightElement(by.id('home'));
        return element(by.id('home')).click();
    }

    journalButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('journal'));
        return element(by.id('journal')).isPresent();
    }

    clickJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('journal'));
        return element(by.id('journal')).click();
    }

    resourceButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('rsrc'));
        return element(by.id('rsrc')).isPresent();
    }

    clickResourceButton(): promise.Promise<void> {
        this.highlightElement(by.id('rsrc'));
        return element(by.id('rsrc')).click();
    }

    reportButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('rep'));
        return element(by.id('rep')).isPresent();
    }

    clickReportButton(): promise.Promise<void> {
        this.highlightElement(by.id('rep'));
        return element(by.id('rep')).click();
    }

    goalButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('goals'));
        return element(by.id('goals')).isPresent();
    }

    clickGoalButton(): promise.Promise<void> {
        this.highlightElement(by.id('goals'));
        return element(by.id('goals')).click();
    }

    crisisButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('crisisButton'));
        return element(by.id('crisisButton')).isPresent();
    }

    clickCrisisButton(): promise.Promise<void> {
        this.highlightElement(by.id('crisisButton'));
        return element(by.id('crisisButton')).click();
    }

    aboutButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('about'));
        return element(by.id('about')).isPresent();
    }

    clickAboutButton(): promise.Promise<void> {
        this.highlightElement(by.id('about'));
        return element(by.id('about')).click();
    }

}
