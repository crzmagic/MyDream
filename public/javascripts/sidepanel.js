var sidePanel={
	messageClear:false,
	shareservice:"/toolbar/shareservices.php",
	loginservice:"/toolbar/loginservices.php",
	replyservice:"/toolbar/sharemsgservices.php",
	signupservice:"/sign_up_v3.php",
	interests_service:"/toolbar/interests_services.php",
	importPanel:false,
	hideForm:false,
	sending:false,
	viewedmsg:false,
	newacct:false,
	cid:"",
	sid:"",
	sendEmail:function(){
if(sidePanel.sending){
return false;
}
sidePanel.sending=true;
var _1="action=send";
if($("input.contacts:checked").size()){
var _2=$("input.contacts:checked");
}else{
var _2=$("input.manual:text");
}
for(var i=0,j=_2.length;i<j;i++){
if(_2[i].value!=""){
_1+="&contacts[]="+encodeURIComponent(_2[i].value);
}
}
_1+="&msg="+encodeURIComponent($("#msg").val());
_1+="&url="+encodeURIComponent($("#shareurl").val());
_1+="&from_email="+encodeURIComponent($("#from_email").val());
if($("#conversation").attr("checked")==true){
_1+="&conversation=true";
}
if($("#savecontacts").attr("checked")==true){
_1+="&savecontacts=true";
}
$("#sendBtn").attr("value","Sending...");
$.ajax({type:"POST",url:sidePanel.shareservice,data:_1,success:sidePanel.sendEmailCB});
},sendEmailCB:function(_5){
sidePanel.sending=false;
var _5=eval("("+_5+")");
if(_5.error){
$("#sendBtn").attr("value","Share now >");
$(_5.errors).each(function(i,_7){
$("#ERR_"+_7).show().wait(10000).fadeOut("slow");
});
}else{
parent.sidepanel.contractSidePanel();
$("ul.errors li").hide();
$("div.box").hide();
$("#success").show();
if(_5.cid){
sidePanel.cid=_5.cid;
$("#postConversation").show();
}
}
},importContacts:function(){
var _8="action=import";
_8+="&importuser="+$("#importuser").val();
_8+="&importpass="+$("#importpass").val();
_8+="&provider="+$("#provider").val();
$.ajax({type:"POST",url:sidePanel.shareservice,data:_8,success:sidePanel.importCB});
},importCB:function(_9){
var _9=eval("("+_9+")");
if(!_9.error){
$("#importerr").hide();
$("#importlogin").css("display","none");
var _a=$("#importList");
for(var i=0,j=_9.imports.length;i<j;i++){
var _d="contact[]";
var _e=$(document.createElement("input"));
var _f=$(document.createElement("label"));
_e.attr("type","checkbox");
_e.val(_9.imports[i]);
_e.attr("name",_d);
_e.attr("class","contacts");
_f.attr("for",_d);
_f.append(_e);
_f.append(_9.imports[i]);
_a.append(_f);
}
$("#imports").css("display","block");
$("#sendForm").css("display","block");
if(_9.email&&$("#from_email").val()==""){
$("#from_email").val(_9.email);
}
$("#scbox").css("display","block");
}else{
$("#importerr").text(_9.msg);
$("#importerr").show().wait(10000).fadeOut("slow");
}
},toggleImport:function(){
if(sidePanel.importPanel==false){
sidePanel.importPanel=true;
$("#contactmanager").css("display","block");
parent.sidepanel.expandSidePanel();
}else{
sidePanel.importPanel=false;
$("#contactmanager").css("display","none");
parent.sidepanel.contractSidePanel();
}
},openImport:function(){
if(sidePanel.importPanel==false){
sidePanel.importPanel=true;
$("#contactmanager").css("display","block");
parent.sidepanel.expandSidePanel();
}
},closeImport:function(){
if(sidePanel.importPanel==true){
sidePanel.importPanel=false;
$("#contactmanager").css("display","none");
parent.sidepanel.contractSidePanel();
}
},showManual:function(){
$("#importlogin").css("display","none");
$("#importmanual").css("display","block");
$("#importList").empty();
$("#imports").css("display","none");
$("#scbox").css("display","block");
if($("#sendForm").css("display")=="none"){
sidePanel.hideForm=true;
$("#sendForm").css("display","block");
}
return true;
},limitChars:function(_10,_11,_12){
var _13=$("#"+_10).val();
var _14=_13.length;
if(_14>_11){
$("#"+_12).html("0");
$("#"+_10).val(_13.substr(0,_11));
return false;
}else{
if(_11-_14){
$("#"+_12).html(_11-_14);
}else{
$("#"+_12).html("0");
}
return true;
}
},reply:function(){
params="h="+encodeURIComponent($("#h").val());
params+="&sid="+encodeURIComponent($("#sid").val());
params+="&cid="+encodeURIComponent($("#cid").val());
params+="&msg="+encodeURIComponent($("#msg").val());
params+="&from_email="+encodeURIComponent($("#from_email").val());
params+="&captcha="+encodeURIComponent($("#captcha").val());
if($("#privatemsg").attr("checked")==true){
params+="&privatemsg=1";
}
if($("#join").attr("checked")==true){
params+="&join=1";
}
if($("#skipthis").attr("checked")==true){
params+="&skipthis=1";
}
$("#sendBtn").attr("value","Sending...");
$.ajax({type:"POST",url:sidePanel.replyservice,data:params,success:sidePanel.replyCB});
},replyCB:function(_15){
var _15=eval("("+_15+")");
$("ul.errors li").hide();
if(_15.actions.length){
$(_15.actions).each(function(i,_17){
switch(_17){
case 100:
$("#sendForm").hide();
$("#messages").hide();
$("#signup").show();
$("#email").val($("#from_email").val());
return;
break;
case 101:
$("#sendForm").hide();
$("#messages").hide();
$("#captchaBox").show();
$("#captchaholder").replaceWith($("#captchaRow"));
return;
break;
case 102:
$("#captchaBox").hide();
$("#signup").show();
$("#email").val($("#from_email").val());
break;
case 200:
$(".box").hide();
if(sidePanel.newacct){
$("#success").show();
$("#interests").show();
}else{
if(_15.cid){
sidePanel.cid=_15.cid;
$("#postConversation").show();
}
$("#success").show();
$("#messages").show();
var _18="<li class=\"clearfix\" style=\"display:none\">";
if(_15.newmsg.imgid){
_18+="<img src=\"http://www.stumbleupon.com/superminipics/"+_15.newmsg.imgid+".jpg\" />";
}
_18+="<a href-\""+_15.newmsg.namelink+"\">"+_15.newmsg.name+"</a>";
_18+="<br />"+_15.newmsg.note+"</li>";
var _19=$(_18);
$("#shareMsgs").prepend(_19);
var _1a=parseInt($("#messagecount").text());
$("#messagecount").text(_1a+1);
_19.slideDown(500);
}
return;
break;
}
});
}
if(_15.errors.length){
$(_15.errors).each(function(i,err){
if(err==100){
parent.sidepanel.closeSidePanel();
}else{
if(err==104){
$("#captchaReload").trigger("click");
$("#captcha").val("");
}
$("#ERROR_"+err).show().wait(10000).fadeOut("slow");
}
});
}
},signup:function(){
params="ajax=1&action=json";
params+="&email="+$("#email").val();
params+="&nick="+$("#username").val();
params+="&password="+$("#password").val();
params+="&passwordr="+$("#passwordr").val();
params+="&bmonth="+$("#bmonth").val();
params+="&bday="+$("#bday").val();
params+="&byear="+$("#byear").val();
params+="&captcha="+$("#captcha").val();
$.ajax({type:"POST",url:sidePanel.signupservice,data:params,success:sidePanel.signupCB});
},signupCB:function(_1d){
var _1d=eval("("+_1d+")");
if(_1d&&_1d.length){
$(_1d).each(function(i,err){
if(err==109){
$("#captchaReload").trigger("click");
$("#captcha").val("");
}
$("#SUERR_"+err).show().wait(10000).fadeOut("slow");
});
}else{
if($("#interests").size()>0){
sidePanel.newacct=true;
}
sidePanel.reply();
}
},saveInts:function(){
var _20="action=saveinterests";
var _21=$("input.interests:checked");
for(var i=0,j=_21.length;i<j;i++){
if(_21[i].value!=""){
_20+="&interests[]="+_21[i].value;
}
}
$.ajax({type:"POST",url:sidePanel.interests_service,data:_20,success:sidePanel.saveIntsCB});
},saveIntsCB:function(_24){
parent.window.location="/toolbar/";
parent.window.location.reload();
},init:function(){
var _25=$("#paneltype").val();
switch(_25){
case "login":
$("#password").defaultvalue("Password");
$("#username").defaultvalue("Your email or username");
$("#loginSubmit").click(function(){
var _26=$("#username").val();
var _27=$("#password").val();
sidePanel.login(_26,_27);
});
break;
case "twitter":
var _28=$("#publicid").val();
$("#twitterShareSingleSite").click(function(){
var _29=parent.webtb.sharedRequestVars();
_29+="&action=twitter_share&publicid="+_28;
jQuery.post(parent.toolbarConf.serviceUrl,_29,function(){
parent.webtb.toggleSidePanel("twitter");
});
});
$("#twitterAutoShare").click(function(){
var _2a="ftoken="+parent.toolbarConf.authToken;
if($("#twitterAutoShare").attr("checked")==true){
_2a+="&action=twitter_autoshare";
}else{
_2a+="&action=twitter_autoshare_off";
}
jQuery.post(parent.toolbarConf.serviceUrl,_2a);
});
$("#twitterLogout").click(function(){
var _2b="ftoken="+parent.toolbarConf.authToken+"&action=twitter_logout";
jQuery.post(parent.toolbarConf.serviceUrl,_2b);
parent.webtb.toggleSidePanel("twitter");
});
break;
case "sharemsg":
$("#replyBtn").click(function(){
sidePanel.reply();
});
$("#signupBtn").click(function(){
sidePanel.signup();
});
$("#captchaBtn").click(function(){
sidePanel.reply();
});
$("#intsBtn").click(function(){
sidePanel.saveInts();
});
$("#SelectAll").click(function(){
if($("#SelectAll").attr("checked")==true){
$("input.interests").attr("checked",true);
}else{
$("input.interests").attr("checked",false);
}
});
$("#msg").keyup(function(){
sidePanel.limitChars("msg",140,"charLimit");
});
$("#msg").defaultvalue("Enter your reply message");
sidePanel.viewedmsg=$("#shareMsgs li:first");
$("#scrollup").click(function(){
var _2c=sidePanel.viewedmsg;
var _2d=_2c.height()+20;
var _2e=$("#shareMsgs").height();
while(_2d<_2e){
if(_2c.prev().size()){
_2c=_2c.prev();
_2d+=_2c.height()+20;
}else{
break;
}
}
if(sidePanel.viewedmsg!=_2c){
$("#scrollup").animate({backgroundPosition:"0px 2px"},50).animate({backgroundPosition:"0px 0px"},50);
sidePanel.viewedmsg=_2c;
$("#shareMsgs").scrollTo(_2c,200);
}
});
$("#scrolldown").click(function(){
var _2f=sidePanel.viewedmsg;
var _30=_2f.height()+20;
var _31=$("#shareMsgs").height();
while(_30<_31){
if(_2f.next().size()){
_2f=_2f.next();
_30+=_2f.height()+20;
}else{
break;
}
}
if(sidePanel.viewedmsg!=_2f){
$("#scrolldown").animate({backgroundPosition:"0px 2px"},50).animate({backgroundPosition:"0px 0px"},50);
sidePanel.viewedmsg=_2f;
$("#shareMsgs").scrollTo(_2f,200);
}
});
break;
default:
$("#provider").change(function(){
if(this.value=="manual"){
sidePanel.showManual();
return true;
}
$("input.manual").val("");
$("#importmanual").css("display","none");
$("#importlogin").css("display","block");
$("#scbox").css("display","none");
$("p.importerror").text("");
$("#importList").empty();
$("#imports").css("display","none");
if(sidePanel.hideForm){
$("#sendForm").css("display","none");
}
});
$("#SelectAll").click(function(){
if($("#SelectAll").attr("checked")==true){
$("#contactList input").attr("checked",true);
}else{
$("#contactList input").attr("checked",false);
}
});
$("#contactList input").click(function(){
$("#SelectAll").attr("checked",false);
});
$("#sendBtn").click(function(){
sidePanel.sendEmail();
});
$("#importBtn").click(function(){
sidePanel.importContacts();
});
$("#addmore").click(function(){
sidePanel.openImport();
});
$("#addHotmail").click(function(){
sidePanel.openImport();
$("#provider option").attr("selected","");
$("#provider option[value='hotmail']").attr("selected","true");
$("#provider").trigger("change");
});
$("#addYahoo").click(function(){
sidePanel.openImport();
$("#provider option").attr("selected","");
$("#provider option[value='yahoo']").attr("selected","true");
$("#provider").trigger("change");
});
$("#addGmail").click(function(){
sidePanel.openImport();
$("#provider option").attr("selected","");
$("#provider option[value='gmail']").attr("selected","true");
$("#provider").trigger("change");
});
$("#addAOL").click(function(){
sidePanel.openImport();
$("#provider option").attr("selected","");
$("#provider option[value='aol']").attr("selected","true");
$("#provider").trigger("change");
});
$(".closeImport").click(function(){
sidePanel.closeImport();
});
$(".shareAgain").click(function(){
parent.sidepanel.openSidePanel(window.location);
});
$("#importuser").defaultvalue("Enter your username");
$("#importpass").defaultvalue("Password");
$("#msg").defaultvalue("Optional personal message");
$("#manual_add").click(function(){
sidePanel.showManual();
$("#provider").attr("selectedIndex",4);
});
$("#msg").keyup(function(){
sidePanel.limitChars("msg",140,"charLimit");
});
$("input.contacts").click(function(){
var _32=$("input.contacts:checked").size();
$("#sharedcontacts_count").html(_32);
});
break;
}
$(".close").click(function(){
parent.sidepanel.closeSidePanel();
});
}};
$(document).ready(function(){
sidePanel.init();
});

