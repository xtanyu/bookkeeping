Component({
  properties: {

  },

  data: {
    version: undefined
  },

  methods: {

  },

  attached() {
    const accountInfo = wx.getAccountInfoSync();
    const version = accountInfo.miniProgram.version;
    this.setData({
      version: version ? "版本" + version : accountInfo.miniProgram.envVersion
    })
  }

})
