var toolbarState=
{
  way:"general",
  stumble:false,//每次设置主工作区的时候，将后台返回的所有内容放入该变量
  source:"general",
  showlogin:true,
  partner:false,//stumblethru时候的合作网站的网址
  mode:false,//浏览模式
  topic:false,//metatopic | topic | navtopic | instumbler时的浏览话题
  thumb:"none",//用户之前对该网站的评价
  ratingLock:false,
  noHistory:false,//false为修改地址栏中的参数
  expectingLoad:false,//每次设置主工作区的内容的时候，就设置为true
  onPage:false,
  userData:false,//存放用户资料
  sidePanelOpen:false,//侧边栏是否已经开启
  sidePanelAction:false,//侧边栏以何种方式开启(展示什么内容)
  doHealthChecks:
  {//健康检查的时间间隔
    shortInterval:false,longInterval:false
  }
  ,stumblesThisMode:0,//浏览次数(不管是预取还是正式浏览)  每次setContent中清0
  waitingOnPrefetch:false,//从后台取数据，等待状态
  clickTs:
  {
  },//stumble：点击下一次之后，从后台的时间返回的时间点
  stumbleCount:0,//没有缓存，直接从服务器取数据的次数
  loggedOutLike:false,
  supr:false,//是否显示顶部的F和T图标
  pid:false,//浏览对象ID
  url:false,//浏览对象的URL
  instumbler:false,//instumbler时的浏览对象：false/某人user_id
  skipcontext:false //false则在兴趣爱好选择框中显示后台传来的contextual值
};
