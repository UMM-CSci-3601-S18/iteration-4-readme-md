import {browser, by, element} from 'protractor';
import {Key} from "selenium-webdriver";

export class AppPage {
    static navigateTo() {
        return browser.get('/');
    }

}
