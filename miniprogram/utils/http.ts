// const host = "https://api.xtyu.top/v2/api/bookkeeping/";
// export const roomWebsocket = "wss://api.xtyu.top/v2/websocket/room/";
// export const apiKey = "ea18e92a774746c1a5dea4e7fbb0230c";
export const apiKey = "ea18e92a774746c1a5dea4e7fbb0230c";
const host = "http://127.0.0.1:8080/v2/api/bookkeeping/";
export const roomWebsocket = "ws://127.0.0.1:8080/v2/websocket/room/";

export function post(url: string, data: any = {}, loading: boolean = false): Promise<any> {
  if (loading) {
    wx.showLoading({ title: '', mask: true });
  }
  return new Promise((resolve) => {
    wx.request({
      url: host + url,
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "openId": wx.getStorageSync("openId"),
        "apiKey": apiKey
      },
      success: function (res) {
        var rData: any = res.data;
        if (rData.code == 401) {
          loginAndSaveOpenId().then(() => {
            post(url, data).then((res) => {
              if (loading) {
                wx.hideLoading();
              }
              resolve(res)
            });
          })
        } else {
          if (loading) {
            wx.hideLoading();
          }
          if (!rData.success) {
            wx.showToast({ title: rData.message, icon: 'none', duration: 3000 })
          } else {
            resolve(rData.result)
          }
        }
      },
      fail: function () {
        if (loading) {
          wx.hideLoading();
        }
        wx.showToast({ title: '网络异常', icon: 'none', duration: 3000 });
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
        "openId": wx.getStorageSync("openId"),
        "apiKey": apiKey
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
            wx.showToast({ title: data.message, icon: 'none', duration: 3000 })
          } else {
            resolve(data.result)
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络异常', icon: 'none', duration: 3000 });
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
              "content-type": "application/x-www-form-urlencoded",
              "apiKey": apiKey
            },
            success: function (res) {
              var data: any = res.data;
              if (data.success) {
                wx.setStorageSync("openId", data.result)
                resolve()
              } else {
                wx.showToast({ title: data.message, icon: 'none', duration: 3000 })
              }
            }, fail: function () {
              wx.showToast({ title: '网络异常', icon: 'none', duration: 3000 })
            }
          })
        }
      }
    })
  })
}

export default {
  post,
  upload,
  roomWebsocket,
  apiKey
}