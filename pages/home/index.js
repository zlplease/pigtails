var app = getApp();
Page({

  data: {
    userName: '',
    integral: 5000
  },
  //选择模式并跳转路由
  chooseMode: function(e) {
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
    });
  },
  onLoad: function() {
    console.log(app.globalData.name)
    this.setData({
      userName: app.globalData.name
    })
  }
})