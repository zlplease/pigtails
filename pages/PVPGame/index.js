var app = getApp();

Page({

  data: {
    //游戏是否开始
    isBegin: 0,
    content: '托管',
    //0代表自己，1代表对手
    turn: -1,
    //是否有选中的牌
    selectedCard: false,
    //是否有选择的手牌
    selectedHandCard: false,
    //选择的花色
    flower: '',
    //游戏是否结束
    gameOver: false,
    //放置区是否为空
    placeEmpty: true,
    //对局号
    uuid: '',
    recordPlayer: -1,
    listen: 0,
    over: 0,
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
  },

  //确定出牌
  confirm: function (e) {
    var data = {}
    var game = this.data.game
    if (this.data.selectedCard) {
      data = {
        type: 0
      }
      if (this.data.game.deck.length == 1) {
        var lastCard = game.deck.pop()
        console.log('最后一张牌了')
        if (lastCard == this.data.placement.topCard) {
          var placementLen = this.data.game.placement.nowCards
          if (this.data.turn == 1) {
            game.player1.totalCount += placementLen
          }
          else {
            game.player2.totalCount += placementLen
          }
        }
        this.setData({
          game: game
        })
      }
    }
    if (this.data.selectedHandCard) {
      var flower = this.data.flower
      var temp = ''
      switch (flower) {
        case 'S': temp = game.player1.spade[game.player1.spade.length - 1]
          break;
        case 'H': temp = game.player1.heart[game.player1.heart.length - 1]
          break;
        case 'C': temp = game.player1.club[game.player1.club.length - 1]
          break;
        case 'D': temp = game.player1.diamond[game.player1.diamond.length - 1]
          break;
      }
      console.log(temp)
      data = {
        type: 1,
        card: temp
      }
    }
    console.log(data)
    var url = app.globalData.baseUrl + '/game/' + this.data.uuid
    console.log(url)
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: data,
      method: 'PUT',
      success: (res) => {
        console.log('出牌')
        console.log(res)
        this.setData({
          selectedCard: false,
          selectedHandCard: false,
        })
      },
    });
  },


  //取消选中
  cancel: function () {
    console.log('hello')
    this.setData({
      selectedCard: false,
      selectedHandCard: false,
      flower: ''
    })
  },

  over: function () {
    console.log('游戏还没结束')
    var game = this.data.game
    var deckLen = this.data.game.deck.length
    if (!deckLen) {
      console.log('游戏结束')
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
      clearInterval(this.data.over);
    }
  },

  listen: function () {
    var url = app.globalData.baseUrl + '/game/' + this.data.uuid + '/last'
    // console.log(url)
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 403) {
          wx.showToast({
            title: '人还没齐，快叫上你的小伙伴',
            icon: 'none',
            duration: 1500,
          });
        }
        else if (res.data.code == 200) {
          console.log(res.data.data.last_msg)
          var msg = res.data.data.last_msg
          var turn1 = res.data.data.your_turn
          if (msg == '对局刚开始') {
            var text = ''
            var turn = -1
            if (turn1) {
              text = '对局刚开始,我方先手'
              turn = 0
            }
            else {
              text = '对局刚开始,对方先手'
              turn = 1
            }
            wx.showToast({
              title: text,
              icon: 'none',
              duration: 1500,
            });
            this.setData({
              turn: turn,
              isBegin: 1
            })
          }
          else {
            var info = res.data.data.last_code
            var player = info[0]
            var type = info[2]
            var flower = info[4]
            var card = info.substring(4, 6)
            var game = this.data.game
            console.log(player)
            console.log(typeof (player))
            console.log(typeof (this.data.recordPlayer))
            console.log(this.data.recordPlayer)
            console.log((player == this.data.recordPlayer))
            if (player != this.data.recordPlayer) {
              if (type == 0) {
                game.deck.pop()
              }
              else {
                console.log(player)
                if (!turn1) {
                  switch (flower) {
                    case 'S': game.player1.spade.pop()
                      break;
                    case 'H': game.player1.heart.pop()
                      break;
                    case 'C': game.player1.club.pop()
                      break;
                    case 'D': game.player1.diamond.pop()
                      break;
                  }
                  game.player1.totalCount -= 1
                }
                else {
                  switch (flower) {
                    case 'S': game.player2.spade.pop()
                      break;
                    case 'H': game.player2.heart.pop()
                      break;
                    case 'C': game.player2.club.pop()
                      break;
                    case 'D': game.player2.diamond.pop()
                      break;
                  }
                  game.player2.totalCount -= 1
                }
              }
              console.log(game.placement)
              console.log(card)
              //判断是否要收牌,不要则放置右侧牌顶
              if (game.placement.topCard[0] != card[0]) {
                game.placement.nowCards.push(card)
                game.placement.topCard = card
              }
              else {
                console.log('收牌')
                game.placement.nowCards.push(card)
                var chargeCards = game.placement.nowCards
                var len = game.placement.nowCards.length
                chargeCards.sort()
                console.log(chargeCards)
                for (var i = 0; i < len; i++) {
                  var flower1 = chargeCards[i][0]
                  var card1 = chargeCards[i]
                  if (!turn1) {
                    switch (flower1) {
                      case 'S': game.player1.spade.push(card1)
                        break;
                      case 'H': game.player1.heart.push(card1)
                        break;
                      case 'C': game.player1.club.push(card1)
                        break;
                      case 'D': game.player1.diamond.push(card1)
                        break;
                    }
                    game.player1.totalCount += 1
                  }
                  else {
                    switch (flower1) {
                      case 'S': game.player2.spade.push(card1)
                        break;
                      case 'H': game.player2.heart.push(card1)
                        break;
                      case 'C': game.player2.club.push(card1)
                        break;
                      case 'D': game.player2.diamond.push(card1)
                        break;
                    }
                    game.player2.totalCount += 1
                  }

                }
                game.placement.nowCards = []
                game.placement.topCard = ''
              }
              this.setData({
                game: game,
                flower: '',
                turn: (this.data.turn + 1) % 2,
                isBegin: 1,
                recordPlayer: player
              })
            }
          }
          // console.log(this.data.game)
        }
        else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.data.error_msg,
            icon: 'none',
            duration: 1500,
          });
        }
      },
    });
  },

  //托管
  trusteeship: function () {
    var ai = 0
    if (this.data.content == '托管') {
      ai = setInterval(this.ai, 2000)
      this.setData({
        content: '托管中',
        ai: ai
      })
    }
    else {
      this.setData({
        content: '托管',
      })
      clearInterval(this.data.ai)
    }
  },

  ai: function () {
    console.log('AI已启动')
    if (this.data.turn == 0) {
      var data = this.getOperation()
      console.log(data)
      var url = app.globalData.baseUrl + '/game/' + this.data.uuid
      console.log(url)
      wx.request({
        url: url,
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token')
        },
        data: data,
        method: 'PUT',
        success: (res) => {
          console.log('出牌')
          console.log(res)
          this.setData({
            selectedCard: false,
            selectedHandCard: false,
          })
        },
      });
    }
  },

  getOperation: function () {
    //初始化
    var res = {
      type: 0
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

    if (data.game.player1.totalCount == 0 ||
      data.game.player2.totalCount > deckCount + 25 ||
      data.game.player2.totalCount > 39) {
      res = {
        type: 0
      }
      return res
    }//p1无牌或必胜情况，翻牌
    if (data.placeEmpty == false) {//放置区不空
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

    if (data.game.player1.totalCount <= data.game.player2.totalCount) {//p1手牌少
      if (data.placeEmpty == false) {
        if (data.game.player1.totalCount + placeCount < data.game.player2.totalCount &&
          data.game.player1.totalCount + placeCount < 16
        ) {//吃牌后牌数比对面少且小于16张，吃牌
          var tmp = ''
          console.log('403')
          if(p1Msg[topFlower]!=0) {
            switch (topFlower) {
              case 'spade':
                tmp = data.game.player1.spade[data.game.player1.spade.length - 1]
                break;
              case 'heart':
                tmp = data.game.player1.heart[data.game.player1.heart.length - 1]
                break;
              case 'club':
                tmp = data.game.player1.club[data.game.player1.club.length - 1]
                break;
              case 'diamond':
                tmp = data.game.player1.diamond[data.game.player1.diamond.length - 1]
                break;
            }
            if(!tmp || tmp==undefined){
              res = {
                type:0
              }
              return res
            }
            res = {
              type: 1,
              card: tmp
            }
            return res
          }
          else{
            res = {
              type: 0
            }
            return res
          }
        }//吃牌
        else if (probTop < 0.25) {//翻开放置区顶的牌概率小于0.25，翻牌
          res = {
            type: 0
          }
          return res
        } else {
          var p1MaxFlowerCount = -1
          var p1MaxFlower
          for (var key in p1Msg) {
            if (key == topFlower) {
              continue
            }
            if (p1MaxFlowerCount >= p1Msg[key]) {
              p1MaxFlowerCount = p1Msg[key]
              p1MaxFlower = key
            }
          }//找p1数量最多的花色且不为放置区顶的牌
          if (p1MaxFlowerCount == -1) {
            res = {
              type: 0
            }
            return res
          }
          var tmp = ''
          console.log('448')
          switch (p1MaxFlower) {
            case 'spade': tmp = data.game.player1.spade[data.game.player1.spade.length - 1]
              break;
            case 'heart': tmp = data.game.player1.heart[data.game.player1.heart.length - 1]
              break;
            case 'club': tmp = data.game.player1.club[data.game.player1.club.length - 1]
              break;
            case 'diamond': tmp = data.game.player1.diamond[data.game.player1.diamond.length - 1]
              break;
          }
          if(!tmp || tmp==undefined){
            res = {
              type:0
            }
            return res
          }
          res = {
            type: 1,
            card: tmp
          }
          return res
        }
      }
      else {
        var deckMaxFlower = ''//牌库中最多的且p1手里有的牌
        var deckMaxFlowerCount = -1
        for (key in deckMsg) {
          if (deckMaxFlowerCount <= deckMsg[key] && p1Msg[key] != 0) {
            deckMaxFlowerCount = deckMsg[key]
            deckMaxFlower = key
          }
        }
        var tmp = ''
        console.log('480')
        switch (deckMaxFlower) {
          case 'spade': tmp = data.game.player1.spade[data.game.player1.spade.length - 1]
            break;
          case 'heart': tmp = data.game.player1.heart[data.game.player1.heart.length - 1]
            break;
          case 'club': tmp = data.game.player1.club[data.game.player1.club.length - 1]
            break;
          case 'diamond': tmp = data.game.player1.diamond[data.game.player1.diamond.length - 1]
            break;
        }
        if(!tmp || tmp==undefined){
          res = {
            type:0
          }
          return res
        }
        res = {
          type: 1,
          card: tmp
        }
        return res
      }
    }
    else {//ai手牌多
      var deckMaxFlower = ''//牌库中最多的且p1手里有的牌
      var deckMaxFlowerCount = -1
      for (key in deckMsg) {
        if (deckMaxFlowerCount <= deckMsg[key] && p1Msg[key] != 0) {
          deckMaxFlowerCount = deckMsg[key]
          deckMaxFlower = key
        }
      }
      var tmp = ''
      console.log(deckMaxFlower)
      console.log('512')
      // debugger
      switch (deckMaxFlower) {
        case 'spade': tmp = data.game.player1.spade[data.game.player1.spade.length - 1]
          break;
        case 'heart': tmp = data.game.player1.heart[data.game.player1.heart.length - 1]
          break;
        case 'club': tmp = data.game.player1.club[data.game.player1.club.length - 1]
          break;
        case 'diamond': tmp = data.game.player1.diamond[data.game.player1.diamond.length - 1]
          break;
      }
      if(!tmp || tmp==undefined){
        res = {
          type:0
        }
        return res
      }
      res = {
        type: 1,
        card: tmp
      }
      // debugger
      return res
    }
  },


  copy: function () {
    wx.setClipboardData({
      data: this.data.uuid,
      success: (res) => {
        wx.getClipboardData({
          success: (res) => {
            wx.showToast({
              title: '复制成功'
            })
          }
        });
      },
      fail: () => { },
      complete: () => { }
    });
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
    console.log(options.uuid)
    this.setData({
      uuid: options.uuid
    })
    // this.setData({
    //   uuid: 'b8s5qkqvh6mgwoi4'
    // })
    var listen = setInterval(this.listen, 2000);
    var over = setInterval(this.over, 5000)
    this.setData({
      listen: listen,
      over: over
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initGame()
  },

  onunload: function () {
    clearInterval(this.data.listen);
  },
})