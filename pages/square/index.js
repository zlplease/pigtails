const app = getApp();

Page({

  data: {
    totalPage: 1,
    nowPage: 1,
    pigsPic: ['https://img.zcool.cn/community/01363d5c7543f9a801203d22280cd9.gif',
      'https://img.zcool.cn/community/01fba95c7543f9a801213f26c6f35f.gif',
      'https://img.zcool.cn/community/01dc065c7543f9a801213f26439adf.gif',
      'https://img.zcool.cn/community/0150c45c7543f9a801203d221e2492.gif'],
    games: []
  },

  turnPage: function (e) {
    var type = e.currentTarget.dataset.type
    if (type == -1 && this.data.nowPage == 1) {
      wx.showToast({
        title: '已经到第一页了',
        icon: 'none'
      });
    }
    else if (type == 1 && this.data.nowPage == this.data.totalPage) {
      wx.showToast({
        title: '已经是最后一页了',
        icon: 'none'
      });
    }
    else {
      //改变当前页码数
      this.setData({
        nowPage: this.data.nowPage + parseInt(type)
      })
      //请求接口进行渲染，按照目前页数进行选择性渲染
      var url = app.globalData.baseUrl + '/game/index';
      wx.request({
        url: url,
        data: {
          page_size: 4,
          page_num: this.data.nowPage
        },
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token')
        },
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          var games = res.data.data.games
          this.setData({
            games: games
          })
        }
      });
    }
  },

  //初始化界面，获取第一页数据
  onReady: function () {
    var url = app.globalData.baseUrl + '/game/index';
    wx.request({
      url: url,
      data: {
        page_size: 4,
        page_num: 1
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        var games = res.data.data.games
        this.setData({
          games: games,
          totalPage: res.data.data.total_page_num
        })
      }
    });
  },

  joinGame: function(e) {
    //获取能够加入的房间uuid以及当前索引
    var index = e.currentTarget.dataset.index
    var uuid = this.data.games[index].uuid
    console.log(uuid)
    //根据uuid进入房间进行游戏
  }
})