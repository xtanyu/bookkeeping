// pages/index/index.ts
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl:"https://bear-owo.oss-cn-shanghai.aliyuncs.com/head/head1.png",
    userName:"小熊"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    Notify({ type: 'primary', message: '通知内容' ,safeAreaInsetTop:true});
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
  
  ,
  setHead(e:Object){
    this.setData({
      headUrl:e.detail.avatarUrl
    })
  },
  setName(e:Object){
    this.setData({
      userName:e.detail.value
    })
  }
})