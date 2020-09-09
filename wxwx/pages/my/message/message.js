// pages/my/message/message.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[],
    text:'消息中心',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.message()
    wx.setNavigationBarTitle({
      title: this.data.text
    });
  },

  // 消息中心列表
  message:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&method=messagelist&username='+names.username+'&version=2QJ1OV4tfpl')  
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&method=messagelist&username='+names.username+'&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var arr=[]
        arr=res.data.data
        for(let i in arr){
          var a = arr[i].addtime
          var reg = a.replace(/[0-9]{4}-/ig,"")
          var time = reg.split(':');
          // console.log(time)
          arr[i].addtime = time[0] + ':' + time[1]
        }
        this.setData({
          messageList:arr
        })
        
        if(this.data.messageList[0].notreadcounts == 0){
           wx.setNavigationBarTitle({
           title: this.data.text
        });
        }else{
          wx.setNavigationBarTitle({
           title: this.data.text + '('+this.data.messageList[0].notreadcounts+')'
        });
        }
        // console.log(this.data.messageList    [0-9]{2}-[0-9]{2})
      }
    });
  },

  goNext:function(){
    wx.setNavigationBarTitle({
      title: this.data.text,
    });
    wx.navigateTo({url: 'mes_detail/mes_detail'})
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
    this.message()
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