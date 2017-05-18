var wemark = require('../../wemark/wemark.js');
var Util = require('../../utils/util.js');
var article_id = '';
var title='';
var summary='';

var options = {
  imageWidth: wx.getSystemInfoSync().windowWidth,
  name: 'wemark'
};
Page({
  data: { wemark: {}},
 
  onLoad:function(options){
    var that = this
    article_id = options.id 
    //请求文章详情
    wx.request({
      url: 'https://100000p.loveav.me/v2/articles/' + article_id,
        method: 'GET',

        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success : function(res){
          var _content = res.data.body;
          title = res.data.title;
          summary = res.data.summary;
          res.data.createTime =Util.getTime(res.data.createTime / 1000);
            that.setData({
                article: res.data
            });
          
          wemark.parse(_content, that, options );
        }
    })  
  },
  onShareAppMessage: function () {
    return {
      title: title,
      desc: summary,
      path: '/pages/detail/detail?id=' + article_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '感谢分享',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '失败！',
          icon: 'warn',
          duration: 1000
        })
      }
    }
  }
})