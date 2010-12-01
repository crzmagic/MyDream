function submitTheForm(id){
var f=document.getElementById(id);
f.submit();
}
function add_tag(){
var _3=document.getElementById("addtag");
var _4=_3.options[_3.selectedIndex].value;
if(document.getElementById("tagtext").value!=""){
document.getElementById("tagtext").value+=", ";
}
document.getElementById("tagtext").value+=_4;
}
function getkey(e){
var _6;
var _7=0;
if(e==null){
_6=event.keyCode;
if(typeof (event.srcElement.type)!="undefined"&&(event.srcElement.id=="stumblesearch"||event.srcElement.id=="searchtext"||event.srcElement.id=="tagtext")){
return true;
}
}else{
if(e.altKey||e.ctrlKey){
return true;
}
_6=e.which;
if(typeof (e.target.type)!="undefined"&&(e.target.id=="stumblesearch"||e.target.id=="searchtext"||e.target.id=="tagtext")){
return true;
}
}
var _8=String.fromCharCode(_6).toLowerCase();
var _9=document.layers?e.which:document.all?event.keyCode:document.getElementById?e.keyCode:0;
if(_9==39){
change_tag(10);
return true;
}
if(_9==37){
change_tag(-10);
return true;
}
return true;
}
document.onkeydown=getkey;
function change_adult_filter(_a){
var _b="By setting the Content Filter to include R/X-Rated content, you understand \nand acknowledge the following:\nThat you are at least 18 years old\nThat with the Content Filter set to R/X, you may be exposed to adult, \npornographic and other potentially offensive content. \nIF YOU DO NOT WANT TO BE EXPOSED TO PORNOGRAPHIC AND OTHERWISE \nOFFENSIVE CONTENT, DO NOT SET THE CONTENT FILTER TO R/X.\nSetting the Content Filter to include R/X-Rated content in no way affects \nyour acceptance of the general Terms of Service of StumbleUpon:\nhttp://www.stumbleupon.com/terms.html\n\nClick OK if you agree to these terms:";
if(confirm(_b)){
var _c="http://www"+SERVERDOM+"/change_adult_filter.php?filter="+_a+"&url="+escape(document.location.href);
document.location=_c;
}
}
function delete_comment(_d){
if(confirm("Are you sure you want to delete this comment?")){
window.document.location="http://"+SERVERNAME+"/user.php?stumbler="+stumbler+"&deletecomment="+_d;
}
}
function ignore(_e){
if(confirm("By blocking this person, you will no longer receive messages or pages from them (you can unblock this person from your Network tab). Are you sure you want to do this?")){
window.document.location="http://"+SERVERNAME+"/aboutme.php?stumbler="+stumbler+"&ignore="+_e;
}
}
function add_comment(){
document.getElementById("stats").style.display="none";
document.getElementById("addcomment").style.display="";
document.getElementById("commenthr").style.display="";
}
function change_tag2(_f){
if(document.getElementById(_f)==null){
var _10=document.getElementsByTagName("option");
for(var i=0;i<_10.length;i++){
if(_10[i].innerHTML=="-----------"){
_10[i].selected=true;
_10[i].id=_f;
_10[i].setAttribute("count",1);
}
}
}else{
document.getElementById(_f).selected=true;
}
change_tag(0);
}
var is_loading=0;
function toblog(){
change_tag2("blog");
}
function change_tag(_12){
if(is_loading){
return;
}
if(_12<0){
if(document.getElementById("prev").style.display=="none"){
return;
}
}
if(_12>0){
if(document.getElementById("next").style.display=="none"){
return;
}
}
if(document.getElementById("addcomment")!=null){
document.getElementById("addcomment").style.display="none";
document.getElementById("commenthr").style.display="none";
}
if(_12==0){
offset=0;
}else{
offset+=_12;
}
if(offset<0){
offset=0;
}
if(offset>5000){
offset=5000;
}
if((logged_in==0)||(is_editing)){
var _13=document.getElementById("changetag");
var _14=_13.options[_13.selectedIndex].innerHTML;
var _15="/";
if(_14=="-Entire Blog"){
_15+="";
}else{
if(_14=="-Pages I Like"){
_15+="favorites/";
}else{
if(_14=="-Videos"){
_15+="tag/video/";
}else{
if(_14=="-People I Like"){
_15+="tag/stumblers/";
}else{
if(_14=="-Top Picks"){
_15+="picks/";
}else{
if(_14=="-Tag Cloud"){
_15+="tags/";
}else{
if(_14=="-Discoveries"){
_15+="discoveries/";
}else{
if(_14=="-Pages I Dislike"){
_15+="bads/";
}else{
if(_14=="-Stumbles"){
_15+="stumbles/";
}else{
var tag=_13.options[_13.selectedIndex].innerHTML;
var _17="";
for(var i=0;i<tag.length;i++){
if(tag.charCodeAt(i)!=183){
_17+=tag[i];
}else{
break;
}
}
tag=_17;
_15+="tag/"+tag+"/";
}
}
}
}
}
}
}
}
}
if(offset!=0){
if(_14=="-Entire Blog"){
_15+="archive/";
}
_15+=offset+"/";
}
document.location.href=_15;
return;
}
if(offset>0){
document.getElementById("greyprev").style.display="none";
document.getElementById("prev").style.display="";
document.getElementById("greyprev2").style.display="none";
document.getElementById("prev2").style.display="";
}else{
document.getElementById("greyprev").style.display="";
document.getElementById("prev").style.display="none";
document.getElementById("greyprev2").style.display="";
document.getElementById("prev2").style.display="none";
}
var _13=document.getElementById("changetag");
var _14=_13.options[_13.selectedIndex].innerHTML;
var _19;
if(_14=="-Entire Blog"){
_19=0;
}else{
if(_14=="-Pages I Like"){
_19=1;
}else{
if(_14=="-People I Like"){
_19=2;
}else{
if(_14=="-Videos"){
_19=3;
}else{
if(_14=="-Pages We Both Like"){
_19=4;
}else{
if(_14=="-Pages I Dislike"){
_19=5;
}else{
if(_14=="-People We Both Like"){
_19=6;
}else{
if(_14=="-Stumbles"){
_19=7;
}else{
if(_14=="-Top Picks"){
_19=8;
}else{
if(_14=="-Tag Cloud"){
_19=9;
}else{
if(_14=="-Discoveries"){
_19=10;
}else{
_19=3;
}
}
}
}
}
}
}
}
}
}
}
if(_19!=0||offset!=0){
document.getElementById("stats").style.display="none";
}else{
document.getElementById("stats").style.display="";
}
if(_19!=oldmode){
offset=0;
}
oldmode=_19;
var _1a="display_urls.php";
var _1b="id="+id+"&mode="+_19;
if(offset!=0){
_1b+="&offset="+offset;
}
var _1c=_13.options[_13.selectedIndex].id;
var _1d=_13.options[_13.selectedIndex].getAttribute("count");
var _1e=offset+1;
var _1f=offset+10;
if(_1f>_1d){
_1f=_1d;
}
document.getElementById("numresults").innerHTML=_1e+"-"+_1f;
document.getElementById("numresults2").innerHTML=_1e+"-"+_1f;
if(offset+10<_1d){
document.getElementById("greynext").style.display="none";
document.getElementById("next").style.display="";
document.getElementById("greynext2").style.display="none";
document.getElementById("next2").style.display="";
}else{
document.getElementById("greynext").style.display="";
document.getElementById("next").style.display="none";
document.getElementById("greynext2").style.display="";
document.getElementById("next2").style.display="none";
}
if(_19==2){
_1c=44;
}
_1b+="&tagid="+_1c;
var _20=function(_21){
is_loading=0;
document.getElementById("loading").innerHTML="";
var _22=document.getElementById("displayurls");
_22.innerHTML=_21.responseText;
document.getElementById("pages").focus();
};
var _23=new XHConn();
if(window.scrollBy){
window.scrollBy(0,-10000);
}
is_loading=1;
document.getElementById("loading").innerHTML="...";
_23.connect(_1a,"GET",_1b,_20);
if(logged_in==1){
var _24=document.getElementById("stumblethru");
var _25="mode=user";
if(_19==3){
if(_14=="-Videos"){
message=nickname+"'s videos";
_25+="&tag=video";
}else{
messages=_14.split(/[^A-Za-z0-9-]/);
message=nickname+"'s "+messages[0];
_25+="&tag="+messages[0];
}
}else{
message=nickname;
}
_24.innerHTML="<a ondblclick=\"stumble_thru\" href=\"http://www.stumbleupon.com/through.php?"+_25+"&user="+nickname+"\"> "+message+"</a></span>";
}
}
function showAllConvos(obj){
if(YAHOO.util.Dom.hasClass(obj,"toggledOn")){
var _27=YAHOO.util.Dom.getElementsByClassName("shownConvos");
YAHOO.util.Dom.addClass(_27,"hidden");
YAHOO.util.Dom.removeClass(_27,"shownConvos");
YAHOO.util.Dom.removeClass(obj,"toggledOn");
}else{
var _27=YAHOO.util.Dom.getElementsByClassName("hidden");
YAHOO.util.Dom.addClass(_27,"shownConvos");
YAHOO.util.Dom.removeClass(_27,"hidden");
YAHOO.util.Dom.addClass(obj,"toggledOn");
}
}
var flagOK=true;
function flagUser(_28,_29,_2a){
var _2b={success:function(o){
if(o.responseText=="OK"){
var flg=document.getElementById("userflag"+_29);
if(flg){
var bld=flg.style.fontWeight=="bold"?"normal":"bold";
var sze=flg.style.fontWeight=="bold"?"100%":"120%";
flg.style.fontWeight=bld;
flg.style.fontSize=sze;
}
}else{
if(o.responseText=="SELF_FLAG"){
alert("You cannot flag yourself");
}
}
}};
if(flagOK){
flagOK=false;
var _30="act=flag_user&fauth="+_2a+"&flag="+_29+"&fuser="+_28;
YAHOO.util.Connect.asyncRequest("POST","/moderate_user.php",_2b,_30);
setTimeout("canFlag()",200);
}
}
function canFlag(){
flagOK=true;
}
function getFlags(_31,_32){
var _33={success:function(o){
try{
var _35=eval("("+o.responseText+")");
for(i=0,max=_35.length;i<max;i++){
var flg=document.getElementById("userflag"+_35[i]);
if(flg){
flg.style.fontWeight="bold";
flg.style.fontSize="120%";
}
}
}
catch(e){
return false;
}
},failure:function(o){
}};
var _38="act=get_flags&fauth="+_32+"&fuser="+_31;
YAHOO.util.Connect.asyncRequest("POST","/moderate_user.php",_33,_38);
}
function hideBetaMessage(){
var now=new Date();
now.setTime(now.getTime()+7*24*60*60*1000);
_setUserCookie("hide_beta_msg","1",now,"/");
var bt=document.getElementById("paneBetaTip");
bt.style.display="none";
}
function _setUserCookie(_3b,_3c,_3d,_3e,_3f,_40){
var _41=_3b+"="+escape(_3c)+((_3d)?"; expires="+_3d.toGMTString():"")+((_3e)?"; path="+_3e:"")+((_3f)?"; domain="+_3f:"")+((_40)?"; secure":"");
document.cookie=_41;
}
function _readCookie(_42){
var _43=_42+"=";
var ca=document.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_43)==0){
return c.substring(_43.length,c.length);
}
}
return null;
}
function navigate_blog(e){
var _48;
if(e==null){
if(typeof (event.srcElement.type!="undefined")&&(event.srcElement.type=="text"||event.srcElement.type=="textarea")){
return true;
}
_48=event.keyCode;
if(typeof (event.srcElement.type)!="undefined"&&(event.srcElement.id=="search_q"||event.srcElement.id=="stumblesearch"||event.srcElement.id=="searchtext"||event.srcElement.id=="tagtext"||event.srcElement.id=="blogContent"||event.srcElement.id=="blogContentFCK"||event.srcElement.id=="newtags"||event.srcElement.id=="addTag"||event.srcElement.id=="qmsg_ta")){
return true;
}
}else{
if(e.altKey||e.ctrlKey){
return true;
}
_48=e.which;
if(typeof (e.target.type!="undefined")&&(e.target.type=="text"||e.target.type=="textarea")){
return true;
}
if(typeof (e.target.type)!="undefined"&&(e.target.id=="search_q"||e.target.id=="stumblesearch"||e.target.id=="searchtext"||e.target.id=="tagtext"||e.target.id=="blogContent"||e.target.id=="blogContentFCK"||e.target.id=="newtags"||e.target.id=="addTag"||e.target.id=="qmsg_ta")){
return true;
}
}
var key=String.fromCharCode(_48).toLowerCase();
var _4a=document.layers?e.which:document.all?event.keyCode:document.getElementById?e.keyCode:0;
var n=null;
if(_4a==39){
if(n=document.getElementById("paginationNext")){
document.location.href=n.href;
}
return true;
}
if(_4a==37){
if(n=document.getElementById("paginationPrevious")){
document.location.href=n.href;
}
return true;
}
return true;
}
function checkMessaging(){
var _4c={success:function(o){
var _4e=o.responseText;
if(_4e=="-1"){
}else{
if(_4e!="1"){
alert(_4e);
}else{
toggleDisplay("paneNewMsg");
}
}
},failure:function(o){
},timeout:10000};
YAHOO.util.Connect.setForm("quickMessageForm");
var _50=YAHOO.util.Connect.asyncRequest("POST","/message_ok.php",_4c);
}
function saveState(_51){
var e=document.getElementById(_51);
var val=e.style.display=="none"?0:1;
_setUserCookie("ds_"+_51,val,"","/",SERVERDOM);
}
function reportSpamMessage(_54,_55,_56,_57,_58){
var msg="Are you sure you wish to report this message as spam?\n\nThe message will be deleted and reported to StumbleUpon Community Moderation.";
if(confirm(msg)){
document.location.href="http://www"+SERVERDOM+"/reportspam.php?from="+_54+"&offender="+_55+"&message="+_56+"&fauth="+_57+"&offset="+_58;
}
}
function user_thumbup(id,_5b){
jQuery.post("/",{source:"user_friends",action:"userRate",ftoken:_5b,userid:id});
}

