//注册右侧边栏的打开和关闭事件
sidepanel.registerEvent("openSidePanel",webtb.contractStumbleFrame);
sidepanel.registerEvent("closeSidePanel",webtb.restoreStumbleFrame);

//页面初始化
//TODO: noinit是哪里定义的？
if(typeof (noinit)=="undefined")
{
$(document).ready(function()
{
  webtb.init();
}
);
}
