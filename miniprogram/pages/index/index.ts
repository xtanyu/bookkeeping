// pages/index/index.ts
import { post, upload } from "../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    userName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    post("getUserInfo").then((res: any) => {
      this.setData({
        headUrl: res.userAvatar,
        userName: res.userName
      })
    });
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

  }

  , setHead(e: Object) {
    upload('setUserAvatar', e.detail.avatarUrl, 'userAvatar').then(() => {
      this.setData({
        headUrl: e.detail.avatarUrl
      })
    })
  },

  setName(e: Object) {
    post('setUserName', { userName: e.detail.value }).then(() => {
      this.setData({
        userName: e.detail.value
      })
    })
  },

  putRoom() {
    if(this.data.userName){
      wx.navigateTo({
        url: '/pages/room/room'
      })
    }else{
      wx.showToast({ title: '请填写用户名后再创建房间', icon: 'none' ,duration:3000})
    }
  },

  toHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }
})