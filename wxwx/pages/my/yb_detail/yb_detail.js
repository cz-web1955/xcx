// pages/my/yb_detail/yb_detail.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ybList:[],
    falg:true,
    falgs:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ybDetail()
  },

  // 猿宝明细
  ybDetail:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&method=yuanbao&username='+names.username+'&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&method=yuanbao&username='+names.username+'&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var arr=[]
        arr=res.data.data
        for(let i in arr){
          var a = arr[i].reason
          var reg = a.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}/ig,"")
          arr[i].reason = reg
        }
        this.setData({
          ybList:arr
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