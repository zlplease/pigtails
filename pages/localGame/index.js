Page({

  data: {
    //0代表自己，1代表对手
    turn: 0,
    //是否有选中的牌
    selectedCard: false,
    gameOver: false,
    placeEmpty: true,
    game: {
      player1: {
        spade: ['S1','S2','S1','S2'],
        heart: ['HK'],
        club: ['C5'],
        diamond: ['D4'],
        totalCount: 0
      },
      player2: {
        spade: ['S1','S2','S1','S2'],
        heart: ['HQ'],
        club: ['C9','CJ'],
        diamond: ['D2'],
        totalCount: 0
      },
      deck: ['S1','S2','S1','S2'],
      placement: {
        nowCards: ['S1','S2','S1','S2'],
        topCard: ''
      }
    }
  },

  selectcard: function() {
    this.setData({
      selectedCard: !this.data.selectedCard
    })
  },

  //确定出牌
  confirm: function() {
    this.setData({
      turn: (this.data.turn+1)%2,
      selectedCard: !this.data.selectedCard
    })
  },

  cancel:function() {
    this.setData({
      selectedCard: !this.data.selectedCard
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})