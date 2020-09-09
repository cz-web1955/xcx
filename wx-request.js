const host = "https://vip.ydchong0512.com/mini" 
// var host = "http://192.168.0.129:8866" 
var headers = {}
function request(url, method, data, header) {
    headers = header || {}
    if (!wx.getStorageSync("token")) {
        wx.reLaunch({ url: "../login/main" });
        wx.removeStorage({
            key: "userInfos",
            success(res) { }
        });
        wx.removeStorage({
            key: "token",
            success(res) { }
        });
        wx.removeStorage({
            key: "id",
            success(res) { }
        });
        return new Promise((resolve, reject) => {
            wx.request({
                url: host + url,
                method: method,
                data: data,
                header: headers,
                fail: res => {
                    wx.hideLoading()
                    reject(false)
                }
            })
        })
    }
    headers.token = JSON.parse(wx.getStorageSync("token")).token
    // wx.showLoading({
    //     title: '加载中' // 数据请求前loading
    // })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url,
            method: method,
            data: data,
            header: headers,
            success: function (res) {
                wx.hideLoading()
                
                if (res.data.code == '500') {
                    wx.reLaunch({ url: "../login/main" });
                    wx.removeStorage({
                        key: "userInfos",
                        success(res) { }
                    });
                    wx.removeStorage({
                        key: "token",
                        success(res) { }
                    });
                    wx.removeStorage({
                        key: "id",
                        success(res) { }
                    });
                } else {
                    resolve(res.data)
                }
            },
            fail: function (res) {
                wx.hideLoading()
                // reject(false)
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}

function get(obj) {
    return request(obj.url, 'GET', obj.data, obj.headers)
}

function post(obj) {
    // obj.headers['content-type'] = "application/x-www-form-urlencoded;charset=UTF-8"

    return request(obj.url, 'POST', obj.data, obj.headers)
}

export default {
    request,
    get,
    post,
    host
}