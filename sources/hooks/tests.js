function* hooks_tests() {
    var webdriver = require('selenium-webdriver');
    var By = webdriver.By;
    until = webdriver.until;

    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

    driver.get('http://localhost:8888/');
    driver.findElement(By.tagName('input')).sendKeys('webdriver');
    // driver.quit();

}