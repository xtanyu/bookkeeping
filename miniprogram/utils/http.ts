// 不需要验证的请求,因为不需验证所以需要店铺id来查询对应店铺数据
//const host = "http://192.168.0.108:8080/jeecg-boot/api/bookkeeping/";
const host = "https://bookkeeping.xtyu.top/api/bookkeeping/";
//  const host = "http://127.0.0.1:8080/jeecg-boot/api/bookkeeping/";


export function get(url: string, data: any = {}): Promise<any> {
  wx.showLoading({ title: '' });
  return new Promise((resolve) => {
    wx.request({
      url: host + url,
      data: data,
      method: "GET",
      header: {
        "openId": wx.getStorageSync("openId")
      },
      success: function (res) {
        var data: any = res.data;
        if (data.code == 401) {
          loginAndSaveOpenId().then(() => {
            get(url, data).then(() => {
              post(url, data).then((res) => {
                wx.hideLoading();
                resolve(res)
              });
            });
          })
        } else {
          wx.hideLoading();
          if (!data.success) {
            wx.showToast({ title: data.message, icon: 'none',duration:3000 })
          } else {
            resolve(data.result)
          }
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({ title: '网络异常', icon: 'none',duration:3000 });
      }
    });
  });
}


export function post(url: string, data: any = {}): Promise<any> {
  wx.showLoading({ title: '' });
  return new Promise((resolve) => {
    wx.request({
      url: host + url,
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "openId": wx.getStorageSync("openId")
      },
      success: function (res) {
        var data: any = res.data;
        if (data.code == 401) {
          loginAndSaveOpenId().then(() => {
            post(url, data).then((res) => {
              wx.hideLoading();
              resolve(res)
            });
          })
        } else {
          wx.hideLoading();
          if (!data.success) {
            wx.showToast({ title: data.message, icon: 'none',duration:3000 })
          } else {
            resolve(data.result)
          }
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({ title: '网络异常', icon: 'none',duration:3000 });
      }
    });
  });
}


export function upload(url: string, filePath: string, fileName: string, data: any = {}): Promise<any> {
  return new Promise((resolve) => {
    wx.uploadFile({
      url: host + url,
      filePath: filePath,
      name: fileName,
      formData: data,
      header: {
        "openId": wx.getStorageSync("openId")
      },
      success: function (res) {
        var data: any = JSON.parse(res.data);
        if (data.code == 401) {
          loginAndSaveOpenId().then(() => {
            upload(url, filePath, fileName, data).then((res) => {
              resolve(res)
            });
          })
        } else {
          if (!data.success) {
            wx.showToast({ title: data.message, icon: 'none',duration:3000 })
          } else {
            resolve(data.result)
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络异常', icon: 'none',duration:3000 });
      }
    });
  });
}



function loginAndSaveOpenId(): Promise<void> {
  return new Promise((resolve) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: host + "getOpenId",
            data: { jsCode: res.code },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var data: any = res.data;
              if (data.success) {
                wx.setStorageSync("openId", data.result)
                resolve()
              } else {
                wx.showToast({ title: data.message, icon: 'none' ,duration:3000})
              }
            }, fail: function () {
              wx.showToast({ title: '网络异常', icon: 'none' ,duration:3000})
            }
          })
        }
      }
    })
  })
}

export default {
  get,
  post,
  upload
}