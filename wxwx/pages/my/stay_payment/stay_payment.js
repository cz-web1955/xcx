// pages/my/stay_payment/stay_payment.js
let md5=require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab 切换
    curHdIndex: 0,

    allList:[],
    payList:[],
    deliverList:[],
    yetList:[],
    prive: [],
    statusList: [
      {
        text: '待支付'
      },
       {
        text: '待支付'
      },
      {
        text: '待发货'
      },
      {
        text: '已发货'
      }
    ],

    buyer_name: '',  // 用户信息
    buyer_mobile: '',
    addrePro: '',
    addreCity: '',
    addreCoun: '',
    addreAd: '',
    cao:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      curHdIndex:options.numGo
    })

    this.getDatas()
    var nutxt=options.numGo
    // console.log(nutxt)
    if(nutxt==1){
      this.ones()
    }else if(nutxt==2){
      this.twos()
    }else if(nutxt==3){
      this.threes()
    }
  },

   // 请求 全部数据
   getDatas:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&version=2QJ1OV4tfpl')  
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&version=2&sign='+sign,
        method: 'GET',
        success: (res) => {
          var arra=[]
          arra=res.data.data
          var arrAdd = [];
          for(var i in arra){
            arrAdd.push()
            res.data.data[i].allPrive = (Number(arra[i].fee) + Number(arra[i].integral)).toFixed(2)
            res.data.data[i].price=parseInt(res.data.data[i].price)
          }
  
          this.setData({
            allList:res.data.data,
          })
        }
      });
    },

    //tab切换
  tab: function (e) {

    
    var dataId = e.currentTarget.id;
    
    this.setData({
      curHdIndex:dataId
    })
    // console.log(dataId)
    if(dataId==1){
      this.getDatas()
    }else if(dataId==2){
      this.ones()
    }else if(dataId==3){
      this.twos()
    }else if(dataId==4){
      this.threes()
    }
  },

  //  删除订单
  delOrder:function(e){
    var that=this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除这条订单吗？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var id=e.currentTarget.dataset.id
          var names=wx.getStorageSync('username');
          var sign=md5.hexMD5('action=delorder&appkey=20f45751ab1cc7e0&buyer='+names.username+'&itemid='+id+'&mid=112&token='+names.token+'&version=2QJ1OV4tfpl')  
          wx.request({
            url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/mall.php?action=delorder&appkey=20f45751ab1cc7e0&buyer='+names.username+'&itemid='+id+'&mid=112&token='+names.token+'&version=2&sign='+sign,
            method: 'GET',
            success: (res) => {
              // console.log(res)
              that.ones()
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //  支付
  goBuy:function(e){
    var that=this

    var bool = this.data.cao;
    if(bool === false) return;
    this.setData({
      cao: false
    })
    var integral=e.currentTarget.dataset.integral  // 商品人民币
    var note=e.currentTarget.dataset.note  // 商品规格

    var txt = wx.getStorageSync('username');
    //  支付需要的数据
    var quantity = '1'

    var gid=e.currentTarget.dataset.gid
    //  下单需要的数据
    var odatas = new Array();
    var itemid = e.currentTarget.dataset.id  // 商品id
    var title = e.currentTarget.dataset.title
    var thumb = e.currentTarget.dataset.thumb
    var price = e.currentTarget.dataset.price
    var seller = e.currentTarget.dataset.seller  
    var fee = e.currentTarget.dataset.fee
    var fee_name = '申通快递';
    var number = '1'
    var buyer_name = this.data.buyer_name
    var buyer_mobile = this.data.buyer_mobile
    var buyer_address = this.data.addrePro + this.data.addreCity + this.data.addreCoun + this.data.addreAd
    var buyer_postcode = '0000000'
    var zone = itemid + price + integral + number

    var qia=(Number(integral) + Number(fee)).toFixed(2)
    var qian = qia*100

    
    if (integral == '0.00' && fee == '0.00') {
      wx.showModal({
        title: '温馨提示',
        content: '确认扣除猿宝'+price+'个',
        success (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.showLoading({
              title: '支付中',
            })
            // console.log('拿到下单id')
            //  拿到下单id  进行支付请求
            var nowId = gid
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
                      // console.log(res.data)
                      if (res.data.isSucess) {
                        wx.hideLoading();
                        that.setData({
                          cao: true
                        })
  
                        wx.reLaunch({
                        url: '../../index/exchangeWin/exchangeWin',
                      })
                      } else {
                        wx.hideLoading();
                         that.setData({
                          cao: true
                        })
                        wx.showToast({
                          title: '支付失败，请稍后再试或联系客服',
                          duration: 1500
                        })
                      }
                    }
                  });
                }
              });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else {
        wx.showLoading({
          title: '支付中',
        })
          //  拿到下单id  进行支付请求
          var nowId = gid
          // console.log(nowId)
            // console.log('混合支付')
            //  有价格或者运费
            wx.login({
              success(res){
                if(res.code){
                  // console.log(qian)
                  var sign = md5.hexMD5('action=prepay&appkey=20f45751ab1cc7e0&body=' + encodeURI(title) + '&code='+res.code+'&out_trade_no=' + nowId + '&total_fee='+qian+'&type=hsy&version=2QJ1OV4tfpl')
                  wx.request({
                    url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/wxapplet.php?action=prepay&appkey=20f45751ab1cc7e0&body=' + encodeURI(title) + '&code='+res.code+'&out_trade_no=' + nowId + '&total_fee='+qian+'&type=hsy&version=2&sign=' + sign,
                    method: 'GET',
                    success: (res) => {
                      // console.log(res, '若为true,则调用支付')
                      wx.hideLoading();
                      if (res.data.isSucess) {
                        wx.requestPayment({
                          timeStamp: res.data.data.timeStamp,
                          nonceStr: res.data.data.nonceStr,
                          package: res.data.data.package,
                          signType: 'MD5',
                          paySign: res.data.data.paySign,
                          success(res) {
                            // console.log(res)   // 支付成功再扣除猿宝
                            var sign = md5.hexMD5('action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2QJ1OV4tfpl')
                            wx.request({
                              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=user&appkey=20f45751ab1cc7e0&gid=' + nowId + '&method=yuanbaosub&price=' + price + '&username=' + txt.username + '&version=2&sign=' + sign,
                              method: 'GET',
                              success: (res) => {
                                // console.log('猿宝扣减成功，调用支付核销')
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
    }

  },

  //  待付款请求
  ones:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=0,1&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=0,1&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        // console.log(res.data.data)
        var arra=[]
          arra=res.data.data
          var arrAdd = [];
          for(var i in arra){
            arrAdd.push()
            res.data.data[i].allPrive = (Number(arra[i].fee) + Number(arra[i].integral)).toFixed(2)
            res.data.data[i].price=parseInt(res.data.data[i].price)
          }
        this.setData({
          payList:res.data.data
        })
      }
    });
  },

  //  待发货
  twos:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=2,4&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=2,4&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        var arra=[]
          arra=res.data.data
          var arrAdd = [];
          for(var i in arra){
            arrAdd.push()
            res.data.data[i].allPrive = (Number(arra[i].fee) + Number(arra[i].integral)).toFixed(2)
            res.data.data[i].price=parseInt(res.data.data[i].price)
          }
        // console.log(res.data.data)
        this.setData({
          deliverList:res.data.data
        })
      }
    });
  },

  //  已发货
  threes:function(){
    var names=wx.getStorageSync('username');
    var sign=md5.hexMD5('action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=3&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/hsy.php?action=mall&appkey=20f45751ab1cc7e0&buyer='+names.username+'&method=orderlist&status=3&version=2&sign='+sign,
      method: 'GET',
      success: (res) => {
        var arra=[]
          arra=res.data.data
          var arrAdd = [];
          for(var i in arra){
            arrAdd.push()
            res.data.data[i].allPrive = (Number(arra[i].fee) + Number(arra[i].integral)).toFixed(2)
            res.data.data[i].price=parseInt(res.data.data[i].price)
          }
        // console.log(res.data.data)
        this.setData({
          yetList:res.data.data
        })
      }
    });
  },

  goShopa:function(){
    wx.navigateTo({ url: '../../index/exchange/exchange'})
  },


  //  请求默认地址的信息
  getAddress: function () {
    var names = wx.getStorageSync('username' );
    var sign = md5.hexMD5('action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2QJ1OV4tfpl')
    wx.request({
      url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2&sign=' + sign,
      method: 'GET',
      success: (res) => {
        var arrs = res.data.data
        // console.log(arrs,'地址信息')
        if(arrs==null){
          this.setData({
            buyer_name: '',
          })
        }else{
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.ones();
    this.twos();
    this.threes();
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