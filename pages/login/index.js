var app = getApp()
Page({

  data: {
    stuId: '',
    password: '',
  },

  login: function() {
    var data = {
      'student_id': this.data.stuId,
      'password': this.data.password,
    }
    
    wx.request({
      url: 'http://172.17.173.97:8080/api/user/login',
      data: data,
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'POST',
      success: (res)=>{
        console.log(res)
        console.log(res.data.status)
        if (res.data.status == 200) {
          console.log(res.data.data.detail.name)
          app.globalData.name = res.data.data.detail.name
          //将token存入本地缓存
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          });
          wx.navigateTo({
            url: '/pages/home/index',
          });
        } else {
          wx.showToast({
            title: res.data.data.error_msg,
            icon: 'none'
          })
        }
      },
      fail: e => {
        wx.showToast({
          title: '网络出错啦',
          icon: 'none'
        })
      }
    });
  },
})