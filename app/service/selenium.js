'use strict';

const {
  Builder,
  By,
} = require('selenium-webdriver');
const Service = require('egg').Service;
class SeleniumService extends Service {
  async init() {
    const browser = await new Builder().forBrowser('chrome').build();
    try {
      // 登录
      await browser.get('https://www.vmall.com/product/10086831441169.html');
      await this.ctx.sleep(1000);
      await browser.findElement(By.id('top-index-loginUrl')).click(); // login
      await this.ctx.sleep(200);
      await browser.switchTo().frame(browser.findElement(By.id('iframeLogin')));
      await this.ctx.sleep(1000);
      await browser.findElement(By.className('weixinLogin_bigIco')).click(); // 选择二维码
      await this.ctx.sleep(5000);

      // 验证是否登录成功
      const loginTimer = setInterval(async () => {
        try {
          const submitContainer = await browser.findElement(By.id('pro-operation'));
          await submitContainer.findElement(By.className('product-button02'));
          this.ctx.logger.info('登录成功，抢货中...');
          clearInterval(loginTimer);
          this.ctx.logger.info('等待抢单，未到达开始时间...');
        } catch (error) {
          this.ctx.logger.info('登录不成功，请重新登录...');
        }
      }, 1000);


      // 登录成功- 开始抢货
      const startTime = new Date('2019-11-22 10:08:00');
      const endTime = new Date('2019-11-22 10:11:00');
      const initUrl = await browser.getCurrentUrl();
      this.logger.info(`当前处于页面：${initUrl}`);
      const timer = setInterval(async () => {
        const isAdvanceStart = startTime - Date.now() <= 500;
        if (Date.now() >= startTime || isAdvanceStart) {
          try {
            const submitContainer = await browser.findElement(By.id('pro-operation'));
            const submitButton = await submitContainer.findElement(By.className('product-button02'));
            submitButton.click();
            this.ctx.logger.info('到达抢单时间，持续抢单中...');
          } catch (error) {
            const url = await browser.getCurrentUrl();
            if (url !== initUrl) this.logger.info('页面正在跳转中...');
            this.logger.info(`当前处于页面：${url}`);
          }
        }
        if (Date.now() > endTime) {
          clearInterval(timer);
          this.logger.info('抢单失败...');
        }
      }, 10);

      // 抢货成功- 开始生成订单
      const orderTimer = setInterval(async () => {
        if (Date.now() >= startTime) {
          try {
            const orderSubmitButton = await browser.findElement(By.id('checkoutSubmit'));
            this.logger.info('抢单成功，努力下订单中...');
            orderSubmitButton.click();
            this.logger.info('已发送下单请求...');
            clearInterval(timer);
          } catch (error) {
            this.logger.error('持续抢单中...');
          }
        }
        if (Date.now() > endTime) {
          clearInterval(orderTimer);
          this.logger.info('抢单失败...');
        }
      }, 10);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = SeleniumService;
