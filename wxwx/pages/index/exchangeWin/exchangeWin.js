// pages/index/exchangeWin/exchangeWin.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scList:[],
    shoList:[],
  },

  goRouter:function(e){
    var urlid = e.target.dataset.url;
		wx.navigateTo({
			url: '../../url/url?urlid=' + urlid
		})
  },

  goEvery:function(e){
    var url = e.target.dataset.url;
    wx.navigateTo({
      url: ''+url+''
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shoping()
    this.shopings()
  },


  //  广告数据
  shopings:function(){
    var sign=md5.hexMD5('action=mall&adid=28&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2&sign='+sign+'&adid=28&app=hsy',
      method: 'GET',
      success: (res) => {
        this.setData({
          shoList:res.data.data.ad
        })
        // console.log(this.data.shoList)
      }
    });
  },

  // 商品数据
  shoping:function(){
    var sign=md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&method=productlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&method=productlist&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var arrd=[]
        arrd.push(res.data.data[0],res.data.data[1],res.data.data[2])
        // console.log(arrd)
        for(var i in arrd){
          arrd[i].price=(parseInt(arrd[i].price))
        }
        this.setData({
          scList:arrd
        })
      }
    });
  },

  showShop:function(){
    wx.reLaunch({
      url: '../exchange/exchange',
    })
  },

  goDetails:function(e){
    var itemId=e.currentTarget.dataset.id
    wx.navigateTo({ url: '../shopDetail/shopDetail?itemId='+itemId })
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