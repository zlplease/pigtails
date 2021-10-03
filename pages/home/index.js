Page({

  data: {
    userName: '小张',
    integral: 5000
  },
  //选择模式并跳转路由
  chooseMode: function(e) {
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
    });
  }
})