'use strict';

const {
  Builder,
  By,
  Key,
  until,
} = require('selenium-webdriver');
const Service = require('egg').Service;
class SeleniumService extends Service {
  async init() {
    const browser = await new Builder().forBrowser('chrome').build();
    try {
      // 登录操作
      await browser.get('https://www.vmall.com/product/10086831441169.html');
      await this.ctx.sleep(1000);
      await browser.findElement(By.id('top-index-loginUrl')).click(); // login
      await this.ctx.sleep(200);
      await browser.switchTo().frame(browser.findElement(By.id('iframeLogin')));
      await this.ctx.sleep(1000);
      await browser.findElement(By.className('weixinLogin_bigIco')).click(); // 选择二维码
      await this.ctx.sleep(5000);
      this.ctx.logger.info('登录成功，抢货中...');

      // 定时刷新页面
      const submitContainer = await browser.findElement(By.id('pro-operation'));
      const submitButton = await submitContainer.findElement(By.className('product-button02'));
      this.ctx.logger.info('找到按钮，等待时间到达...');
      submitButton.click();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = SeleniumService;
