import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ResourcesPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/resources');
    }

    static clickElement(elementId: string){
        const input = element(by.id(elementId));
        input.click();
    };



    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
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


}
