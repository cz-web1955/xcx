// pages/index/succeed/succeed.js
let md5 = require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sceeList: [],
    timeauto: '',
    shopList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopings()
    this.tiem()
    var arrsq = JSON.parse(options.list)
    var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    this.setData({
      sceeList: arrsq,
      timeauto: time2
    })
  },

  tiem: function () {
    var myDate = new Date();

    myDate.getYear();        // 获取当前年份(2位)
    myDate.getFullYear();    // 获取完整的年份(4位,1970-????)
    myDate.getMonth();       // 获取当前月份(0-11,0代表1月)
    myDate.getDate();        // 获取当前日(1-31)
    myDate.getDay();         // 获取当前星期X(0-6,0代表星期天)
    myDate.getTime();        // 获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours();       // 获取当前小时数(0-23)
    myDate.getMinutes();     // 获取当前分钟数(0-59)
    myDate.getSeconds();     // 获取当前秒数(0-59)
    myDate.getMilliseconds();    // 获取当前毫秒数(0-999)
    myDate.toLocaleDateString();     // 获取当前日期
    var mytime = myDate.toLocaleTimeString();     // 获取当前时间
    myDate.toLocaleString();        // 获取日期与时间


    Date.prototype.Format = function (fmt) { // author: meizz
      var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },

  //  广告数据
  shopings: function () {
    var sign = md5.hexMD5('action=mall&adid=42&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2&sign=' + sign + '&adid=42&app=hsy',
      method: 'GET',
      success: (res) => {
        this.setData({
          shopList: res.data.data.ad
        })
        // console.log(this.data.shopList)
      }
    });
  },

  goResever: function () {
    wx.navigateTo({ url: '../reserve/reserve' })
    // console.log('两次都已授权，可以跳转')
  },

  goRouter:function(e){
    var urlid = e.target.dataset.url;
		wx.navigateTo({
			url: '../../url/url?urlid=' + urlid
		})
  },

  goEvery:function(e){
    var url = e.target.dataset.url;//plugin://welfare/index?pid=1&appId=2018102561806641
    wx.navigateTo({
      url: ''+url+''
    });
  },

  showIndex: function () {
    wx.switchTab({
      url: '../index'
    })
    this.setData({
      sceeList: []
    })
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