// pages/my/collect/collect.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goShopa:function(){
    wx.navigateTo({ url: '../../index/exchange/exchange'})
  },


  collect:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&method=favoritelist&username='+names.username+'&version=2QJ1OV4tfpl')  
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&method=favoritelist&username='+names.username+'&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var pll=[]
        pll=res.data.data
        for(var i in pll){
          pll[i].price=parseInt(pll[i].price)
        }
        this.setData({
          collectList:pll
        })
      }
    });
  },

  // 删除收藏商品
  shopDel:function(e){
    var that=this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除这件商品吗？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
            var id=e.currentTarget.dataset.id
            var names=wx.getStorageSync('username');
            var sign=md5.hexMD5('action=favorite_del&appkey=20f45751ab1cc7e0&auth='+names.token+'&itemid='+id+'&mid=112&username='+names.username+'&version=2QJ1OV4tfpl')  
            wx.request({
              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/member.php?action=favorite_del&appkey=20f45751ab1cc7e0&auth='+names.token+'&itemid='+id+'&mid=112&username='+names.username+'&version=2&sign='+sign,
              method: 'GET',
              success: (res) => {
                console.log(res)
                that.collect()
              }
            });
        }
      }
    })
  },

  goShopg:function(e){
    // console.log(e.currentTarget.dataset.id)
    var ids=e.currentTarget.dataset.id
    wx.navigateTo({ url: '../../index/shopDetail/shopDetail?itemId='+ids})
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
    this.collect()
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