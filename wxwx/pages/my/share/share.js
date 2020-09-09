// pages/my/share/share.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseShareButton: true,
    username:''
  },

  // 分享
  shares:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&method=share&username='+names.username+'&version=2QJ1OV4tfpl')  
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&method=share&username='+names.username+'&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res)
        wx.showModal({
          title: '温馨提示',
          content: res.data.message,
          success (res) {
            
          }
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let txt = wx.getStorageSync('username')
    this.setData({
      username:txt.username
    })
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
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
  onShareAppMessage: function (ops) {
    var that=this
      if (ops.from === 'button') {
        // 来自页面内转发按钮
      }
      if(this.data.username){
        that.shares()
        return {
          title: '回收猿',
          path: "pages/index/index?people="+that.data.username,
        }
      }else{
        return {
          title: '回收猿',
          path: "pages/index/index",
        }
      }
  }
})