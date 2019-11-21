'use strict'

const { Builder, By, Key, until } = require('selenium-webdriver')
const Service = require('egg').Service
class SeleniumService extends Service {
  async init() {
    const browser = await new Builder().forBrowser('chrome').build()
    try {
      // 登录
      await browser.get('https://www.vmall.com/product/10086831441169.html')
      await this.ctx.sleep(1000)
      await browser.findElement(By.id('top-index-loginUrl')).click() // login
      await this.ctx.sleep(200)
      await browser.switchTo().frame(browser.findElement(By.id('iframeLogin')))
      await this.ctx.sleep(1000)
      await browser.findElement(By.className('weixinLogin_bigIco')).click() // 选择二维码
      await this.ctx.sleep(5000)
      this.ctx.logger.info('登录成功，抢货中...')
      // 开始抢货
      const startTime = new Date('2019-11-22 10:08:00')
      const endTime = new Date('2019-11-22 10:11:00')
      const timer = setInterval(()=> {
        if (Date.now() >= startTime) {
          try {
            const submitContainer = await browser.findElement(By.id('pro-operation'))
            const submitButton = await submitContainer.findElement(By.className('product-button02'))
            submitButton.click()
          } catch (error) {
            this.logger.error('抢单发生错误...', error)
          }
        }
        if(Date.now() > endTime) {
          clearInterval(timer)
          this.logger.info('抢单失败...')
        }
      }, 10)

      const orderTimer = setInterval(() => {
        if (Date.now() >= startTime) {
          try {
            const orderSubmitButton = await browser.findElement(By.id('checkoutSubmit'))
            this.logger.info('抢单成功，努力下订单中...')
            orderSubmitButton.click()
            this.logger.info('已发送下单请求...')
            clearInterval(timer)
          } catch (error) {
            this.logger.error('持续抢单中...')
          }
        }
        if(Date.now() > endTime) {
          clearInterval(orderTimer)
          this.logger.info('抢单失败...')
        }
      }, 10)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = SeleniumService
