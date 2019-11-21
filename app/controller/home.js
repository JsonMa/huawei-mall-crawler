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
    await this.service.selenium.init()
    await ctx.render('login.html');
  }
}

module.exports = HomeController;
