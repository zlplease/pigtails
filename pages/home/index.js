Page({

  data: {
    userName: '小张',
    integral: 5000
  },
  chooseMode: function(e) {
    var path = e.currentTarget.dataset.path;
    console.log(typeof(path))
    console.log(path)
    wx.navigateTo({
      url: path,
    });
  }
})