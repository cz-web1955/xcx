// pages/index/nowBuy/nowBuy.js
let md5 = require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyer_name: '',  // 用户信息
    buyer_mobile: '',
    addrePro: '',
    addreCity: '',
    addreCoun: '',
    addreAd: '',
    placeList: [], // 下单商品的数据
    itemid: '',   // 下单商品的信息
    s1: '',
    s2: '',
    placeId: '',  // 下单id

    pricess: '',
    cao: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      itemid: options.itemid,
      s1: options.txt1,
      s2: options.txt2
    })

    // 商品详情数据
    var itemid = options.itemid
    var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&itemid=' + itemid + '&method=productshow&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&itemid=' + itemid + '&method=productshow&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        // console.log(res)
        let arr = []
        arr.push(res.data.data.show)
        this.setData({
          placeList: arr,
        })
        var totle = 0
        totle = Number(this.data.placeList[0].integral) + Number(this.data.placeList[0].fee_start_1)
        this.setData({
          pricess: totle,
        })

        // console.log(totle)
      }
    });

  },

  //  支付
  nowBuy: function () {
    var that = this
    var bool = this.data.cao;
    if (bool === false) return;
    that.setData({
      cao: false
    })

    var txt = wx.getStorageSync('username');
    //  支付需要的数据
    var rmb = this.data.placeList[0].integral
    var quantity = '1'
    // console.log(this.data.placeList[0])

    //  下单需要的数据
    var odatas = new Array();
    var itemid = this.data.itemid
    var title = this.data.placeList[0].title
    var thumb = this.data.placeList[0].thumb
    var price = this.data.placeList[0].price
    var seller = this.data.placeList[0].mobile
    var fee = this.data.placeList[0].fee_start_1
    var fee_name = '申通快递';
    // var integral = '0.00'
    var number = '1'
    var buyer_name = this.data.buyer_name
    var buyer_mobile = this.data.buyer_mobile
    var buyer_address = this.data.addrePro + this.data.addreCity + this.data.addreCoun + this.data.addreAd
    var buyer_postcode = '0000000'
    var zone = itemid + price + rmb + number
    var qia = (Number(rmb) + Number(fee)).toFixed(2)
    var qian = qia*100
    var s1 = this.data.s1
    var s2 = this.data.s2
    var txts
    if (s1) {
      txts = s1
    } else if (s2) {
      txts = s2
    } else {
      txts = ''
    }

    odatas = [{
      'itemid': itemid,
      'title': title,
      'thumb': thumb,
      'price': price,
      'integral': rmb,
      'number': number,
      'amount': price,
      'seller': seller,
      'fee': fee,
      'fee_name': fee_name,
      'buyer_name': buyer_name,
      'buyer_address': buyer_address,
      'buyer_postcode': buyer_postcode,
      'buyer_mobile': buyer_mobile,
      's1': txts
    }];
    odatas = JSON.stringify(odatas)
    // console.log(odatas, zone, '下单需要的数据')


    if (rmb == '0.00' && fee == '0.00') {
      wx.showModal({
        title: '温馨提示',
        content: '确认扣除猿宝' + price + '个',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '支付中',
            })
            console.log(odatas,zone,txt.username)
            //  下单请求  获取下单号
            var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer=' + txt.username + '&mainstr=' + zone + '&method=order&version=2QJ1OV4tfpl')
            wx.request({
              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer=' + txt.username + '&mainstr=' + zone + '&method=order&version=2&sign=' + sign + '',
              data: { odatas: odatas},
              header:{
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                if (res.data.isSucess) {
                  // console.log('拿到下单id')
                  //  拿到下单id  进行支付请求
                  var nowId = res.data.data.id
                  // if (integral == '0.00' && fee == '0.00') {
                  // console.log('直接扣减猿宝')
                  var sign = md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2QJ1OV4tfpl')
                  wx.request({
                    url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2&sign=' + sign,
                    method: 'GET',
                    success: (res) => {
                      console.log('猿宝扣减成功，调用支付核销')
                      var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=pay&version=2QJ1OV4tfpl')
                      wx.request({
                        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=pay&version=2&sign=' + sign,
                        method: 'GET',
                        success: (res) => {
                          console.log(res)
                          if (res.data.isSucess) {
                            wx.hideLoading();
                            that.setData({
                              cao: true
                            })

                            wx.reLaunch({
                              url: '../exchangeWin/exchangeWin',
                            })
                          } else {
                            wx.hideLoading();
                            that.setData({
                              cao: true
                            })
                            wx.showModal({
                              title: '温馨提示',
                              content: '支付失败，请稍后再试或联系客服',
                              success (res) {
                                
                              }
                            })
                          }
                        }
                      });
                    }
                  });
                } else {
                  wx.hideLoading();
                  that.setData({
                    cao: true
                  })
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.message,
                    success (res) {
                      
                    }
                  })
                  // console.log(res,'没拿到下单id啊啊啊啊啊啊啊')
                }

              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showLoading({
        title: '支付中',
      })
      //  下单请求  获取下单号
      var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer=' + txt.username + '&mainstr=' + zone + '&method=order&version=2QJ1OV4tfpl')
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer=' + txt.username + '&mainstr=' + zone + '&method=order&version=2&sign=' + sign + '',
        data: { odatas: odatas},
        header:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          // console.log(res)
          if (res.data.isSucess) {
            // console.log('拿到下单id')
            //  拿到下单id  进行支付请求
            var nowId = res.data.data.id
            // console.log('混合支付')
            //  有价格或者运费
            wx.login({
              success(res){
                if(res.code){
                  console.log(qian)
                  var sign = md5.hexMD5('action=prepay&appkey=20f45751ab1cc7e0&body=' + encodeURI(title) + '&code='+res.code+'&out_trade_no=' + nowId + '&total_fee='+qian+'&type=hsy&version=2QJ1OV4tfpl')
                  wx.request({
                    url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/wxapplet.php?action=prepay&appkey=20f45751ab1cc7e0&body=' + encodeURI(title) + '&code='+res.code+'&out_trade_no=' + nowId + '&total_fee='+qian+'&type=hsy&version=2&sign=' + sign,
                    method: 'GET',
                    success: (res) => {
                      console.log(res, '若为true,则调用支付')
                      wx.hideLoading();
                      if (res.data.isSucess) {
                        wx.requestPayment({
                          timeStamp: res.data.data.timeStamp,
                          nonceStr: res.data.data.nonceStr,
                          package: res.data.data.package,
                          signType: 'MD5',
                          paySign: res.data.data.paySign,
                          success(res) {
                            console.log(res)   // 支付成功再扣除猿宝
                            var sign = md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2QJ1OV4tfpl')
                            wx.request({
                              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2&sign=' + sign,
                              method: 'GET',
                              success: (res) => {
                                console.log('猿宝扣减成功，调用支付核销')
                                var sign = md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=pay&version=2QJ1OV4tfpl')
                                wx.request({
                                  url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=pay&version=2&sign=' + sign,
                                  method: 'GET',
                                  success: (res) => {
                                    console.log(res)
                                    if (res.data.isSucess) {
                                      wx.hideLoading();
                                      that.setData({
                                        cao: true
                                      })

                                      wx.reLaunch({
                                        url: '../exchangeWin/exchangeWin',
                                      })
                                    } else {
                                      wx.hideLoading();
                                      that.setData({
                                        cao: true
                                      })
                                      wx.showModal({
                                        title: '温馨提示',
                                        content: '支付失败，请稍后再试或联系客服',
                                        success (res) {
                                          
                                        }
                                      })
                                    }
                                  }
                                });
                              }
                            });
                          },
                          fail(res) {
                            console.log(res)
                            that.setData({
                              cao: true
                            })
                            wx.showModal({
                              title: '提示',
                              content: '支付失败！',
                              confirmColor: '#ff6375',
                              success: function (res) {
                                //console.log('用户点击确定')
                              }
                            })
                          }
                        })
                      } else {
                        wx.hideLoading();
                        that.setData({
                          cao: true
                        })
                        wx.showModal({
                          title: '温馨提示',
                          content: res.data.message,
                          success (res) {
                            
                          }
                        })
                        // console.log('不是true,不能调用支付宝支付')
                      }
                    }
                  });
                }
              }
            })
  
          } else {
            wx.hideLoading();
            that.setData({
              cao: true
            })
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              success (res) {
                
              }
            })
          }
        }
      })
    }
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
        // console.log(arrs,'地址信息')
        if (arrs == null) {
          this.setData({
            buyer_name: '',
          })
        } else {
          for (let i in arrs) {
            if (arrs[i].status == 1) {
              this.setData({
                buyer_name: arrs[i].truename,
                buyer_mobile: arrs[i].mobile,
                addrePro: arrs[i].province,
                addreCity: arrs[i].city,
                addreCoun: arrs[i].district,
                addreAd: arrs[i].address,
              })
            }
          }
        }
      }
    });
  },

  //  跳转选择地址
  goAddr: function () {
    wx.navigateTo({ url: '../../my/address/address' })
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
    this.getAddress()
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