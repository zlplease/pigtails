Page({

  data: {
    //0代表自己，1代表对手
    turn: 0,
    //是否有选中的牌
    selectedCard: false,
    //是否有选择的手牌
    selectedHandCard: false,
    //选择的花色
    flower: '',
    //游戏是否结束
    gameOver: true,
    //放置区是否为空
    placeEmpty: true,
    game: {
      player1: {
        spade: ['S1', 'S2', 'S1', 'S2'],
        heart: ['HK'],
        club: ['C5'],
        diamond: ['D4'],
        totalCount: 0
      },
      player2: {
        spade: ['S1', 'S2', 'S1'],
        heart: ['HQ'],
        club: ['C9', 'CJ'],
        diamond: ['D2'],
        totalCount: 0
      },
      deck: ['S1', 'S2', 'S1', 'S2'],
      placement: {
        nowCards: ['D2'],
        topCard: ''
      }
    }
  },

  selectcard: function () {
    this.setData({
      selectedCard: !this.data.selectedCard
    })
    if (this.data.selectedHandCard) {
      this.setData({
        selectedHandCard: !this.data.selectedHandCard,
        flower: ''
      })
    }
    //test
    // console.log(this.data.selectedCard)
    // console.log(this.data.selectedHandCard)
  },

  selectHandCards: function (e) {
    var flower = e.currentTarget.dataset.flower
    if (this.data.flower == '') {
      this.setData({
        flower: flower,
        selectedHandCard: !this.data.selectedHandCard
      })
    } else if (this.data.flower == flower) {
      this.setData({
        flower: '',
        selectedHandCard: !this.data.selectedHandCard
      })
    }
    else {
      this.setData({
        flower: flower,
      })
    }

    if (this.data.selectedCard) {
      this.setData({
        selectedCard: !this.data.selectedCard
      })
    }
    //test
    // console.log(this.data.selectedCard)
    // console.log(this.data.selectedHandCard)
  },

  //确定出牌
  confirm: function () {
    this.setData({
      turn: (this.data.turn + 1) % 2,
      selectedCard: false,
      selectedHandCard: false,
      flower: ''
    })
  },

  cancel: function () {
    this.setData({
      selectedCard: !this.data.selectedCard,
    })
  },

  //初始化游戏
  initGame: function() {
    //TODO 随机化卡组
    var game = {
      player1: {
        spade: [],
        heart: [],
        club: [],
        diamond: [],
        totalCount: 0
      },
      player2: {
        spade: [],
        heart: [],
        club: [],
        diamond: [],
        totalCount: 0
      },
      deck: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','CJ','CQ','CK',
            'D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','DJ','DQ','DK',
            'h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','hJ','hQ','hK',
            'S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','SJ','SQ','SK'],
      placement: {
        nowCards: [],
        topCard: ''
      }
    }

    this.setData({
      game: game
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
    this.initGame()
  },

  onShow: function () {

  },
})