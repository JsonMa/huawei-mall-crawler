const { Builder, By, Key, until } = require('selenium-webdriver')

class SeleniumService extends Service {
  async init() {
    const browser = await new Builder().forBrowser('chrome').build()
    try {
      await browser.get('https://www.vmall.com/product/10086831441169.html')
      // 倒计时，刷新页面
      await browser.navigate().refresh()
      // cart
      // order
      await sleep(3000)
      await browser.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
      await browser.wait(until.titleIs('webdriver - Google Search'), 1000)
    } finally {
      await browser.quit()
    }
  }
}

module.exports = SeleniumService
