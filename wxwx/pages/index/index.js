//index.js
//获取应用实例
const app = getApp()
let md5 = require('../../js/md5.js')
Page({
  data: {
    unhide: 0,
    issueList: [],  // 常见问题
    hallList: [], // 环保展厅
    username: '',
    shopList: [], // 广告数据
    inviter:""
  },
  onLoad: function (options) {
    var that=this
    this.problem()
    this.shopings()
    this.goDown()
    console.log(options.people)
    if(options.people==undefined){
      console.log('没有介绍人')
      return false
    }else{
      // console.log(options.people)
      that.setData({
        inviter:options.people
      })
      wx.setStorage({
        key: 'inviter',
        data: {
          inviter: options.people
        }
      });
    }
  },

  // 用户登录 
  // bindGetUserInfo (e) {
  //   var _this=this
  //   // console.log(e.detail.userInfo)
  //   var encryptedData=encodeURIComponent(e.detail.encryptedData)
  //   var iv=encodeURIComponent(e.detail.iv)
  //   wx.login({
  //     success (res) {
  //       if (res.code) {
  //         var inviter=_this.data.inviter
  //         console.log(encryptedData+'----------'+iv+'----------'+res.code)
  //         //发起网络请求
  //         var sign = md5.hexMD5('action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2QJ1OV4tfpl')
  //         wx.request({
  //           url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2&sign=' + sign,
  //           header:{
  //             'Content-Type': 'application/x-www-form-urlencoded'
  //           },
  //           method: 'POST',
  //           data: { encryptedData: encryptedData },
  //           success:(res)=>{
  //             console.log(res.data.isSucess)
  //             wx.removeStorage({
  //               key: 'inviter',
  //               success (res) {
  //                 // console.log(res)
  //               }
  //             })
  //             if(res.data.isSucess==true){
  //               _this.setData({
  //                 username:res.data.data.username,
  //                 inviter:""
  //               })
  //               wx.showModal({
  //                 title: '温馨提示',
  //                 content: '登录成功',
  //                 success (res) {
                    
  //                 }
  //               })
  //               wx.setStorage({
  //                 key: 'username',
  //                 data: {
  //                   username: res.data.data.username,
  //                   userid: res.data.data.userid,
  //                   token: res.data.data.jiufy_auth,
  //                   mobile: res.data.data.mobile,
  //                   yb_num: res.data.data.yuanbao,
  //                   nickNames: res.data.data.truename,
  //                 }
  //               })
  //             }else{
  //               wx.showModal({
  //                 title: '温馨提示',
  //                 content: '登录失败',
  //                 success (res) {

  //                 }
  //               })
  //             }
  //           }
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '温馨提示',
  //           content: '登录失败！' + res.errMsg,
  //           success (res) {

  //           }
  //         })
  //         // console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })
  // },


  //  广告数据
  shopings: function () {
    var sign = md5.hexMD5('action=mall&adid=32&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&app=hsy&appkey=20f45751ab1cc7e0&method=productlist&version=2&sign=' + sign + '&adid=32&app=hsy',
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data.ad)
        this.setData({
          shopList: res.data.data.ad
        })
      }
    });
  },

  // 环保展厅
  goDown: function () {
    var sign = md5.hexMD5('action=form&appkey=20f45751ab1cc7e0&method=brandlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&appkey=20f45751ab1cc7e0&method=brandlist&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        this.setData({
          hallList: res.data.data
        })
      }
    });
  },

  // 常见问题
  problem: function () {
    var sign = md5.hexMD5('action=form&appkey=20f45751ab1cc7e0&method=questionlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&appkey=20f45751ab1cc7e0&method=questionlist&version=2&sign=' + sign + '',
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        this.setData({
          issueList: res.data.data,
          unhide: res.data.data[0].itemid
        })
      }
    });
  },

  // 常见问题 点击切换不同图标
  show: function (e) {
    var hide = this.data.unhide
    var itemId = e.currentTarget.dataset.id;
    if (hide == itemId) {
      this.setData({
        unhide: 0
      })
    } else {
      this.setData({
        unhide: itemId
      })
    }
  },

  // 页面跳转
  // 上门回收
  goResever: function () {
    if(this.data.username){
      wx.navigateTo({ url: 'reserve/reserve' })
    }else{
      wx.navigateTo({ url: '../auth/auth' })
    }
  },
  // 跳转福利兑换页面
  goExchange: function () {
    wx.navigateTo({ url: 'exchange/exchange' })
  },

  // 跳转旧衣处理去向页面
  goOld: function () {
    wx.navigateTo({ url: 'oldDispose/oldDispose' })
  },

  goRouter:function(e){
    var urlid = e.target.dataset.url;
		wx.navigateTo({
			url: '../url/url?urlid=' + urlid
		})
  },

  goEvery:function(e){
    var url = e.target.dataset.url;
    wx.navigateTo({
      url: ''+url+''
    });
  },

  onShow: function () {
    //  判断是否授权
    let names = wx.getStorageSync('username');
    // console.log(names.username)
    if (names.username) {
      this.setData({
        username: names.username
      })
    }
  },
})
