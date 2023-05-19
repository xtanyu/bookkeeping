// pages/room/room.ts
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import { post, roomWebsocket, apiKey } from "../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyboard: false,
    showDetails: false,
    money: '',
    showShare: false,
    options: [
      { name: '微信', icon: '/images/wx.png', openType: 'share' },
      { name: '房间二维码', icon: '/images/code.png' },
    ],
    showCode: false,
    roomCode: '',
    roomId: undefined,
    roomNo: '未知',
    myPointInfoVo: {
      userPoint: 0,
      userAvatar: "",
      userName: "未知用户"
    },
    otherPointInfoVoArr: [],
    payeeUserId: undefined,
    payeeUserName: undefined,
    tansferDetails: [],
    ws: undefined,
    codeClose: false,
    showGuide: false,
    websocketRetryCount: 0
  },
  init() {
    if (this.data.roomId) {
      post('roomCommonInfo', { roomId: this.data.roomId }).then((res: any) => {
        this.setData({
          ...res
        })
      })
    } else {
      Toast('未知异常,请重新启动小程序再试');
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(param: any) {

    this.setData({
      roomId: param.roomId
    })

    post('getRoomCode', { roomId: param.roomId }).then((codeUrl: string) => {
      this.setData({
        roomCode: codeUrl,
        showGuide: !(wx.getStorageSync("addNoPrompt") == true)
      })
    })
    this.init();

    //监听消息
    let that = this;
    wx.onSocketMessage(function (res) {
      console.log('收到服务器消息：' + res.data);
      that.init();
    });
    wx.onSocketError(function (res) {
      console.log('webSocket连接错误：' + res.errMsg);
      if (that.data.websocketRetryCount <= 5) {
        console.log('尝试重新连接第' + that.data.websocketRetryCount + '次');
        that.openSocketConnect();
        that.data.websocketRetryCount = that.data.websocketRetryCount + 1;
      } else {
        console.log('超过尝试重新连接次数');
      }
    });
    wx.onSocketClose(function (res) {
      console.log(res);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  openSocketConnect() {
    wx.connectSocket({
      url: roomWebsocket + this.data.roomId + "?apiKey=" + apiKey,
      success(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.data.websocketRetryCount = 0;
    this.openSocketConnect();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    wx.closeSocket({
      success: function () {
        console.log('webSocket连接关闭成功');
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.closeSocket({
      success: function () {
        console.log('webSocket连接关闭成功');
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '邀请您进入记账房间(' + this.data.roomNo + ')',
      path: '/pages/index/index?roomId=' + this.data.roomId,
      imageUrl: 'https://kodo.xtyu.top/bookkeeping/static/share.png',
    }
  },

  getDetails() {
    post('roomTransferDetails', { roomId: this.data.roomId }).then((res) => {
      this.setData({
        showDetails: true,
        tansferDetails: res
      })
    });

  },
  getSowKeyboard(e: any) {
    this.setData({
      showKeyboard: true,
      payeeUserId: e.target.dataset.uid,
      payeeUserName: e.target.dataset.name,
      money: ''
    })
  },
  closeDetails() {
    this.setData({
      showDetails: false
    })
  },
  closeSowKeyboard() {
    this.setData({
      showKeyboard: false
    })
  },
  keyboardClick(event: Object) {
    wx.vibrateShort()
    const key = event.currentTarget.dataset.key;
    let money = this.data.money;
    if (key == '.') {
      if (money) {
        if (money.indexOf('.') == -1) {
          money = money + '.';
          this.setData({
            money: money
          })
        }
      }
      return;
    }
    if (key == 'delete') {
      if (money) {
        money = money.slice(0, -1);
        this.setData({
          money: money
        })
      }
      return;
    }
    if (this.countDecimalPlaces(money) + 1 > 2) {
      Toast('最多仅支持两位小数');
      return;
    }
    if (parseInt(money, 10) > 100000) {
      Toast('超出最大限额');
      return;
    }
    money = money + key;
    this.setData({
      money: money
    })
  },
  submitMoney() {
    post('roomTransfer', {
      payeeUserId: this.data.payeeUserId,
      roomId: this.data.roomId,
      amount: this.data.money
    }).then(() => {
      this.setData({
        showKeyboard: false,
        money: ''
      })
      this.init();
      Toast('转账成功');
      wx.sendSocketMessage({
        data: '转账给用户' + this.data.payeeUserId
      })
    })
  },
  toIndex() {
    Dialog.confirm({
      title: '温馨提示',
      message: '确定结束本次对局吗?'
    }).then(() => {
      post('exitRoom', { roomId: this.data.roomId }).then(() => {
        wx.navigateBack();
      });
    }).catch(() => {

    });
  },
  countDecimalPlaces(num: String) {
    const match = num.match(/\.(\d+)/);
    return match ? match[1].length : 0;
  },
  invite() {
    this.setData({
      showShare: true
    })
  },
  onCloseShare() {
    this.setData({
      showShare: false
    })
  },
  codeClose() {
    this.setData({
      showCode: false
    })
  },
  onSelect(event: Object) {
    if (event.detail.index === 1) {
      this.setData({
        showCode: true
      })
    }
    this.onCloseShare();
  },
  toHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },
  codeCloseMethod() {
    this.setData({
      codeClose: true
    })
  },
  codeOpenMethod() {
    this.setData({
      codeClose: false
    })
  },
  noPrompt() {
    wx.setStorageSync("addNoPrompt", true);
  }
})