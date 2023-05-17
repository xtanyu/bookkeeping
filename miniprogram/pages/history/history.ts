// pages/history/history.ts
import { post, upload } from "../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDisclaimer: false,
    showHistory: false,
    pointSum: 0,
    usagesCount: 0,
    userAvatar: "",
    userName: "未知用户",
    userHistoryInfoDetails:[]
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
    post('userHistoryInfo').then((res: any) => {
      this.setData({
        ...res
      })
    });
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


  toLast() {
    wx.navigateBack()
  },
  showDisclaimer() {
    this.setData({
      showDisclaimer: true
    })
  },
  closeDisclaimer() {
    this.setData({
      showDisclaimer: false
    })
  },
  copyEmail() {
    wx.setClipboardData({
      data: 'admin@xtyu.top'
    })
  },
  showHistory() {
    post('userHistoryInfoDetails').then((res: any) => {
      this.setData({
        showHistory: true,
        userHistoryInfoDetails: res
      })
    });

  },
  closeHistory() {
    this.setData({
      showHistory: false
    })
  },
  setHead(e: Object) {
    upload('setUserAvatar', e.detail.avatarUrl, 'userAvatar').then(() => {
      this.setData({
        userAvatar: e.detail.avatarUrl
      })
    })
  },

  setName(e: Object) {
    post('setUserName', { userName: e.detail.value });
    this.setData({
      userName: e.detail.value
    })
  },
})