// pages/index/shopDetail/shopDetail.js
let md5 = require('../../../js/md5.js')
let WxParse = require('../../../js/wxParse.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewShow: true,  // 控制遮罩层显示隐藏
    detailList: [],
    username: '',
    Id: '',  // 商品id
    bannerList: [],  // 轮播图
    lookList: [],
    specOne: '', // 规格数据
    specTwo: '',
    s1: '',  // 规格内容
    s2: '',
    bookStar: false, //判断调用弹出框，
    orderNumber: 0, //判断是否有商品类型
    usernameA: '',
    inviter:''
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
  //         // console.log(encryptedData+'----------'+iv+'----------'+res.code)
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
  //             if(res.data.isSucess==true){
  //               wx.removeStorage({
  //                 key: 'inviter',
  //                 success (res) {
  //                   // console.log(res)
  //                 }
  //               })
  //               wx.showModal({
  //                 title: '温馨提示',
  //                 content: '登录成功',
  //                 success (res) {
                    
  //                 }
  //               })
  //               _this.setData({
  //                 username:res.data.data.username
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

  goAuth:function(){
    wx.navigateTo({ url: '../../auth/auth' })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(e.itemId)
    // var that=this
    // wx.getStorage({
    //   key: 'inviter',
    //   success (res) {
    //     if(res.data.inviter==undefined){
    //       console.log('没有介绍人')
    //       return false
    //     }else{
    //       that.setData({
    //         inviter:res.data.inviter
    //       })
    //     }
    //   }
    // })

    this.setData({
      Id: options.itemId
    })


    // 商品详情数据
    var itemid = options.itemId
    var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&itemid=' + itemid + '&method=productshow&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&itemid=' + itemid + '&method=productshow&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data.show)
        var article = res.data.data.show.content;
        WxParse.wxParse('article', 'html', article, this, 5);
        var str = res.data.data.show.v1;
        var str2 = res.data.data.show.v2;
        var arr1 = str.split('|');
        var r = arr1.filter(function (s) {
          return s && s.trim();
        });
        var arr2 = str2.split('|');
        var r2 = arr2.filter(function (s) {
          return s && s.trim();
        });
        // console.log(r,r2)
        let arr = []
        arr.push(res.data.data.show)
        // console.log(arr)
        for(var i in arr){
          arr[i].price=parseInt(arr[i].price)
        }
        this.setData({
          detailList: arr,
          bannerList: arr[0].albums,
          specOne: r,
          specTwo: r2,
          usernameA: res.data.data.show.username
        })
      }
    });

    this.shoping()
  },

  // 看了又看列表数据
  shoping: function () {
    var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&method=productlist&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&method=productlist&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var diu = []
        diu.push(res.data.data[0], res.data.data[1], res.data.data[2], res.data.data[3], res.data.data[4], res.data.data[5])
        this.setData({
          lookList: diu
        })
      }
    });
  },

  goDetail: function (e) {
    var itemId = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../shopDetail/shopDetail?itemId=' + itemId })
  },
  
  goServer:function(){
    wx.navigateTo({ url: '../../serv/serv', })
  },



  // 点击选择不同规格
  s1: function (e) {
    var s1 = e.target.dataset.index;
    this.setData({
      s1: s1,
    });
    // console.log(e.target.dataset.index)
  },
  s2: function (e) {
    var s2 = e.target.dataset.index;
    this.setData({
      s2: s2,
    });
  },

  // 加入收藏请求
  collect: function () {
    // console.log(this.data.Id,'ssssssssss')
    let txt = wx.getStorageSync('username');
    var id = this.data.Id
    var sign = md5.hexMD5('action=favorite_add&appkey=20f45751ab1cc7e0&auth=' + txt.token + '&itemid=' + id + '&mid=112&username=' + txt.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/member.php?action=favorite_add&appkey=20f45751ab1cc7e0&auth=' + txt.token + '&itemid=' + id + '&mid=112&username=' + txt.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.data.isSucess) {
          // console.log('收藏成功')
          if (res.data.message == "") {
            wx.showToast({
              title: '收藏成功',
              duration: 1500
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              success (res) {
                
              }
            })
          }
        } else {
          // console.log('操作失败，请稍后再试')
          wx.showModal({
            title: '温馨提示',
            content: res.data.message,
            success (res) {
              
            }
          })
        }
      },
      fail: (res) => {
        // console.log(res)
        wx.showModal({
          title: '温馨提示',
          content: '操作失败，请稍后再试',
          success (res) {
            
          }
        })
      }
    });
  },

  // 加入收藏操作
  shows: function () {
    // 判断是否登录
    // this.collect()
    let txt = wx.getStorageSync('username');
    let bol = this.data.bookStar;
    var arr1 = this.data.specOne  // arr1是重量
    var arr2 = this.data.specTwo  // arr2是颜色
    var s1 = this.data.s1;   // 存的重量信息
    var s2 = this.data.s2;   // 存的颜色信息

    if (txt == undefined) {
      // console.log('还没有第一次授权')
      return;
    } else {
      // 判断是否选择规格
      if (arr1.length > 0) {
        // console.log(s1,bol)
        var orderBol = this.data.orderNumber;
        if (bol) {
          this.setData({
            bookStar: false,
          })
        }
        if (orderBol === 1) {
          if (s1 == '') {
            wx.showToast({
              title: '请选择规格',
              duration: 1500
            })
          } else {
            this.collect()
            this.setData({
              viewShow: true,
              bookStar: true,
              orderNumber: 0
            })
          }
        } else {
          this.setData({
            viewShow: false,
            orderNumber: 1
          })
        }
      } else if (arr2.length > 0) {
        var orderBol = this.data.orderNumber;
        if (bol) {
          this.setData({
            bookStar: false,
          })
        }
        if (orderBol === 1) {
          if (s2 == '') {
            wx.showToast({
              title: '请选择规格',
              duration: 1500
            })
          } else {
            this.collect()
            this.setData({
              viewShow: true,
              bookStar: true,
              orderNumber: 0
            })
          }
        } else {
          this.setData({
            viewShow: false,
            orderNumber: 1
          })
        }
      } else {
        this.collect()
      }
    }
  },

  // 跳转下单页面
  toNowbuy: function () {
    // 判断是否登录
    let txt = wx.getStorageSync('username');
    let bol = this.data.bookStar;
    var arr1 = this.data.specOne  // arr1是重量
    var arr2 = this.data.specTwo  // arr2是颜色
    var s1 = this.data.s1;   // 存的重量信息
    var s2 = this.data.s2;   // 存的颜色信息
    var id = this.data.Id
    if (txt == undefined) {
      return
    }else {
      // 判断是否选择规格
      if (arr1.length > 0) {
        var orderBol = this.data.orderNumber;
        if (bol) {
          this.setData({
            bookStar: false,
          })
        }
        if (orderBol === 1) {
          if (s1 == '') {
            wx.showToast({
              title: '请选择规格',
              duration: 1500
            })
          } else {
            this.setData({
              viewShow: true,
              bookStar: true,
              order: 0
            })
            wx.navigateTo({ url: '../nowBuy/nowBuy?txt1=' + s1 + '&txt2=' + s2 + '&itemid=' + id })
          }
        } else {
          this.setData({
            viewShow: false,
            orderNumber: 1
          })
        }
      } else if (arr2.length > 0) {
        var orderBol = this.data.orderNumber;
        if (bol) {
          this.setData({
            bookStar: false,
          })
        }
        if (orderBol === 1) {
          if (s2 == '') {
            wx.showToast({
              title: '请选择规格',
              duration: 1500
            })
          } else {
            this.setData({
              viewShow: true,
              bookStar: true,
              orderNumber: 0
            })
            wx.navigateTo({ url: '../nowBuy/nowBuy?txt1=' + s1 + '&txt2=' + s2 + '&itemid=' + id })
          }
        } else {
          this.setData({
            viewShow: false,
            orderNumber: 1
          })
        }
      } else {
        wx.navigateTo({ url: '../nowBuy/nowBuy?txt1=' + s1 + '&txt2=' + s2 + '&itemid=' + id })
      }

    }
  },

  // 跳转到首页
  goIndex: function () {
    wx.switchTab({
      url: '../../index/index'
    })
  },
  // 点击关闭遮罩层 
  close: function () {
    this.setData({
      viewShow: true,
      bookStar: true,
      orderNumber: 0
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
    //  判断是否授权
    let names = wx.getStorageSync('username');
    if (names.username) {
      this.setData({
        username: names.username
      })
    }
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