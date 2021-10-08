var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid: '',
    //0代表在线,1代表人机
    mode: 0,
    //0代表简单，2代表中等，3代表困难
    difficulty: 0,
    //ture为私人项目,false可供查询
    private: true
  },

  isPublic: function (e) {
    var type = e.currentTarget.dataset.type
    if (type == 0) {
      this.setData({
        private: true
      })
    } else {
      this.setData({
        private: false
      })
    }
  },

  getBack: function () {
    wx.reLaunch({
      url: '/pages/home/index',
      success: (result) => {
        console.log(result)
      },
    });
  },

  createRoom: function () {
    var url = app.globalData.baseUrl + '/game';
    wx.request({
      url: url,
      data: {
        private: this.data.private
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res)
        var uuid = res.data.data.uuid
        this.setData({
          uuid: uuid
        })
      },
      fail: (res) => {

      }
    });
  },

  startGame: function () {
    var uuid = this.data.uuid
    if (uuid == '') {
      wx.showToast({
        title: '请输入对局号uuid',
        icon: 'none',
        duration: 1500,
      });
    } else {
      var url = app.globalData.baseUrl + '/game/' + uuid;
      wx.request({
        url: url,
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          console.log(res)
          var code = res.data.code
          if (code == 200) {
            var mode = this.data.mode
            if (mode == 0) {
              wx.navigateTo({
                url: '/pages/PVPGame/index?uuid=' + uuid,
              });
            } else {
              wx.navigateTo({
                url: '/pages/PVEGame/index?uuid=' + uuid,
              });
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '对局ID错误，请仔细检查',
              showCancel: false,
              confirmText: '确定',
              confirmColor: 'rgb(255,106,71)',
              success: (result) => {
                if(result.confirm){
                }
              },
              fail: ()=>{},
              complete: ()=>{}
            });
          }
        },
        fail: (res) => {

        }
      });
    }
  },

  onLoad: function (options) {
    var mode = options.mode
    this.setData({
      mode: mode
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

})