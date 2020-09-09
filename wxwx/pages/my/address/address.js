// pages/my/address/address.js
let md5 = require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    tureId: 0,
    deleteShow: 'false'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    // 获取地址列表
    if (this.data.deleteShow === 'true') {
      var names = wx.getStorageSync('username');
      var sign = md5.hexMD5('action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2QJ1OV4tfpl')
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2&sign=' + sign,
        method: 'GET',
        success: (res) => {
          var arrs = res.data.data
          console.log(arrs)
          this.trueAdd(arrs[0].itemid)
          this.setData({
            addressList: res.data.data
          })
        }
      });
    } else {
      var names = wx.getStorageSync('username');
      var sign = md5.hexMD5('action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2QJ1OV4tfpl')
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=listaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&username=' + names.username + '&version=2&sign=' + sign,
        method: 'GET',
        success: (res) => {
          var arrs = res.data.data
          // console.log(arrs)
          for (let i in arrs) {
            if (arrs[i].status == 1) {
              this.setData({
                tureId: arrs[i].itemid
              })
            }
          }
          this.setData({
            addressList: res.data.data
          })
        }
      });
    }

  },

  // 删除地址信息
  delAdd: function (e) {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除这条地址信息吗？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id
          var sta = e.currentTarget.dataset.status
          var names = wx.getStorageSync('username');
          var sign = md5.hexMD5('action=deladdress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2QJ1OV4tfpl')
          if (sta == '1' && that.data.addressList.length > 1) {
            wx.request({
              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=deladdress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2&sign=' + sign,
              method: 'GET',
              success: (res) => {
                that.setData({
                  deleteShow: 'true'
                })
                that.getList()
              }
            });
          } else {
            wx.request({
              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=deladdress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2&sign=' + sign,
              method: 'GET',
              success: (res) => {
                // console.log(that.data.addressList, '123123')
                that.getList()
              }
            });
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 设置为默认地址
  trueAdd: function (e) {
    var that = this
    if (that.data.deleteShow === 'true') {
      var id = e
      var names = wx.getStorageSync('username');
      var sign = md5.hexMD5('action=defaultaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2QJ1OV4tfpl')
      wx.request({
        url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=defaultaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2&sign=' + sign,
        method: 'GET',
        success: (res) => {
          // console.log(res)
          this.setData({
            deleteShow: 'false'
          })
          that.getList()
        }
      });
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '是否设为默认地址？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            var hide = that.data.tureId
            var itemId = e.currentTarget.dataset.id;
            if (hide == itemId) {
              that.setData({
                tureId: 0
              })
            } else {
              that.setData({
                tureId: itemId
              })
            }
            var id = that.data.tureId
            var names = wx.getStorageSync('username');
            var sign = md5.hexMD5('action=defaultaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2QJ1OV4tfpl')
            wx.request({
              url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=defaultaddress&appkey=20f45751ab1cc7e0&auth=' + names.token + '&itemid=' + id + '&username=' + names.username + '&version=2&sign=' + sign,
              method: 'GET',
              success: (res) => {
                // console.log(res)
                that.getList()
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },

    // methods: {
    //   onSuccess: function (res) {
    //     console.log(res.detail);
    //   },
    //   onFail: function (res) {
    //     console.log(res);
    //   }
    // },
  // 点击跳转编辑地址页面
  common: function () {
    wx.navigateTo({ url: '../address_add/address_add' })
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
    this.getList()
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