// pages/record/record.js
let md5 = require('../../js/md5.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nums: 1,   // tab 切换
    end: 0,
    flag: false, //判断是否登录
    awaitList: [],
    winList: [],
    allList: [],
    userid: '',
    pendingtip: '',  // 提示消息
    gottip: '',
    finishtip: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.titles()
    this.once()
  },

  // 温馨提示消息
  titles: function () {
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/gonggao.php?code=hsycommonsetting',
      method: 'GET',
      success: (res) => {
        // console.log(res)
        this.setData({
          pendingtip: res.data.pendingtip,
          gottip: res.data.gottip,
          finishtip: res.data.finishtip
        })
        // console.log(this.data.pendingtip,this.data.gottip,this.data.finishtip)
      }
    })
  },

  //  首次获取等待完成数据
  once: function () {
    var _this = this
    var names = wx.getStorageSync('username');
    var sign = md5.hexMD5('action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=0,101,102,103&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=0,101,102,103&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var trr = []
        trr = res.data.data
        _this.setData({
          awaitList: []
        })
        for (var i in trr) {
          if (trr[i].status == '0' || trr[i].status == '101' || trr[i].status == '102' || trr[i].status == '103') {
            _this.setData({
              awaitList: trr
            })
          } else {
            _this.setData({
              awaitList: []
            })
          }
        }

      }
    })
  },

  // 已经完成
  protwos: function () {
    var _this = this
    var names = wx.getStorageSync('username');
    var sign = md5.hexMD5('action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=104&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=104&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        _this.setData({
          winList: res.data.data
        })
      }
    })
  },

  // 全部记录
  selothree: function () {
    var _this = this
    var names = wx.getStorageSync('username');
    var sign = md5.hexMD5('action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=0,101,102,103,104,110,200&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&appkey=20f45751ab1cc7e0&method=brandorder&status=0,101,102,103,104,110,200&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        _this.setData({
          allList: res.data.data
        })
      }
    })

  },

  //tab切换
  select: function (e) {
    var _this = this
    var dataId = e.currentTarget.id;
    _this.setData({
      nums: dataId
    })
    if (dataId == 1) {
      this.once()
    }
    if (dataId == 2) {
      this.protwos()
    }
    if (dataId == 3) {
      this.selothree()
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  goYyorder() {
    if(this.data.flag){
      wx.navigateTo({ url: '../index/reserve/reserve' })
    }else{
      wx.showToast({
        title: '您还没有登录哦',
        duration: 1500
      })
    }
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否登录
    let txt = wx.getStorageSync('username');
    // console.log(txt)
    // if(txt){
      if(txt.userid){
        this.setData({
          flag: true,
          userid: txt.userid
        })
        this.once()
        this.protwos()
        this.selothree()
  
        this.titles()
      }else{
        this.setData({
          flag:false,
          awaitList: [],
          winList: [],
          allList: [],
        })
      }
    // }else{
    //   this.setData({
    //     flag:false
    //   })
    // }
  },

  goServer:function(){
    wx.navigateTo({ url: '../serv/serv', })
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