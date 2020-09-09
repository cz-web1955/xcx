// pages/auth/auth.js
const app = getApp()
let md5 = require('../../js/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviter:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'inviter',
      success (res) {
        if(res.data.inviter==undefined){
          console.log('没有介绍人')
          return false
        }else{
          that.setData({
            inviter:res.data.inviter
          })
        }
      }
    })
  },

  // 用户登录 
  bindGetUserInfo (e) {
    var _this=this
    // console.log(e.detail.userInfo)
    var encryptedData=encodeURIComponent(e.detail.encryptedData)
    var iv=encodeURIComponent(e.detail.iv)
    wx.login({
      success (res) {
        if (res.code) {
          var inviter=_this.data.inviter
          // console.log(encryptedData+'----------'+iv+'----------'+res.code)
          //发起网络请求
          var sign = md5.hexMD5('action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2QJ1OV4tfpl')
          wx.request({
            url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2&sign=' + sign,
            header:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: { encryptedData: encryptedData },
            success:(res)=>{
              console.log(res.data.isSucess)
              if(res.data.isSucess==true){
                wx.removeStorage({
                  key: 'inviter',
                  success (res) {
                    // console.log(res)
                  }
                })
                _this.setData({
                  // username:res.data.data.username,
                  inviter:""
                })
                wx.setStorage({
                  key: 'username',
                  data: {
                    username: res.data.data.username,
                    userid: res.data.data.userid,
                    token: res.data.data.jiufy_auth,
                    mobile: res.data.data.mobile,
                    yb_num: res.data.data.yuanbao,
                    nickNames: res.data.data.truename,
                  }
                })
                wx.showModal({
                  title: '温馨提示',
                  content: '登录成功',
                  success (res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    } else if (res.cancel) {
                      wx.navigateBack()
                    }
                  }
                })
              }else{
                wx.showModal({
                  title: '温馨提示',
                  content: '登录失败',
                  success (res) {

                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '登录失败！' + res.errMsg,
            success (res) {

            }
          })
          // console.log('登录失败！' + res.errMsg)
        }
      }
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