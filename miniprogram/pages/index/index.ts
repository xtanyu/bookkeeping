// pages/index/index.ts
import { post, upload } from "../../utils/http"
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    userName: '',
    usagesRoom: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(param: any) {
    if (param.roomId || param.scene) {
      var roomId = param.roomId ? param.roomId : param.scene;
      post("joinRoom", { roomId: roomId }).then((roomRes: any) => {
        wx.navigateTo({
          url: '/pages/room/room?roomId=' + roomRes.id
        })
      })
    }
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
    post("getUserInfo").then((res: any) => {
      post("getRoomInfo").then((roomInfo: any) => {
        this.setData({
          headUrl: res.userAvatar,
          userName: res.userName,
          usagesRoom: roomInfo
        })
      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '一个不错的打牌记账程序～',
      path: '/pages/index/index',
      imageUrl: '/images/share.png',
    }
  }

  , setHead(e: Object) {
    upload('setUserAvatar', e.detail.avatarUrl, 'userAvatar').then(() => {
      this.setData({
        headUrl: e.detail.avatarUrl
      })
    })
  },

  setName(e: Object) {
    post('setUserName', { userName: e.detail.value });
    this.setData({
      userName: e.detail.value
    })
  },

  putRoom() {
    if (this.data.userName) {
      var room: any = this.data.usagesRoom;
      if (room) {
        wx.navigateTo({
          url: '/pages/room/room?roomId=' + room.id
        })
      } else {
        post("buildRoom").then((res: any) => {
          wx.navigateTo({
            url: '/pages/room/room?roomId=' + res.id
          })
        });
      }
    } else {
      Toast('请填写用户名后再创建房间');
    }
  },

  toHistory() {
    //    Toast('作者正在努力开发中,敬请期待～');
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }
})