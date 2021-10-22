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
    ai: 0,
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
  confirm: function () {
    //test
    // console.log(this.data.selectedCard)
    // console.log(this.data.selectedHandCard)
    var game = this.data.game
    //判断选中的牌是否来自deck牌堆
    var temp = ''
    var player = 0
    if (this.data.turn == 1) {
      player = 1
    }
    if (this.data.selectedCard) {
      //弹出deck的最后一个元素
      temp = game.deck.pop()
    } else if (this.data.selectedHandCard) {
      console.log(game)
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
        // debugger
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
      flower: '',
      placeEmpty: false
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
            // debugger
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
          game: game,
          placeEmpty: true
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
        content = '好耶，平分秋色'
      }
      else {
        content = '好耶，玩家二获得了胜利'
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
            if (result.confirm) {
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
    if (this.data.turn == 0) {
      var ai = setInterval(this.ai, 2000);
      this.setData({
        ai: ai
      })
    }
  },


  //取消选中
  cancel: function () {
    this.setData({
      selectedCard: false,
      selectedHandCard: false,
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
      'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK',
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

  ai: function () {
    if (this.data.turn == 1) {
      console.log('ai思考中')
      wx.showToast({
        title: 'AI思考中',
        duration: 1000,
        icon: 'none',

      })
      console.log(this.data.game)
      var res = this.getOperation()
      console.log(this.data)
      console.log(res)
      if (res.type == 0) {
        this.setData({
          selectedCard: true
        })
      } else {
        this.setData({
          selectedHandCard: true,
          flower: res.card[0]
        })
      }
      setTimeout(this.confirm, 2000)
      clearInterval(this.data.ai)
    }
  },

  getOperation: function () {
    //初始化
    var res = {
      type: 0,
      card: ''
    }
    var data = this.data
    var p1Msg = new Array()//p1当前信息
    p1Msg['spade'] = data.game.player1.spade.length
    p1Msg['heart'] = data.game.player1.heart.length
    p1Msg['club'] = data.game.player1.club.length
    p1Msg['diamond'] = data.game.player1.diamond.length

    var p2Msg = new Array()//p2当前信息
    p2Msg['spade'] = data.game.player2.spade.length
    p2Msg['heart'] = data.game.player2.heart.length
    p2Msg['club'] = data.game.player2.club.length
    p2Msg['diamond'] = data.game.player2.diamond.length

    var placeMsg = new Array()//放置区当前信息
    placeMsg['spade'] = 0
    placeMsg['heart'] = 0
    placeMsg['club'] = 0
    placeMsg['diamond'] = 0
    for (var key in data.game.placement.nowCards) {
      if (key[0] == 'S') {
        placeMsg['spade']++
      }
      else if (key[0] == 'H') {
        placeMsg['heart']++
      }
      else if (key[0] == 'C') {
        placeMsg['club']++
      }
      else if (key[0] == 'D') {
        placeMsg['diamond']++
      }
    }
    var placeCount = placeMsg['spade'] + placeMsg['heart'] + placeMsg['club'] + placeMsg['diamond']

    var deckMsg = new Array()//牌库当前信息
    deckMsg['spade'] = 13 - placeMsg['spade'] - p1Msg['spade'] - p2Msg['spade']
    deckMsg['heart'] = 13 - placeMsg['heart'] - p1Msg['heart'] - p2Msg['heart']
    deckMsg['club'] = 13 - placeMsg['club'] - p1Msg['club'] - p2Msg['club']
    deckMsg['diamond'] = 13 - placeMsg['diamond'] - p1Msg['diamond'] - p2Msg['diamond']
    var deckCount = deckMsg['spade'] + deckMsg['heart'] + deckMsg['club'] + deckMsg['diamond']

    if (data.game.player2.totalCount == 0 ||
      data.game.player1.totalCount > deckCount + 25 ||
      data.game.player1.totalCount > 39) {
      res = {
        type: 0
      }
      return res
    }//p2无牌或必胜情况，翻牌
    if (data.placeEmpty == false) {
      var topFlower = data.game.placement.topCard[0]
      switch (topFlower) {
        case 'S':
          topFlower = 'spade'
          break;
        case 'H':
          topFlower = 'heart'
          break;
        case 'C':
          topFlower = 'club'
          break;
        case 'D':
          topFlower = 'diamond'
          break;
      }
      var probTop = deckMsg[topFlower] / deckCount //翻开判定区顶部花色的概率
    }

    if (data.game.player2.totalCount <= data.game.player1.totalCount) {//ai手牌少
      if (data.placeEmpty == false) {
        if (data.game.player2.totalCount + placeCount < data.game.player1.totalCount &&
          data.game.player2.totalCount + placeCount < 16
        ) {
          var tmp = ''
          console.log('403')
          switch (topFlower) {
            case 'spade': tmp = data.game.player2.spade[data.game.player2.spade.length - 1]
              break;
            case 'heart': tmp = data.game.player2.heart[data.game.player2.heart.length - 1]
              break;
            case 'club': tmp = data.game.player2.club[data.game.player2.club.length - 1]
              break;
            case 'diamond': tmp = data.game.player2.diamond[data.game.player2.diamond.length - 1]
              break;
          }
          res = {
            type: 1,
            card: tmp
          }
          return res
        }//吃牌
        else if (probTop < 0.25) {
          res = {
            type: 0
          }
          return res
        } else {
          var p2MaxFlowerCount = -1
          var p2MaxFlower
          for (var key in p2Msg) {
            if (key == topFlower) {
              continue
            }
            if (p2MaxFlowerCount >= p2Msg[key]) {
              p2MaxFlowerCount = p2Msg[key]
              p2MaxFlower = key
            }
          }
          if (p2MaxFlowerCount == -1) {
            res = {
              type: 0
            }
            return res
          }
          var tmp = ''
          console.log('448')
          switch (topFlower) {
            case 'spade': tmp = data.game.player2.spade[data.game.player2.spade.length - 1]
              break;
            case 'heart': tmp = data.game.player2.heart[data.game.player2.heart.length - 1]
              break;
            case 'club': tmp = data.game.player2.club[data.game.player2.club.length - 1]
              break;
            case 'diamond': tmp = data.game.player2.diamond[data.game.player2.diamond.length - 1]
              break;
          }
          res = {
            type: 1,
            card: tmp
          }
          return res
        }
      }
      else {
        var deckMaxFlower = ''//牌库中最多的且p2手里有的牌
        var deckMaxFlowerCount = -1
        for (key in deckMsg) {
          if (deckMaxFlowerCount <= deckMsg[key] && p2Msg[key] != 0) {
            deckMaxFlowerCount = deckMsg[key]
            deckMaxFlower = key
          }
        }
        var tmp = ''
        console.log('480')
        switch (deckMaxFlower) {
          case 'spade': tmp = data.game.player2.spade[data.game.player2.spade.length - 1]
            break;
          case 'heart': tmp = data.game.player2.heart[data.game.player2.heart.length - 1]
            break;
          case 'club': tmp = data.game.player2.club[data.game.player2.club.length - 1]
            break;
          case 'diamond': tmp = data.game.player2.diamond[data.game.player2.diamond.length - 1]
            break;
        }
        res = {
          type: 1,
          card: tmp
        }
        return res
      }
    }
    else {//ai手牌多
      var deckMaxFlower = ''//牌库中最多的且p2手里有的牌
      var deckMaxFlowerCount = -1
      for (key in deckMsg) {
        if (deckMaxFlowerCount <= deckMsg[key] && p2Msg[key] != 0) {
          deckMaxFlowerCount = deckMsg[key]
          deckMaxFlower = key
        }
      }
      var tmp = ''
      console.log(deckMaxFlower)
      console.log('512')
      // debugger
      switch (deckMaxFlower) {
        case 'spade': tmp = data.game.player2.spade[data.game.player2.spade.length - 1]
          break;
        case 'heart': tmp = data.game.player2.heart[data.game.player2.heart.length - 1]
          break;
        case 'club': tmp = data.game.player2.club[data.game.player2.club.length - 1]
          break;
        case 'diamond': tmp = data.game.player2.diamond[data.game.player2.diamond.length - 1]
          break;
      }
      res = {
        type: 1,
        card: tmp
      }
      // debugger
      return res
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ai = setInterval(this.ai, 2000);
    this.setData({
      ai: ai
    })
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