var util=
{
escaped:function(val)
{
return escape(escape(val));
}
,unescaped:function(val)
{
return unescape(unescape(val));
}
,debug:function(msg)
{
if(toolbarConf.debugMode&&typeof console!="undefined")
{
console.log(Date()+" "+msg);
}
}
,dumpRequest:function(_70)
{
var str=new Array();
for(var key in _70)
{
str[str.length]=key+"="+_70[key];
}
str=str.join(",");
return str;
}
,reportError:function(err)
{
var _74="err="+err+"&ua="+navigator.userAgent;
jQuery.ajax(
{
type:"POST",url:toolbarConf.errorUrl,data:_74,error:function()
{
}
}
);
}
,getToken:function()
{
return ftoken;
}
,setHash:function(o)
{
var _76=new Array();
if(!toolbarState.pid)
{
for(var key in o)
{
  if(key)
  {
    if(typeof (o[key])=="boolean"&&o[key]==true)
    {
      _76[_76.length]=key;
    }
    else
    {
      _76[_76.length]=key+"="+util.escaped(o[key]);
    }
  }
}
_76="#"+_76.join("&");
}
else
{
var u=o["url"];
if(u.indexOf("/")>0)
{
  u=u.substr(u.indexOf("/")+2);
}
for(var key in o)
{
  if(key)
  {
    if(key=="url"||key=="pid")
    {
      continue;
    }
    if(typeof (o[key])=="boolean"&&o[key]==true)
    {
      _76[_76.length]=key;
    }
    else
    {
      _76[_76.length]=key+":"+encodeURIComponent(o[key]);
    }
  }
}
_76="#"+toolbarState.pid+"/"+u+"/"+_76.join(";");
}
document.location.hash=_76;  //地址栏中的参数是在这里改的
}
,clearHash:function()
{
webtb.request=
{
};
document.location.hash="#";
}
};
