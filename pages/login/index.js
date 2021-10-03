Page({

  data: {
    stuId: '031902330',
    password: '18559120521zlp'
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
          //将token存入本地缓存
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          });
          wx.navigateTo({
            url: '/pages/home/index',
          });
        }
      }
    });
  }
})