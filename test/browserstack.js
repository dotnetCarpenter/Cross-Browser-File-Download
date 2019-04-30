var webdriver = require('selenium-webdriver');
require('dotenv').config()

// Input capabilities
var capabilities = {
 'browserName' : 'iPhone',
 'device' : 'iPhone 8 Plus',
 'realMobile' : 'true',
 'os_version' : '11',
 'browserstack.user' : process.env.BROWSERSTACK_USER,
 'browserstack.key' : process.env.BROWSERSTACK_KEY
}

var driver = new webdriver.Builder().
  usingServer('http://hub-cloud.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

driver.get('http://localhost:9000/');
// driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
// driver.findElement(webdriver.By.name('btnG')).click();

driver.getTitle().then(function(title) {
  console.log(title);
});

driver.quit();