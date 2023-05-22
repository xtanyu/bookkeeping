// pages/history/history.ts
import { post, upload } from "../../utils/http"
import Dialog from '@vant/weapp/dialog/dialog'
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
    userHistoryInfoDetails: []
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
    this.init()
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

  init() {
    post('userHistoryInfo').then((res: any) => {
      this.setData({
        ...res
      })
    });
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
  cleanHistoryData() {

    Dialog.confirm({
      title: '温馨提示',
      message: '该操作会清空所有历史对局数据，但会保留正在进行中的对局数据，确定要清除吗？'
    }).then(() => {
      post('cleanHistoryData').then(() => {
        this.init()
      });
    }).catch(() => {

    });
  }
})