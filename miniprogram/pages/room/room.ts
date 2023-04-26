// pages/room/room.ts
import Toast from '@vant/weapp/toast/toast';

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
      { name: '小程序码', icon: '/images/code.png' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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
      title: '打牌记账',
      path: '/pages/index/index',
      imageUrl: '/images/share.png',
    }
  },

  getDetails() {
    this.setData({
      showDetails: true
    })
  },
  getSowKeyboard() {
    this.setData({
      showKeyboard: true
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
    this.setData({
      showKeyboard:false,
      money: ''
    })
    Toast('转账成功');
  },
  toIndex() {
    wx.navigateBack()
  },
  countDecimalPlaces(num: String) {
    const match = num.match(/\.(\d+)/);
    return match ? match[1].length : 0;
  },
  invite(){
    this.setData({
      showShare:true
    })
  },
  onCloseShare(){
    this.setData({
      showShare:false
    })
  },
  onSelect(event:Object) {
    Toast(event.detail.name);
    this.onCloseShare();
  },
  toHistory(){
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }
})