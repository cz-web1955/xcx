
let md5 = require('../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    nickNames: '',
    phone: true,  // 显示绑定手机号
    yb_num: '',
    shui: '0吨',
    tan: '0kg',
    shiyou: '0kg',
    username:'default',
    code:'',
    inviter:''
  },


  // 猿宝明细
  ybDetail: function () {
    var names = wx.getStorageSync('username');
    var sign = md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&method=center&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&method=center&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        this.setData({
          shui: res.data.data.water,
          tan: res.data.data.tan,
          shiyou: res.data.data.shiyou,
          yb_num: res.data.data.yuanbao,
        })
      }
    });
  },

  // 页面跳转
  // 跳转到 待付款页面
  toStayPayment(e) {
    let num = e.currentTarget.dataset.num
    // console.log(num)
    if(this.data.flag){
      wx.navigateTo({ url: 'stay_payment/stay_payment?numGo=' + num })
    }else{
      wx.showToast({
        title: '您还没有登录哦',
        duration: 1500
      })
    }
  },
  // 跳转 猿宝明细 页面
  toybDetail() {
    wx.navigateTo({ url: 'yb_detail/yb_detail' })
  },
  // 跳转到地址管理页面
  toAddress() {
    if(this.data.flag){
      wx.navigateTo({ url: 'address/address' })
    }else{
      wx.showToast({
        title: '您还没有登录哦',
        duration: 1500
      })
    }
  },
  // 跳转到分享页面
  toShare() {
      wx.navigateTo({ url: 'share/share' })
  },
  // 跳转到 关于我们页面
  toAbout() {
    wx.navigateTo({ url: 'about_we/about_we' })
  },
  // 跳转到 消息中心页面 
  toMessage() {
    if(this.data.flag){
      wx.navigateTo({ url: 'message/message' })
    }else{
      wx.showToast({
        title: '您还没有登录哦',
        duration: 1500
      })
    }
  },
  // 跳转到 我的收藏 页面
  toCollect() {
    if(this.data.flag){
      wx.navigateTo({ url: 'collect/collect' })
    }else{
      wx.showToast({
        title: '您还没有登录哦',
        duration: 1500
      })
    }
  },
  //  客服
  goServer:function(){
    wx.navigateTo({ url: '../serv/serv', })
  },

  // 用户登录 
  // bindGetUserInfo (e) {
  //   var that=this
  //   // console.log(e.detail.userInfo)
  //   var encryptedData=encodeURIComponent(e.detail.encryptedData)
  //   var iv=encodeURIComponent(e.detail.iv)
  //   wx.login({
  //     success (res) {
  //       if (res.code) {
  //         // console.log(encryptedData+'----------'+iv+'----------'+res.code)
  //         //发起网络请求
  //         var inviter=that.data.inviter
  //         var sign = md5.hexMD5('action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2QJ1OV4tfpl')
  //         wx.request({
  //           url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=auth&appkey=20f45751ab1cc7e0&code='+ res.code+ '&inviter='+inviter+'&iv='+iv+'&method=weixin_bind&version=2&sign=' + sign,
  //           header:{
  //             'Content-Type': 'application/x-www-form-urlencoded'
  //           },
  //           method: 'POST',
  //           data: { encryptedData: encryptedData },
  //           success:(res)=>{
  //             console.log(res.data)
  //             if(res.data.isSucess==true){
  //               wx.removeStorage({
  //                 key: 'inviter',
  //                 success (res) {
  //                   // console.log(res)
  //                 }
  //               })
  //               that.setData({
  //                 flag:true,
  //                 username:res.data.data.username,
  //                 nickNames:res.data.data.truename,
  //                 yb_num:res.data.data.yuanbao,
  //                 inviter:""
  //               })
  //               wx.showModal({
  //                 title: '温馨提示',
  //                 content: '登录成功',
  //                 success (res) {
                    
  //                 }
  //               })
  //               if(res.data.data.mobile==''){
  //                 that.setData({
  //                   phone: true
  //                 })
  //               }else{
  //                 that.setData({
  //                   phone: false
  //                 })
  //               }
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
    wx.navigateTo({ url: '../auth/auth' })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },

  // 绑定手机号
  getPhoneNumber (e) {
    var that=this
    // console.log(e)
    if(e.detail.errMsg=='getPhoneNumber:ok'){
      // console.log('用户点击了确定')
      var encryptedData=encodeURIComponent(e.detail.encryptedData)
      var iv=encodeURIComponent(e.detail.iv)
      var names = wx.getStorageSync('username');
      // console.log(encryptedData,iv)
      wx.login({
        success (res) {
          // var code = that.data.code;
          // console.log(res.code)
          var sign = md5.hexMD5('action=bind&appkey=20f45751ab1cc7e0&code='+ res.code+ '&iv='+iv+'&type=hsy_wx&username=' + names.username + '&version=2QJ1OV4tfpl')
          wx.request({
            url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/bindmobile.php?action=bind&appkey=20f45751ab1cc7e0&code='+ res.code+ '&iv='+iv+'&type=hsy_wx&username=' + names.username + '&version=2&sign=' + sign,
            method: 'GET',
            data: { encryptedData: encryptedData },
            success: (res) => {
              // console.log(res)
              if(res.data.isSucess){
                that.setData({
                  phone:false,
                  yb_num: res.data.data.yuanbao,
                  username: res.data.data.username,
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
                  content: '绑定成功',
                  success (res) {
                    
                  }
                })
              }else{
                wx.showModal({
                  title: '温馨提示',
                  content: '绑定失败',
                  success (res) {
                    
                  }
                })
              }
            }
          });
        },
      })
    }
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
    // 判断是否登录
    let txt = wx.getStorageSync('username');
    // console.log(txt.mobile)
    if (txt.username) {
        this.setData({
          flag: true,
          username: txt.username,
          nickNames: txt.nickNames,
          yb_num: txt.yuanbao
        })
        this.ybDetail()
        if (txt.mobile == '') {
          this.setData({
            phone: true
          })
        } else {
          this.setData({
            phone: false
          })
        }
    } else {
      this.setData({
        flag: false
      })
    }
  },

  // 退出登录
  removeMy:function(){
    var that=this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要退出吗？',
      success (res) {
        if (res.confirm) {
          wx.clearStorage()
          that.setData({
            flag:false,
            username: 'default',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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