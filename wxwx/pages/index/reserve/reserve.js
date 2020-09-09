// pages/index/reserve/reserve.js
let md5 = require('../../../js/md5.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    sele: false,
    photosw: true,
    sink: 0,  // 选中的重量
    inner: '',
    f_start:'',
    f_end:'',
    uptime: "",  // 选中的时间
    remark: "",  // 备注内容
    addreName: '', // 默认地址的信息
    addrePhone: '',
    addrePro: '',
    addreCity: '',
    addreCoun: '',
    addreAd: '',
    weight: [{
      id: 1,
      text: '5-10KG 约8-15件'
    }, {
      id: 2,
      text: '10-20KG 约20-40件'
    }, {
      id: 3,
      text: '20-30KG 约40-60件'
    }, {
      id: 4,
      text: '30KG以上 约65件以上'
    }],
    select: [{
      id: 1,
      text: '衣服',
      url: '../../../images/1.png'
    }, {
      id: 2,
      text: '鞋子',
      url: '../../../images/2.png'
    }, {
      id: 3,
      text: '包包',
      url: '../../../images/3.png'
    }, {
      id: 4,
      text: '毛绒',
      url: '../../../images/4.png'
    }],
    shopList: [],
    inviter:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopings()
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

  // 用户登录 
  // bindGetUserInfo (e) {
  //   var _this=this
  //   // console.log(e.detail.userInfo)
  //   var encryptedData=encodeURIComponent(e.detail.encryptedData)
  //   var iv=encodeURIComponent(e.detail.iv)
  //   wx.login({
  //     success (res) {
  //       if (res.code) {
  //         // console.log(encryptedData+'----------'+iv+'----------'+res.code)
  //         var inviter=_this.data.inviter
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
  //             // console.log(res.data.isSucess)
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
  //                 username:res.data.data.username,
  //                 inviter:''
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
  //               _this.getAddress()
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

  ktlist: function () {
    var urlid = 'https://'+app.globalData.ball+'.52bjy.com/doc/show-131.html';
    wx.navigateTo({
      url: '../../url/url?urlid=' + urlid
    })
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

  //  请求默认地址的信息
  getAddress: function () {
    var names = wx.getStorageSync('username');
    var sign = md5.hexMD5('action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        var arrs = res.data.data
        console.log(res.data.data)
        if(arrs){
          for (let i in arrs) {
            if (arrs[i].status == 1) {
              this.setData({
                sele: true,
                addreName: arrs[i].truename,
                addrePhone: arrs[i].mobile,
                addrePro: arrs[i].province,
                addreCity: arrs[i].city,
                addreCoun: arrs[i].district,
                addreAd: arrs[i].address,
              })
            }
          }
        }else{
          this.setData({
            sele:false
          })
        }
      }
    });
  },

  //  选中的重量
  weights: function (e) {
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.inner;
    this.setData({
      inner: text
    })
    var sink = this.sink
    if (id == sink) {
      this.setData({
        sink: 0,
      })
    } else {
      this.setData({
        sink: id,
      })
    }
  },

  // 选择时间
  datePicker() {
    var _this=this
    var now = new Date();
    var hh = now.getHours(); //获取当前小时数(0-23)

    
    var  time1 = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    var date2 = new Date(now);
    date2.setDate(now.getDate() + 30);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();


    var  time8 = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + (now.getDate() + 1);
    var date3 = new Date(now)
    date3.setDate(now.getDate() + 30)
    var time9 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + (date3.getDate() + 1);

    // console.log(zone,deadlineStr)
    // console.log(time1,time2)
    // console.log(time8,time9)

    if(hh>=16){
      _this.setData({
        f_start:time8,
        f_end:time9
      })
    }else{
      _this.setData({
        f_start:time1,
        f_end:time2
      })
    }
    
  },

  bindDateChange: function(e) {
    this.setData({
      uptime: e.detail.value
    })
  },

  // 备注内容
  remarks: function (e) {
    // console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },
  // 跳转添加地址
  goAddres: function () {
    wx.navigateTo({ url: '../../my/address/address' })
  },

  // 是否勾选协议
  tabs: function () {
    if (this.data.photosw) {
      this.setData({
        photosw: false
      })
    } else {
      this.setData({
        photosw: true
      })
    }
  },


  // formSubmit: function (e) {
  //   // console.log('form发生了submit事件，携带数据为：', e);
  //   console.log(222)
  //   this.subs(e.detail.formId);
  // },

  //  提交
  subs: function () {
    // console.log(111)
    var bius = [{
      'name': this.data.addreName,
      'phone': this.data.addrePhone,
      'pro': this.data.addrePro,
      'city': this.data.addreCity,
      'coun': this.data.addreCoun,
      'addre': this.data.addreAd,
    }]

    var lists = JSON.stringify(bius)
    var that = this;
    var sele = that.data.sele;
    var inner = that.data.inner
    var uptime = that.data.uptime
    var falg = that.data.photosw
    var remark = that.data.remark
    var channel = app.globalData.channelId;
    if (sele == false || inner == '' || uptime == '') {
      wx.showToast({
        title: '请填写完整信息',
        duration: 1500
      })
    } else if (10 <= remark.length) {
      wx.showModal({
        title: '温馨提示',
        content: '备注长度不能大于10个字',
        success (res) {
          
        }
      })
    } else if (falg == false) {
      wx.showToast({
        title: '请勾选协议',
        duration: 1500
      })
    } else {
      // console.log(remark)
      var names = wx.getStorageSync('username');
      // console.log(formId,names.data.userid)
      var sign = md5.hexMD5('action=form&address=' + encodeURI(that.data.addreAd) + '&appkey=20f45751ab1cc7e0&brandnote=' + encodeURI(that.data.remark) + '&channel=' + channel + '&city=' + encodeURI(that.data.addreCity) + '&date=' + that.data.uptime + '&district=' + encodeURI(that.data.addreCoun) + '&method=add&mobile=' + that.data.addrePhone + '&name=' + encodeURI(that.data.addreName) + '&province=' + encodeURI(that.data.addrePro) + '&type=clothes&username=' + names.username + '&version=2&weight=' + encodeURI(that.data.inner) + 'QJ1OV4tfpl')
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=form&address=' + encodeURI(that.data.addreAd) + '&appkey=20f45751ab1cc7e0&brandnote=' + encodeURI(that.data.remark) + '&channel=' + channel + '&city=' + encodeURI(that.data.addreCity) + '&date=' + that.data.uptime + '&district=' + encodeURI(that.data.addreCoun) + '&method=add&mobile=' + that.data.addrePhone + '&name=' + encodeURI(that.data.addreName) + '&province=' + encodeURI(that.data.addrePro) + '&type=clothes&username=' + names.username + '&version=2&weight=' + encodeURI(that.data.inner) + '&sign=' + sign,
        method: 'GET',
        success: (res) => {
          // console.log(res)
          if (res.data.isSucess) {
            wx.navigateTo({ url: '../succeed/succeed?list=' + lists })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              success (res) {
                
              }
            })
          }
        }
      });
    }
  },


  goxieyi() {
    wx.navigateTo({ url: '../../my/about_we/about_b/about_b' })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  goAuth:function(){
    wx.navigateTo({ url: '../../auth/auth' })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //  判断是否授权
    this.datePicker()
    let names = wx.getStorageSync('username');
    if (names.username) {
      this.setData({
        username: names.username
      })
      this.getAddress()
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