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
    }
    if (this.data.selectedHandCard) {
      var flower = this.data.flower
      var temp = ''
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
    console.log('游戏结束')
    var game = this.data.game
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
            console.log(this.data.recordPlayer)
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
      },
    });
  },

  //托管
  trusteeship: function () {

  },

  copy: function() {
    wx.setClipboardData({
      data: this.data.uuid,
      success: (res)=>{
        wx.getClipboardData({
          success: (res)=>{
            wx.showToast({
              title: '复制成功'
            })
          }
        });
      },
      fail: ()=>{},
      complete: ()=>{}
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
    var test = setInterval(this.listen, 2000);
    // var over = setInterval(this.over, 5000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initGame()
  },

  onunload: function () {

  },
})