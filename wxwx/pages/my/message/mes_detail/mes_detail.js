// pages/my/message/mes_detail/mes_detail.js
let md5=require('../../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mesdetailList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mesDetail()
  },

  // 消息详情
  mesDetail:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&fromuser=hsy&method=messageinfo&username='+names.username+'&version=2QJ1OV4tfpl')  
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&fromuser=hsy&method=messageinfo&username='+names.username+'&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        this.setData({
          mesdetailList:res.data.data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})