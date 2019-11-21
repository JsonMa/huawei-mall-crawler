module.exports = {

  /**
   * 等待函数
   *
   * @param {Number} status       - 错误状态码
   * @return {Promise} promise
   */
  sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
}
