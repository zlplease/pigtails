App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // if (wx.getStorageSync('token') != '') {
    //   wx.redirectTo({
    //     url: '/pages/home/index',
    //   });
    // }
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://172.17.173.97:9000/api',
    name: 'pig'
  }
})
