var app = getApp();
var sectionData = null;
var currentSectionIndex = 0;
var Util = require('../../utils/util.js');
Page({
  data: {
    hidden:true
  },
  onLoad: function () {
    var that = this
    //登陆
    app.getUserInfo(function(userInfo){
      console.log(userInfo)
    })
    //获取分类信息
    wx.request({
      url: 'https://100000p.loveav.me/v2/users/1/collections',
        data : {},
        success : function(res){
          sectionData = res.data;
          sectionData[0]['active'] = true //默认选中第一个分类
          that.loadArticles(sectionData[0]['id'])
          that.setData({
              sections : sectionData
          });
        }
    })
  },
  onSectionClicked: function(e){
    var sid = e.currentTarget.dataset.sid;
    //刷新选中状态
    for(var i in sectionData){
      if(sectionData[i]['id'] == sid){
        sectionData[i]['active'] = true
        currentSectionIndex = i
      }else {
        sectionData[i]['active'] = false
      }
    }
    this.setData({
        sections : sectionData
    });
    //加载文章
    if(sectionData[currentSectionIndex]['articles']){
      this.setData({
          articles : sectionData[currentSectionIndex]['articles']
      });
    }else{
      this.loadArticles(sid)
    }   
  },
  loadArticles: function(id){
    var that = this
    this.setData({
      hidden:false
    })
    //获取文章列表
    wx.request({
      url: 'https://100000p.loveav.me/v2/collections/'+id+'/articles',
        method: 'GET',
        
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success : function(res){
          var articleData = res.data;
          //console.log(articleData);
          for (var i = 0; i < articleData.length; i++) {

            articleData[i].createTime = Util.getTime(articleData[i].createTime/1000);
          } 
            sectionData[currentSectionIndex]['articles'] = articleData;//刷新
            that.setData({
              articles : sectionData[currentSectionIndex]['articles'],
              hidden: true
          });
          wx.stopPullDownRefresh();//结束动画
        }
    })
  },

  loadMoreArticles: function (id,articleId) {
    var that = this;
    this.setData({
      hidden: false
    });
    //获取文章列表
    wx.request({
      url: 'https://100000p.loveav.me/v2/collections/' + id + '/articles?cursor=' + articleId,
      method: 'GET',

      header: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: function (res) {
        var articleData = res.data;
        //console.log(articleData);
        for (var i = 0; i < articleData.length; i++) {

          articleData[i].createTime = Util.getTime(articleData[i].createTime / 1000);
        } 
          //加载更多
        if (articleData.length>0) {
            sectionData[currentSectionIndex]['articles'] = sectionData[currentSectionIndex]['articles'].concat(articleData);
          } else {
            wx.showToast({
              title: '暂无更多内容',
              icon: 'warn',
              duration: 2000
            })
          }
       

        that.setData({
          articles: sectionData[currentSectionIndex]['articles'],
          hidden: true
        });
        wx.stopPullDownRefresh()//结束动画
      }
    })
  },
  onArticleClicked: function(e){
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: '/pages/detail/detail?id='+aid
    })
  },
  //下拉刷新
  onPullDownRefresh: function(){
    this.loadArticles(sectionData[currentSectionIndex]['id'])
  },
  //加载更多
  onReachBottom: function () {
    var articleTmp = sectionData[currentSectionIndex]['articles'];
    //console.log(articleTmp[articleTmp.length - 1].id);
   this.loadMoreArticles(sectionData[currentSectionIndex]['id'],articleTmp[articleTmp.length - 1].id );
  },

  onShareAppMessage: function () {
    return {
      title: '10万加--老张分享的优质文章',
      desc: '老张每天分享的优质文章!',
      path: '/page/user?id=123',
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
