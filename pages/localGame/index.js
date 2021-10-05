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
      deck: [],
      placement: {
        nowCards: [],
        topCard: ''
      }
    },
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
    console.log(this.data.turn)
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
  },

  changeCard: function () {
    var game = this.data.game
    game.deck.sort(this.randomDeck)
    this.setData({
      game: game
    })
    wx.showToast({
      title: '已更新牌堆',
      icon: 'success',
      duration: 1500,
    
    });
  },

  //确定出牌
  confirm: function (e) {
    //test
    // console.log(this.data.selectedCard)
    // console.log(this.data.selectedHandCard)
    var game = this.data.game
    //判断选中的牌是否来自deck牌堆
    var temp = ''
    var player = e.currentTarget.dataset.player
    if (this.data.selectedCard) {
      //弹出deck的最后一个元素
      temp = game.deck.pop()
    } else if (this.data.selectedHandCard) {
      //判断选中的牌的具体来源
      var flower = this.data.flower
      //如果是1P
      if (player == 0) {
        // console.log(flower)
        switch (flower) {
          case 'S': temp = game.player1.spade.pop()
            break;
          case 'H': temp = game.player1.heart.pop()
            break;
          case 'C': temp = game.player1.club.pop()
            break;
          case 'D': temp = game.player1.diamond.pop()
            break;
        }
        game.player1.totalCount -= 1
      } else {
        //如果是2P
        switch (flower) {
          case 'S': temp = game.player2.spade.pop()
            break;
          case 'H': temp = game.player2.heart.pop()
            break;
          case 'C': temp = game.player2.club.pop()
            break;
          case 'D': temp = game.player2.diamond.pop()
            break;
        }
        game.player2.totalCount -= 1
      }
    }

    game.placement.nowCards.push(temp)
    game.placement.topCard = temp

    this.setData({
      game: game,
      turn: (this.data.turn + 1) % 2,
      selectedCard: false,
      selectedHandCard: false,
      flower: ''
    })

    //判断牌顶牌是否一样
    var len = this.data.game.placement.nowCards.length
    if (len >= 2) {
      if (game.placement.nowCards[len - 1][0] == game.placement.nowCards[len - 2][0]) {
        console.log('收牌')
        var chargeCards = game.placement.nowCards
        chargeCards.sort()
        console.log(chargeCards)
        for (var i = 0; i < len; i++) {
          var flower = chargeCards[i][0]
          var card = chargeCards[i]
          if (player == 0) {
            // console.log(flower)
            switch (flower) {
              case 'S': game.player1.spade.push(card)
                break;
              case 'H': game.player1.heart.push(card)
                break;
              case 'C': game.player1.club.push(card)
                break;
              case 'D': game.player1.diamond.push(card)
                break;
            }
            game.player1.totalCount += 1
          } else {
            //如果是2P
            switch (flower) {
              case 'S': game.player2.spade.push(card)
                break;
              case 'H': game.player2.heart.push(card)
                break;
              case 'C': game.player2.club.push(card)
                break;
              case 'D': game.player2.diamond.push(card)
                break;
            }
            game.player2.totalCount += 1
          }
        }
        game.placement.nowCards = []
        game.placement.topCard = ''
        this.setData({
          game: game
        })
      }
    }

    //判断是否结束
    var deckLen = this.data.game.deck.length
    if (!deckLen) {
      var count1 = game.player1.totalCount
      var count2 = game.player2.totalCount
      var content = ''
      if (count1 < count2) {
        content = '好耶，玩家一获得了胜利'
      }
      else if (count1 == count2) {
        content = '好耶，玩家二获得了胜利'
      }
      else {
        content = '好耶，平分秋色'
      }

      //弹出信息并跳转
      setTimeout(() => {
        wx.showModal({
          title: '比赛结果',
          content: content,
          showCancel: false,
          confirmText: '知道啦',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/home/index',
                });
              }, 500);
            }
          },
        });
      }, 1000);
    }

  },


  //取消选中
  cancel: function () {
    this.setData({
      selectedCard: !this.data.selectedCard,
      selectedHandCard: !this.data.selectedHandCard,
      flower: ''
    })
  },

  //根据随机数进行数组随意排序组合
  randomDeck: function (a, b) {
    return Math.random() > 0.5 ? -1 : 1
  },

  //初始化游戏
  initGame: function () {

    var temp = ['C1', 'C2'
      , 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK',
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'hJ', 'hQ', 'hK',
      'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK'
    ];

    //初始化数组，打乱牌堆，模拟洗牌
    temp.sort(this.randomDeck)
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
      deck: [],
      placement: {
        nowCards: [],
        topCard: ''
      }
    }

    game.deck = temp
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