// pages/my/address_add/address_add.js
const tcity = require('../../../js/citys.js');
let md5 = require('../../../js/md5.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: "",
    city: "",
    county: '',
    visible: false,
    provinces: [],
    citys: [],
    countys: [],
    value: [0, 0, 0],
    values: [0, 0, 0],
    one:"",
    two:"",
    three:"",
    address:false,  // 判断是否选择了省市区
    name:'',
    phone:'',
    adres:"",
    code: '',  //选中区的邮政编码
    zoneCode: [],
    falg:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    tcity.init(that);
		that.dzinit();
    this.setData({
      province: "省份",
      city: "城市",
      county: '地区'
    })
  },

  name: function (e) {
		this.setData({
			name: e.detail.value
		})

	},

	phones: function (e) {
		this.setData({
			phone: e.detail.value
    })
    if (e.detail.value.length == 11){
      wx.hideKeyboard()
    }
	},

	addres: function (e) {
		this.setData({
			adres: e.detail.value
		})
  },
  
  // 三级联动 -----------------------------------------------------------
  opendz: function () {
		var visible = this.data.visible;
		if (!visible) {
			this.setData({
				visible: true,
				value: [0, 0, 0]
			});
			this.dzinit();
		}
	},

  dzinit: function () {
		var that = this;
		var cityData = that.data.cityData;
		const provinces = [];
		const citys = [];
		const countys = [];
    const zoneCode= [];
		for (let i = 0; i < cityData.length; i++) {
			provinces.push(cityData[i].name);
		}
		for (let i = 0; i < cityData[0].sub.length; i++) {
			citys.push(cityData[0].sub[i].name)
		}
		for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
			countys.push(cityData[0].sub[0].sub[i].name)
      zoneCode.push(cityData[0].sub[0].sub[i].code)
		}
		that.setData({
			'provinces': provinces,
			'citys': citys,
			'countys': countys,
      'zoneCode':zoneCode,
      one: cityData[0].name,
			two: cityData[0].sub[0].name,
			three: cityData[0].sub[0].sub[0].name,
      code: cityData[0].sub[0].sub[0].code
		});

	},

  bindChange: function (e) {
    console.log(111)
    var val = e.detail.value
   
    var t = this.data.values;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];
      const zoneCode = []
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
        zoneCode.push(cityData[val[0]].sub[0].sub[i].code)
      }
      this.setData({
        one: this.data.provinces[val[0]],
        two: cityData[val[0]].sub[0].name,
        citys: citys,
        three: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        zoneCode: zoneCode,
        values: val,
        value: [val[0], 0, 0],
        code: cityData[val[0]].sub[0].sub[0].code
      })
      return;
    }
    if (val[1] != t[1]) {
      const countys = [];
      const  zoneCode = []
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
        zoneCode.push(cityData[val[0]].sub[val[1]].sub[i].code)
      }
      this.setData({
        two: this.data.citys[val[1]],
        three: cityData[val[0]].sub[val[1]].sub[0].name,
        code: cityData[val[0]].sub[val[1]].sub[0].code,
        countys: countys,
        zoneCode: zoneCode,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        three: this.data.countys[val[2]],
        values: val,
        code: this.data.zoneCode[val[2]],
      })
      return;
    }
  },

  // 所选择的省市区存入
  confirm:function(){
    var o=this.data.one
    var t=this.data.two
    var r=this.data.three
    this.setData({
      province:o,
      city:t,
      county:r,
      visible:false,
      address:true
    })
  },

  cancel: function () {
    this.setData({
      visible: false
    })
  },

  // 三级联动 -----------------------------------------------------------


  // 提交按钮
  addSubmit: function () {
    if (this.data.falg === false) return;
    // this.setData({
    //   falg: false
    // })
    // console.log(this.data.name,this.data.phone,this.data.adres,this.data.province, this.data.city, this.data.county,this.data.address,this.data.code)
    var that = this;
		var pattern = /^[\u4E00-\u9FA5]{2,6}$/;
		var name = that.data.name;
		var mobile = that.data.phone;
		var address = that.data.adres; // 详细地址
    var city = that.data.address; // 判断用户是否选择省市区
    var pro=that.data.province
    var cit=that.data.city
    var cou=that.data.county
		if (name == '' || mobile == '' || address == '' ||  city== false) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写完整信息',
        success (res) {
          
        }
      })
		} else if (address.length <= 6) {
      wx.showModal({
        title: '温馨提示',
        content: '地址长度不能小于6个字',
        success (res) {
          
        }
      })
		} else if (!pattern.test(name) || name == ' ') {
      wx.showModal({
        title: '温馨提示',
        content: '应快递实名制要求，请填写正确的姓名',
        success (res) {
          
        }
      })
		} else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showModal({
        title: '温馨提示',
        content: '手机号码有误，请填写正确的手机号码',
        success (res) {
          
        }
      })
		} else if (city == false) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择地址区域',
        success (res) {
          
        }
      })
		} else {
      that.setData({
        falg:false
      })
       var names=wx.getStorageSync('username');
        var sign=md5.hexMD5('action=addaddress&address='+encodeURI(address)+'&appkey=20f45751ab1cc7e0&auth='+names.token+'&city='+encodeURI(cit)+'&mobile='+that.data.phone+'&postcode='+that.data.code+'&province='+encodeURI(pro)+'&district='+encodeURI(cou)+'&telephone='+that.data.phone+'&truename='+encodeURI(name)+'&username='+names.username+'&version=2QJ1OV4tfpl')  
        wx.request({
          url: 'https://'+app.globalData.ball+'.52bjy.com/api/app/user.php?action=addaddress&address='+encodeURI(address)+'&appkey=20f45751ab1cc7e0&auth='+names.token+'&city='+encodeURI(cit)+'&mobile='+that.data.phone+'&postcode='+that.code+'&province='+encodeURI(pro)+'&district='+encodeURI(cou)+'&telephone='+that.data.phone+'&truename='+encodeURI(name)+'&username='+names.username+'&version=2&sign='+sign,
          method: 'GET',
          success: (res) => {
            if(res.isSucess==false){
              wx.showModal({
                title: '温馨提示',
                content: res.message,
                success (res) {
                  
                }
              })
              that.setData({
                falg:true
              })
            }else{
              wx.showToast({
                title: '添加成功',
                duration: 1500
              })
              that.setData({
                falg:true
              })
              wx.navigateBack();
            }
          }
        });
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