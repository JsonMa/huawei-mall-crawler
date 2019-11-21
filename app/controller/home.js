'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    ctx.body = 'hi, egg';
  }

  async login() {
    const qrcodeUrl = await this.service.selenium.init();
    await this.ctx.render('login.nj', {
      qrcodeUrl,
    });
  }
}

module.exports = HomeController;
