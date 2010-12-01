var isIE=(navigator.appVersion.indexOf("MSIE")!=-1)?true:false;
var isWin=(navigator.appVersion.toLowerCase().indexOf("win")!=-1)?true:false;
var isOpera=(navigator.userAgent.indexOf("Opera")!=-1)?true:false;
function ControlVersion(){
var _1;
var _2;
var e;
try{
_2=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
_1=_2.GetVariable("$version");
}
catch(e){
}
if(!_1){
try{
_2=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
_1="WIN 6,0,21,0";
_2.AllowScriptAccess="always";
_1=_2.GetVariable("$version");
}
catch(e){
}
}
if(!_1){
try{
_2=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
_1=_2.GetVariable("$version");
}
catch(e){
}
}
if(!_1){
try{
_2=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
_1="WIN 3,0,18,0";
}
catch(e){
}
}
if(!_1){
try{
_2=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
_1="WIN 2,0,0,11";
}
catch(e){
_1=-1;
}
}
return _1;
}
function GetSwfVer(){
var _4=-1;
if(navigator.plugins!=null&&navigator.plugins.length>0){
if(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]){
var _5=navigator.plugins["Shockwave Flash 2.0"]?" 2.0":"";
var _6=navigator.plugins["Shockwave Flash"+_5].description;
var _7=_6.split(" ");
var _8=_7[2].split(".");
var _9=_8[0];
var _a=_8[1];
var _b=_7[3];
if(_b==""){
_b=_7[4];
}
if(_b[0]=="d"){
_b=_b.substring(1);
}else{
if(_b[0]=="r"){
_b=_b.substring(1);
if(_b.indexOf("d")>0){
_b=_b.substring(0,_b.indexOf("d"));
}
}
}
var _4=_9+"."+_a+"."+_b;
}
}else{
if(navigator.userAgent.toLowerCase().indexOf("webtv/2.6")!=-1){
_4=4;
}else{
if(navigator.userAgent.toLowerCase().indexOf("webtv/2.5")!=-1){
_4=3;
}else{
if(navigator.userAgent.toLowerCase().indexOf("webtv")!=-1){
_4=2;
}else{
if(isIE&&isWin&&!isOpera){
_4=ControlVersion();
}
}
}
}
}
return _4;
}
function DetectFlashVer(_c,_d,_e){
versionStr=GetSwfVer();
if(versionStr==-1){
return false;
}else{
if(versionStr!=0){
if(isIE&&isWin&&!isOpera){
tempArray=versionStr.split(" ");
tempString=tempArray[1];
versionArray=tempString.split(",");
}else{
versionArray=versionStr.split(".");
}
var _f=versionArray[0];
var _10=versionArray[1];
var _11=versionArray[2];
if(_f>parseFloat(_c)){
return true;
}else{
if(_f==parseFloat(_c)){
if(_10>parseFloat(_d)){
return true;
}else{
if(_10==parseFloat(_d)){
if(_11>=parseFloat(_e)){
return true;
}
}
}
}
}
return false;
}
}
}
function AC_AddExtension(src,ext){
if(src.indexOf("?")!=-1){
return src.replace(/\?/,ext+"?");
}else{
return src+ext;
}
}
function AC_Generateobj(_14,_15,_16){
var str="";
if(isIE&&isWin&&!isOpera){
str+="<object ";
for(var i in _14){
str+=i+"=\""+_14[i]+"\" ";
}
str+=">";
for(var i in _15){
str+="<param name=\""+i+"\" value=\""+_15[i]+"\" /> ";
}
str+="</object>";
}else{
str+="<embed ";
for(var i in _16){
str+=i+"=\""+_16[i]+"\" ";
}
str+="> </embed>";
}
document.write(str);
}
function AC_FL_RunContent(){
var ret=AC_GetArgs(arguments,".swf","movie","clsid:d27cdb6e-ae6d-11cf-96b8-444553540000","application/x-shockwave-flash");
AC_Generateobj(ret.objAttrs,ret.params,ret.embedAttrs);
}
function AC_SW_RunContent(){
var ret=AC_GetArgs(arguments,".dcr","src","clsid:166B1BCA-3F9C-11CF-8075-444553540000",null);
AC_Generateobj(ret.objAttrs,ret.params,ret.embedAttrs);
}
function AC_GetArgs(_1b,ext,_1d,_1e,_1f){
var ret=new Object();
ret.embedAttrs=new Object();
ret.params=new Object();
ret.objAttrs=new Object();
for(var i=0;i<_1b.length;i=i+2){
var _22=_1b[i].toLowerCase();
switch(_22){
case "classid":
break;
case "pluginspage":
ret.embedAttrs[_1b[i]]=_1b[i+1];
break;
case "src":
case "movie":
_1b[i+1]=AC_AddExtension(_1b[i+1],ext);
ret.embedAttrs["src"]=_1b[i+1];
ret.params[_1d]=_1b[i+1];
break;
case "onafterupdate":
case "onbeforeupdate":
case "onblur":
case "oncellchange":
case "onclick":
case "ondblclick":
case "ondrag":
case "ondragend":
case "ondragenter":
case "ondragleave":
case "ondragover":
case "ondrop":
case "onfinish":
case "onfocus":
case "onhelp":
case "onmousedown":
case "onmouseup":
case "onmouseover":
case "onmousemove":
case "onmouseout":
case "onkeypress":
case "onkeydown":
case "onkeyup":
case "onload":
case "onlosecapture":
case "onpropertychange":
case "onreadystatechange":
case "onrowsdelete":
case "onrowenter":
case "onrowexit":
case "onrowsinserted":
case "onstart":
case "onscroll":
case "onbeforeeditfocus":
case "onactivate":
case "onbeforedeactivate":
case "ondeactivate":
case "type":
case "codebase":
case "id":
ret.objAttrs[_1b[i]]=_1b[i+1];
break;
case "width":
case "height":
case "align":
case "vspace":
case "hspace":
case "class":
case "title":
case "accesskey":
case "name":
case "tabindex":
ret.embedAttrs[_1b[i]]=ret.objAttrs[_1b[i]]=_1b[i+1];
break;
default:
ret.embedAttrs[_1b[i]]=ret.params[_1b[i]]=_1b[i+1];
}
}
ret.objAttrs["classid"]=_1e;
if(_1f){
ret.embedAttrs["type"]=_1f;
}
return ret;
}

