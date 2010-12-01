var webtb=
{
  request:
  {
  }
  ,healthyUrlTimer:0,healthyUrlTimerLong:0,
  cache:
  {
  }
  ,precache:[],//预取的内容存放在这个变量中

  //设置主工作区内容
  setContent:function(_1)
  {
    var _2=parent.stumbleContent;
    if(_2)
    {
      _2.focus();
      toolbarState.expectingLoad=true;
      _2.location.replace(_1.url);
      toolbarState.stumble=_1;
      if(_1.stumblethru)
      {
        webtb.setModeLabel(_1.stumblethru);
      }
      else
      {
        if(_1.contextual)
        {
          if(toolbarState.skipcontext)
          {
            toolbarState.skipcontext=false;
          }
          else
          {
            webtb.setModeLabel(_1.contextual);
          }
        }
      }
      webtb.setSiteReviews();
      webtb.setInfoLink(_1);
      $("#closeButton").attr("href",_1.url);
      webtb.setThumbUp(false);
      webtb.setThumbDown(false);
      if(_1.rating=="down")
      {
        webtb.setThumbDown(true);
      }
      else
      {
        if(_1.rating=="up")
        {
          webtb.setThumbUp(true);
        }
      }
      toolbarState.thumb=_1.rating;
      webtb.setRequestState();
    }
  }
  ,

  //设置浏览模式 和 模式选择框的显示内容
  setStumbleMode:function(_3,_4)
  {
    if(toolbarConf.modes[_3])
    {
      webtb.precache=[];
      toolbarState.stumblesThisMode=0;
      conf=toolbarConf.modes[_3];
      webtb.setModeLabel(conf.label);
      if(!_4)
      {
        webtb.setUrlLabel(conf.urlLabel);
      }
      toolbarState.way=conf.way;
      toolbarState.mode=_3;
      toolbarState.source=conf.source;
      if(_3!="supr")
      {
        toolbarState.supr=false;
      }
    }
  }
  ,setUrlLabel:function(_5)
  {
    if(!toolbarState.noHistory)
    {
      util.clearHash();
      webtb.request[_5]=true;
      util.setHash(webtb.request);
    }
    else
    {
      toolbarState.noHistory=false;
    }
  }

  //设置 选择兴趣类型stumbleModeLabel 的显示内容
  ,setModeLabel:function(_6)
  {
    if(_6.length&&_6.length>20)
    {
      _6=_6.substr(0,20)+"...";
    }
    $("#stumbleModeLabel").html(_6);
  }

  //设置回复次数和查看具体回复的链接
  ,setSiteReviews:function()
  {
    if(toolbarState.stumble.numreviews>0)
    {
      $("#siteReviews").html(toolbarState.stumble.numreviews);
    }
    else
    {
      $("#siteReviews").html("");
    }
    $("#siteReviews").attr("href",toolbarState.stumble.info_link);
  }

  //设置回复链接的指向
  //如果传入的是无效URL，如果点击的话，则从提示直接生成该页面
  //否则的话，修改回复次数 的链接指向
  ,setInfoLink:function(_7)
  {
    if(_7.url_status=="unknown_url"&&typeof _7.stumblethru!="undefined")
    {
      $("#siteReviews").attr("href","/stumbleit.php?url="+_7.url);
    }
    else
    {
      $("#siteReviews").attr("href",_7.info_link);
    }
  }

  //实现好评按钮的显示
  //如果好评，则显示好评按钮，同时隐藏差评按钮，失效差评按钮
  //否则把差评按钮显示出来  仅仅是操作图片！！！
  ,setThumbUp:function(up)
  {
    if(up)
    {
      webtb.setThumbDown(false);
      $("#linkThumb img").attr("src","/images/greenthumbup.gif");
      $("#linkThumbDown").hide();
    }
    else
    {
      $("#linkThumb img").attr("src","/images/thumbup.gif");
      $("#linkThumbDown").show();
    }
  }
  ,setThumbDown:function(_9)
  {
    if(_9)
    {
      webtb.setThumbUp(false);
      $("#linkThumbDown img").attr("src","/images/icon_thumb_red_40.png");
    }
    else
    {
      $("#linkThumbDown img").attr("src","/images/thumbdown.gif");
    }
  }
  ,modeLabelClicked:function(e)
  {
    util.debug("Mode label clicked...");
  }
  ,setNumFavorites:function(_b,_c)
  {
    var _d=$("#numFavorites");
    var _e=parseInt(_d.html());
    if(!_e)
    {
      _e=0;
    }
    if(typeof (_b)=="number")
    {
      _e=_b;
    }
    else
    {
      if(_c)
      {
        _e=_e-1;
      }
      else
      {
        _e=_e+1;
      }
    }
    if(_e>0)
    {
      _d.fadeOut("slow",function()
      {
        _d.html(""+_e+"&nbsp;");
        _d.fadeIn("slow");
      }
      );
    }
  }
  ,resetStumble:function()
  {
    webtb.clearHealthCheckTimers();
    toolbarState.ratingLock=false;
    toolbarState.stumble=false;
    toolbarState.thumb="none";
  }
  //核心功能
  ,stumble:function(e)
  {
    util.debug("@211$$" + toolbarState.mode);
    
    var _10=new Date().valueOf();//取当前时间的毫秒数
    //两次浏览的间隔应该大于750毫秒
    if(toolbarState.clickTs["stumble"]&&(toolbarState.clickTs["stumble"]>(_10-750)))
    {
      return false;
    }
    //设置本次浏览时间
    toolbarState.clickTs["stumble"]=_10;
    
    if(toolbarState.waitingOnPrefetch)
    {
      return false;
    }
    $("#twitterShareLi").hide();
    $("#facebookShareLi").hide();
    $("#linkLiteReg").hide();
    var _11=parent.stumbleContent;//界面中主工作区
    _11.location.replace("about:blank");//初始化为空白页面

    if(toolbarState.mode=="general")
    {
      $("#allButton").hide();//X按钮关闭
      $("#selectButton").show();//下拉选择按钮展现
    }
    else
    {
      $("#allButton").show();
      $("#selectButton").hide();
    }
    webtb.trackWebStumble();
    webtb.resetStumble();

    //浏览视频的话，转到专用处理函数
    if(toolbarState.mode=="video")
    {
      return webtb.stumbleVideo();
    }
    
    var _12=webtb.sharedRequestVars();
    _12+=webtb.stumbleModeVars();
    
    if(toolbarState.show_url=="show_url")
    {
      if(toolbarState.supr)
      {
        _12+="&modifier=supr&supr="+toolbarState.supr;
      }
      if(toolbarState.pid)
      {
        _12+="&way=show_url&pid="+toolbarState.pid;
      }
      else
      {
        _12+="&way=show_url&url="+util.escaped(toolbarState.url);
      }
      delete toolbarState.show_url;
    }
    
    if(toolbarState.mode=="supr"&&toolbarState.supr)
    {
      _12+="&supr="+toolbarState.supr;
    }
    if(!toolbarState.userData)
    {
      _12+="&secondary=userdata";
    }
    try
    {
      //缓存中有内容的话，先从缓存中取，没有再从服务器取到缓存
      if(webtb.precache&&webtb.precache.length)
      {
        for(var i in webtb.precache)
        {
          var _14=webtb.precache[i];
          webtb.stumbleHandler(_14,"from_precache");
          webtb.precache.splice(i,1);
          break;//TODO:这里是什么意思？？
        }
        if(webtb.precache.length==0)
        {
          util.debug("Look-ahead fetching new prestumbles");
          var _15="";
          if(_14)
          {
            _15=_14.publicid;
          }
          webtb.prefetchStumbles(_15);//从服务器取到缓存中
        }
      }
      else
      {
        toolbarState.stumbleCount++;
        if(toolbarState.stumbleCount>2&&$("#linkStumble").hasClass("btnShine"))
        {
          $("#linkStumble").removeClass("btnShine"); //TODO: 什么意思？
        }
        
	util.debug("@368::_12=" + _12);
        jQuery.post(toolbarConf.serviceUrl,_12,function(_16)
        {
          util.debug("@371::_16=" + _16);
          if(toolbarConf.prefetch&&toolbarState.stumblesThisMode>toolbarConf.prefetchingBegins)
          {
            webtb.stumbleHandler(_16,"prefetch_after");
          }
          else
          {
            webtb.stumbleHandler(_16);
          }
        }
        );
      }
      
      toolbarState.stumblesThisMode+=1;
    }
    catch(e)
    {
      window.location="/topic/error";
    }
    
  }

  //预先从服务器取下一个网站内容
  ,prefetchStumbles:function(_17)
  {
    util.debug("@332$$" + prefetch);
    if(typeof prefetch=="undefined")
    {
      return false;
    }
    util.debug("Prefetching stumbles...");
    var _18=webtb.sharedRequestVars();
    _18+=webtb.stumbleModeVars();
    _18+="&modifier=prefetch";
    toolbarState.waitingOnPrefetch=true;
    if(_17)
    {
      _18+="&current="+_17;
    }
    jQuery.post(toolbarConf.serviceUrl,_18,webtb.populatePrecache);
  }
  ,showStumble:function(url)
  {
    if(webtb.cache[url])
    {
      util.debug("webtb.cache hit");
    }
    toolbarState.url=url;
    toolbarState.show_url="show_url";
    toolbarState.pid=false;
    webtb.stumble();
  }
  //
  ,showPid:function(pid)
  {
    toolbarState.pid=pid;
    toolbarState.show_url="show_url";
    webtb.stumble();
  }
  ,stumbleVideo:function()
  {
    webtb.resetStumble();
    if(toolbarState.mode=="video"&&typeof (window.stumbleContent.click_stumble)=="function")
    {
      window.stumbleContent.click_stumble();
    }
    else
    {
      parent.stumbleContent.location.href="/video.php?webtb";
    }
    webtb.setStumbleMode("video");
  }
  ,stumblePeople:function()
  {
    webtb.resetStumble();
    parent.stumbleContent.location.href="/next_stumbler.php?webtb=1&tok="+toolbarConf.authToken;
    webtb.setStumbleMode("people");
  }
  ,thumb:function(e)
  {  	
    var _1c=new Date().valueOf();
    if(toolbarState.clickTs["thumb"]&&(toolbarState.clickTs["thumb"]>(_1c-750)))
    {
      return false;
    }
    toolbarState.clickTs["thumb"]=_1c;
    if(toolbarState.ratingLock)
    {
      return false;
    }

		util.debug("@454");
		util.debug("toolbarState.userData.loggedIn=" + toolbarState.userData.loggedIn);
		util.debug("toolbarState.userData.nickname=" + toolbarState.userData.nickname);
		util.debug("toolbarState.stumble=" + toolbarState.stumble);
		util.debug("toolbarState.stumble.url_status=" + toolbarState.stumble.url_status);
    if(toolbarState.userData.loggedIn&&toolbarState.userData.nickname&&toolbarState.thumb=="up")
    {
      toolbarState.ratingLock=true;
      var _1d=webtb.sharedRequestVars();
      _1d+="&way=unrate&url="+util.escaped(toolbarState.stumble.url);
      jQuery.post(toolbarConf.serviceUrl,_1d,webtb.unrateHandler);
      toolbarState.thumb="none";
      webtb.setThumbUp(false);
      return;
    }
    else
    {
      if(toolbarState.stumble&&toolbarState.stumble.url_status=="unknown_url")
      {
        var _1e="/discovery.php?in_webtb=lb&url="+toolbarState.stumble.url;
        modalBoxFrame.modalBox.open("discovery",_1e);
        $("#modalBoxFrame").css("left","100px");
      }
      else
      {
        if(toolbarState.userData.loggedIn&&toolbarState.userData.nickname)
        { 
        	util.debug("@481");
          $("#linkLiteRegLabel").html("Write a review");
          $("#linkLiteReg").attr("title","Write a review about this site");
          $("#linkLiteReg").attr("href",toolbarState.stumble.info_link);
          $("#linkLiteReg").show("fast",function()
          {
            $("#linkLiteRegLabel").fadeOut("slow",function()
            {
              $("#linkLiteRegLabel").fadeIn("slow");
            }
            );
          }
          );
        }
        else
        { 
          if(toolbarState.showlogin&&modalBoxFrame.modalBox.mode!="login")
          {
            toolbarState.loggedOutLike=true;
            modalBoxFrame.modalBox.open("login");
            $(modalBoxFrame).focus();
            modalBoxFrame.$("#mb_username").focus();
          }
        }
      }
    }

    if(toolbarState.stumble&&(toolbarState.onPage||toolbarState.expectingLoad)&&toolbarState.stumble.url_status!="unknown_url")
    {
      if(toolbarState.thumb=="none"||toolbarState.thumb=="down")
      {
      	util.debug("@512");
        var _1d=webtb.sharedRequestVars();
        _1d+="&way=thumb&url="+util.escaped(toolbarState.stumble.url);
        if(toolbarState.partner)
        {
          _1d+="&partner="+toolbarState.partner;
        }
        toolbarState.ratingLock=true;
        webtb.setThumbUp(true);
        jQuery.post(toolbarConf.serviceUrl,_1d,webtb.thumbHandler);
        toolbarState.thumb="up";
      }
    }
    else
    {
      if(toolbarState.mode=="video"&&typeof (window.stumbleContent.rate_site)=="function")
      {
        toolbarState.thumb="up";
        window.stumbleContent.rate_site("up");
      }
    }
  }
  ,thumbDown:function(e)
  {
    var _20=new Date().valueOf();
    if(toolbarState.clickTs["thumb_down"]&&(toolbarState.clickTs["thumb_down"]>(_20-750)))
    {
      return false;
    }
    toolbarState.clickTs["thumb_down"]=_20;
    if(toolbarState.ratingLock)
    {
      return false;
    }
    if(toolbarState.stumble&&(toolbarState.onPage||toolbarState.expectingLoad)&&toolbarState.stumble.url_status!="unknown_url")
    {
      toolbarState.ratingLock=true;
      if(toolbarState.thumb=="down")
      {
        var _21=webtb.sharedRequestVars();
        _21+="&way=unrate&url="+util.escaped(toolbarState.stumble.url);
        jQuery.post(toolbarConf.serviceUrl,_21,webtb.unrateHandler);
        webtb.setThumbDown(false);
        toolbarState.thumb="none";
      }
      else
      {
        if(toolbarState.thumb=="none"||toolbarState.thumb=="up")
        {
          var _21=webtb.sharedRequestVars();
          _21+="&way=thumbDown&url="+util.escaped(toolbarState.stumble.url);
          if(toolbarState.partner)
          {
            _21+="&partner="+toolbarState.partner;
          }
          webtb.setThumbDown(true);
          jQuery.post(toolbarConf.serviceUrl,_21,webtb.thumbDownHandler);
          toolbarState.thumb="down";
        }
      }
    }
  }
  ,toggleSidePanel:function(_22)
  {
    var _23=toolbarState.sidePanelAction;
    toolbarState.sidePanelAction=_22;
    if(!toolbarState.sidePanelOpen)
    {
      toolbarState.sidePanelOpen=true;
      webtb.updateSidePanel();
    }
    else
    {
      if(_22==_23)
      {
        toolbarState.sidePanelOpen=false;
      }
      else
      {
        webtb.updateSidePanel();
      }
    }
  }
  //打开右侧边栏
  ,contractStumbleFrame:function()
  {
    webtb.restoreStumbleFrame();
    toolbarState.sidePanelOpen=true;
    var _24=$(window).width()-$("#sidePanel").width();
    $("#stumbleFrame").width(_24);
  }
  //关闭右侧边栏
  ,restoreStumbleFrame:function()
  {
    toolbarState.sidePanelOpen=false;
    $("#stumbleFrame").css("width","100%");
  }
  ,updateSidePanel:function()
  {
    way=toolbarState.sidePanelAction;
    var src="/topic/share?url="+encodeURIComponent(toolbarState.stumble.url);
    webtb.restoreStumbleFrame();
    if(way)
    {
      switch(way)
      {
        case "twitter":
        src="/topic/share?way=twitter&url="+encodeURIComponent(toolbarState.stumble.url);
        break;
        case "twitter-authorize-success":
        src="/topic/share?way=twitter&authorize_success=1&url="+encodeURIComponent(toolbarState.stumble.url);
        break;
        case "twitter-authorize-deny":
        src="/topic/share?way=twitter&authorize_denied=1&url="+encodeURIComponent(toolbarState.stumble.url);
        break;
        case "sharemsg":
        src="/topic/share?way=sharemsg";
        if(!webtb.request.sid)
        {
          src+="&cid="+webtb.request.cid;
        }
        else
        {
          src+="&sid="+webtb.request.sid;
          src+="&h="+webtb.request.h;
        }
        break;
        case "login":
        src="/topic/share?way=signup";
        break;
        case "supr":
        src="/topic/share?supr="+toolbarState.supr;
        break;
      }
    }
    util.debug("@653::src=" + src);
    sidepanel.openSidePanel(src);
  }
  ,modalMessage:function(msg)
  {
    switch(msg)
    {
      case "authorize_twitter":
      break;
    }
  }
  ,hideModalMessage:function(msg)
  {
    $("#modalMessagingFrame").hide();
  }
  ,addMoreContacts:function()
  {
    var _28=$(".shareEmail:first").clone(true);
    _28.attr("value","");
    _28.insertAfter(".shareEmail:last");
  }

  //ajax回调函数，处理服务器端返回的结果
  ,stumbleHandler:function(_29,_2a)
  {
    util.debug("@613$$_29=" + _29 + "  _2a=" + _2a);
    $("#linkStumble").removeClass("btnLoading");

    //计算上次请求和本次请求的间隔时间
    var _2b=new Date().valueOf();
    var _2c=(_2b-toolbarState.clickTs["stumble"]);
    if(_29=="ERROR INVALID_TOKEN")
    {
      window.location="/topic/view";
      return true;
    }
    if(_2a=="from_precache")  //从缓存中取
    {
      var _2d=_29;
    }
    else
    {
      try
      {
        eval("var _2d_tmp=" + _29);
        var _2d = _2d_tmp.topic;
        util.debug("@638$$ url=" + _2d.url + "$$publicid=" + _2d.publicid);
      }
      catch(e)
      {
        util.reportError("Error evaling stumble data: "+e.message);
        return;
      }
    }

    util.debug("@652$$  related_content=" + _2d.related_content);
    if(_2d.related_content)  //是否显示顶部的F和T图标
    {
      switch(_2d.related_content)
      {
        case "supr_pub":  //显示
        if(!toolbarState.supr)
        {
          toolbarState.supr=_2d.publicid;
        }
        webtb.setStumbleMode("supr",true);
        webtb.toggleSidePanel("supr");
        $("#twitterShareLi").show();
        $("#facebookShareLi").show();
        break;
        case "supr_pub_no":  //关闭
        if(!toolbarState.supr)
        {
          toolbarState.supr=_2d.publicid;
        }
        webtb.setStumbleMode("supr",true);
        sidepanel.closeSidePanel();
        $("#twitterShareLi").show();
        $("#facebookShareLi").show();
        break;
      }
    }
    util.debug("@667$$" + toolbarState.way);
    if(_2d.method&&_2d.method!="show_url"&&_2d.method!=toolbarState.way)
    {
      switch(toolbarState.way)
      {
        case "supr":
        if(toolbarState.sidePanelOpen==true&&toolbarState.sidePanelAction=="supr")
        {
          sidepanel.closeSidePanel();
        }
        if(_2d.method=="instumbler")
        {
          toolbarState.instumbler=_2d.next_mode.userid;
        }
        else
        {
          if(_2d.next_mode&&_2d.next_mode.mode=="instumbler")
          {
            toolbarState.instumbler=_2d.next_mode.userid;
          }
        }
        break;
      }
      webtb.setStumbleMode(_2d.method,true);
    }
    if(_2d.next_mode)
    {
      webtb.setStumbleMode(_2d.next_mode.mode,true);
      switch(_2d.next_mode.mode)
      {
        case "instumbler":
        toolbarState.instumbler=_2d.next_mode.userid;
        break;
      }
    }

    util.debug("@705");
    if(_2a=="prefetch_after")
    {
      util.debug("@709$$ start");
      webtb.prefetchStumbles(_2d.publicid);//预取之后的处理
      util.debug("@709$$" + "prefetchStumbles end!");
    }
    if(_2d.userdata)
    {
      toolbarState.userData=_2d.userdata;
      if(_2d.userdata.prefetch)
      {
        toolbarConf.prefetch=_2d.userdata.prefetch;
      }
      webtb.setNumFavorites(Math.floor(toolbarState.userData.favorites));//设置用户收藏数
    }

    util.debug("@723 OK");
    if(_2d.url)
    {
      util.debug("@722 OK");
      toolbarState.pid=_2d.publicid;
      if(_2d.fallback)
      {
        webtb.setStumbleMode("general",true);
      }

      util.debug("@728 cache");
      webtb.cache[_2d.url]=_2d;//将当前网站放入缓存
      _2d.redir=toolbarConf.redirUrl+"?token="+toolbarConf.authToken+"&url="+util.escaped(_2d.url);
      
      util.debug("@727$$setContent start");
      webtb.setContent(_2d);
      util.debug("@727$$setContent sucess!");
      if(_2a=="from_precache")
      {
        if(_2d.is_message)
        {
          webtb.reportSeenMessage(_2d);
        }
        else
        {
          webtb.reportSeen(_2d);
        }
      }
      var _2e=_2d.title;
      if(_2e=="")
      {
        try
        {
          _2e=_2d.url.match(/\/([^\/]+)$/)[1];
        }
        catch(e)
        {
          _2e=_2d.url;
        }
      }
      document.title="MyDream - "+_2e;
      if(_2d.url_status=="unknown_url")
      {
        $("#share").hide();
      }
      else
      {
        $("#share").show();
      }

      util.debug("@782$$ overlay = " + _2d.overlay + " $$ overlay.url = " + _2d.overlay.url);
      if(_2d.overlay)
      {
        $("#modalMessagingFrame").show();
        var _2f=parent.modalMessagingFrame;
        _2f.location.replace(_2d.overlay.url);
      }
      else
      {
        $("#modalMessagingFrame").hide();
      }
    }
    else
    {
      var _30="Stumble failed... "+toolbarState.way+" "+toolbarState.source+" "+toolbarState.partner;
      if(_2d.no_stumble)
      {
        _30+=" REQUEST "+util.dumpRequest(_2d.request);
      }
      util.reportError(_30);
    }
    
    if(sidepanel_init_state) //初始化为false
    {
      webtb.toggleSidePanel(sidepanel_init_state);
      sidepanel_init_state=false;
    }
    else
    {
      if(entry_msg)  //初始化为false
      {
        var _31="";
        if(typeof entry_msg_title!="undefined")
        {
          _31=entry_msg_title;
        }
        lightbox.openLightbox("/topic/lightbox?way=message&message_title="+_31+"&message="+entry_msg,500,80);
        entry_msg=false;
      }
      else
      {
        if(toolbarState.sidePanelOpen==true&&toolbarState.sidePanelAction!="sharemsg"&&toolbarState.sidePanelAction!="supr")
        {
          webtb.updateSidePanel();
        }
      }
    }
  }

  //预取回来的内容的处理
  ,populatePrecache:function(_32)
  {
    toolbarState.waitingOnPrefetch=false;
    try
    {
      //var _33=eval("("+_32+")");
      eval("var _33_01 = " +_32 );
      var _33= _33_01.topic
      
      if(_32)
      {
        webtb.precache=_33; //TODO:这里是否需要修改？？？
      }
    }
    catch(e)
    {
      util.reportError("Error populating precache");
      return;
    }
  }
  ,reportSeen:function(_34)
  {
    var _35="ftoken="+toolbarConf.authToken+"&way=seen";
    if(_34.publicid)
    {
      _35+="&publicid="+_34.publicid;
    }
    else
    {
      _35+="&url="+_34.url;
    }
    jQuery.post(toolbarConf.serviceUrl,_35);
  }
  ,reportSeenMessage:function(_36)
  {
    if(_36.is_message)
    {
      var _37="ftoken="+toolbarConf.authToken+"&way=seen";
      _37+="&messageid="+_36.is_message;
      jQuery.post(toolbarConf.serviceUrl,_37);
    }
  }
  ,thumbHandler:function(_38)
  {
    if(toolbarState.loggedOutLike&&toolbarState.userData.loggedIn)
    {
      webtb.toggleLogin();
    }
    toolbarState.ratingLock=false;
    try
    {
    	util.debug("_38=" + _38);
      var _39=eval("("+_38+")");
      if(_39.identical==false)
      {
        webtb.setNumFavorites();
      }
    }
    catch(e)
    {
      util.reportError("thumb: "+e.message);
      return;
    }
  }
  ,unrateHandler:function(_3a)
  {
    toolbarState.ratingLock=false;
    try
    {
      var _3b=eval("("+_3a+")");
      if(_3b.favorites)
      {
        webtb.setNumFavorites(Math.floor(_3b.favorites));
      }
    }
    catch(e)
    {
      util.reportError("unrate: "+e.message);
      return;
    }
  }
  ,thumbDownHandler:function(_3c)
  {
    toolbarState.ratingLock=false;
    try
    {
      var _3d=eval("("+_3c+")");
      if(_3d.identical==false)
      {
      }
    }
    catch(e)
    {
      util.reportError("thumb down: "+e.message);
      return;
    }
  }

  //将URL中的参数取出来，放入webtb.request中
  ,parseHash:function()
  {
    var _3e=document.location.hash;
    _3e=_3e.replace(/#/,"");
    if(document.location.pathname.toString().match(/^\/topic\/view/)){
    var _3f=document.location.hash.toString();
    var pid=_3f.match(/^#([a-zA-Z0-9]+)\//);
    if(pid)
    {
      webtb.request["pid"]=pid[1];
    }
    var _41=_3f.substring(_3f.lastIndexOf("/")+1,_3f.length);
    if(_41.length>0&&_41.indexOf(":")>0)
    {
      if(_41[0]=="#")
      {
        _41=_41.substr(1);
      }
      var _41=_41.split(";");
      for(var i=0;i<_41.length;i++)
      {
        if(_41[i].indexOf(":")>0)
        {
          var k=_41[i].substr(0,_41[i].indexOf(":"));
          var v=_41[i].substr(_41[i].indexOf(":")+1);
          webtb.request[k]=v;
        }
        else
        {
          webtb.request[_41[i]]=true;
        }
      }
    }
    return;
  }
  var _45=_3e.split("&");
  for(var i=0;i<_45.length;i++)
  {
    var _46=_45[i].split("=");
    if(_46[1])
    {
      webtb.request[_46[0]]=util.unescaped(_46[1]);
    }
    else
    {
      webtb.request[_46[0]]=true;
    }
  }
}
,setRequestState:function()
{
  var _47=toolbarState.stumble;
  var _48=
  {
    url:_47.url
  };
  if(_47.publicid)
  {
    _48.pid=_47.publicid;
  }
  mode_conf=toolbarConf.modes[_47.method];
  if(mode_conf&&mode_conf.requestParams)
  {
    params=mode_conf.requestParams;
    for(i=0;i<params.length;i++)
    {
      _48[params[i]]=_47[params[i]]; //TODO： 不理解？？
    }
  }
  if(_47.method=="show_url")
  {
    var _49=["topic","stumblethru","navtopic","metatopic","search"];
    for(i=0;i<_49.length;i++)
    {
      t=_49[i];
      if(webtb.request[t])
      {
        _48[t]=webtb.request[t];
      }
    }
  }
  if(!toolbarState.noHistory)
  {
    util.setHash(_48);//改地址栏中的参数
  }
  else
  {
    if(toolbarState.pid&&!toolbarState.url)
    {
      util.setHash(_48);
    }
    toolbarState.noHistory=false;
  }
}
//将token和way（src）拼接在一起返回
,sharedRequestVars:function(_4a)
{
  var _4b="ftoken="+toolbarConf.authToken+"&way="+toolbarState.way;
  if(_4a=="stumble")
  {
    util.debug("sharedRequestVars what == stumble");
    _4b+="&src="+toolbarState.source;
  }
  return _4b;
}

//拼接浏览方式
,stumbleModeVars:function()
{
  var _4c="";
  if(toolbarState.mode=="stumblethru")
  {
    _4c+="&domain="+toolbarState.partner;
  }
  if(toolbarState.mode=="metatopic"||toolbarState.mode=="topic")
  {
    _4c+="&topic="+encodeURIComponent(toolbarState.topic);
  }
  if(toolbarState.mode=="navtopic")
  {
    _4c+="&navtopic="+encodeURIComponent(toolbarState.topic);
  }
  if(toolbarState.mode=="instumbler")
  {
    if(toolbarState.instumbler)
    {
      _4c+="&user="+toolbarState.instumbler;
    }
    else
    {
      _4c+="&user="+webtb.request.stumbler;
    }
    if(webtb.request.topic)
    {
      _4c+="&topic="+webtb.request.topic;
    }
    else
    {
      _4c+="&topic=0";
    }
  }
  if(toolbarState.mode=="search")
  {
    _4c+="&q="+webtb.request.search;
  }
  return _4c;
}
,clearHealthCheckTimers:function()
{
  clearTimeout(webtb.healthyUrlTimer);
  clearTimeout(webtb.healthyUrlTimerLong);
}
,startHealthCheckTimers:function()
{
  if(toolbarState.stumble)
  {
    if(toolbarState.doHealthChecks.shortInterval)
    {
webtb.healthyUrlTimer=setTimeout(function()
{
  webtb.phoneHome(toolbarState.stumble.url);
}
,toolbarConf.healthyUrlInterval);
}
if(toolbarState.doHealthChecks.longInterval)
{
webtb.healthyUrlTimerLong=setTimeout(function()
{
  webtb.phoneHome(toolbarState.stumble.url,true);
}
,toolbarConf.healthyUrlIntervalLong);
}
toolbarState.doHealthChecks.shortInterval=false;
toolbarState.doHealthChecks.longInterval=false;
}
}
//带参数调用后台
,pollHash:function()
{
if(toolbarState.ratingLock)
{
return;
}
webtb.parseHash();
if(toolbarState.stumble.pid&&webtb.request.pid)
{
if(toolbarState.stumble.pid!=webtb.request.pid)
{
webtb.showPid(webtb.request.pid);
}
}
if(toolbarState.stumble.url&&webtb.request.url)
{
if(util.unescaped(toolbarState.stumble.url)!=util.unescaped(webtb.request.url))
{
webtb.showStumble(webtb.request.url);
}
}
}
,phoneHome:function(url,_4e)
{
if(_4e)
{
util.debug(toolbarState.stumble.url+" stayed loaded "+toolbarConf.healthyUrlIntervalLong+"ms");
}
else
{
util.debug(toolbarState.stumble.url+" stayed loaded "+toolbarConf.healthyUrlInterval+"ms");
}
var _4f="ftoken="+toolbarConf.authToken+"&way=health&url="+util.escaped(toolbarState.stumble.url);
if(_4e)
{
_4f+="&interval="+toolbarConf.healthyUrlIntervalLong;
}
else
{
_4f+="&interval="+toolbarConf.healthyUrlInterval;
}
jQuery.post(toolbarConf.serviceUrl,_4f);
},
//将页面上的对象和响应时间绑定
bindListeners:function()
{
//兴趣类型选择事件响应  all_topics
//打开或者关闭modalBox(在modalBox.html.erb中)
$("#stumbleModeRound").click(function()
{
  util.debug("@1141$$ stumbleModeRound clicked...");
  if(modalBoxFrame.modalBox.mode!="topicSelector")
  {
    modalBoxFrame.modalBox.open("topicSelector");
    var _50=$("#stumbleModeRound").position();
    $("#modalBoxFrame").css("left",_50.left+"px");
  }
  else
  {
    modalBoxFrame.modalBox.close();
  }
}
);
$(document).keypress(function(e)
{
  if(e.charCode)
  {
    var key=e.charCode;
  }
  else
  {
    var key=e.keyCode;
  }
  switch(key)
  {
    case 32:
    case 34:
    case 40:
    var _53=parent.stumbleContent;
    if(_53)
    {
      _53.focus();
    }
    break;
    case 38:
    webtb.thumb();
    break;
    case 39:
    webtb.stumble();
    break;
  }
}
);
$("#linkStumble").click(function()
{
  $("#linkStumble").addClass("btnLoading");
  webtb.stumble();
  lightbox.closeLightbox();
}
);
$("#linkThumb").click(function()
{
  webtb.thumb();
}
);
$("#linkThumbDown").click(function()
{
  webtb.thumbDown();
}
);
$("#stumbleFrame").load(function()
{
  if(toolbarState.expectingLoad)
  {
    toolbarState.expectingLoad=false;
    toolbarState.onPage=true;
  }
  else
  {
    toolbarState.onPage=false;
  }
}
);
$("#stumbleFrame").unload(function()
{
}
);
$("#stumbleModeLabel").click(function()
{
  webtb.modeLabelClicked();
}
);
$("#allButton").click(function()
{
  webtb.setStumbleMode("general",true);
  webtb.stumble();
  return false;
}
);
$("#backToSU").click(function()
{
	util.debug("toolbarState.userData.loggedIn=" + toolbarState.userData.loggedIn);
	util.debug("toolbarState.userData.nickname=" + toolbarState.userData.nickname);
	util.debug("toolbarState.mode=" + toolbarState.mode);
  if(toolbarState.userData.loggedIn&&toolbarState.userData.nickname)
  {
    document.location.href="/home/myself";
    return false;
  }
  else
  { 
    switch(toolbarState.mode)
    {
      case "instumbler":
      document.location.href="/index";
      break;
      case "video":
      case "photos":
      document.location.href="/topic/view/"+toolbarState.mode;
      break;
      case "topic":
      document.location.href="/topic/view/"+webtb.request.topic;
      break;
      default:
      //document.location.href=$("#siteReviews").attr("href");
      document.location.href="/index";
    }
    return false;
  }
}
);
$("#share").click(function()
{
  webtb.toggleSidePanel("share");
}
);
$("#twitterShare").click(function()
{
  webtb.twitterShare(toolbarState.stumble.publicid);
}
);
$("#facebookShare").click(function()
{
  webtb.facebookShare(toolbarState.stumble.publicid);
}
);
$("#signup").click(function()
{
  lightbox.openLightbox("/user/sign_up",500,480);
}
);
$("#addMoreContacts").click(function()
{
  webtb.addMoreContacts();
}
);
$(window).bind("resize",function()
{
  if(toolbarState.sidePanelOpen)
  {
    webtb.contractStumbleFrame();
  }
}
);
$("#loginBtn").click(function()
{
	toolbarState.loggedOutLike = false;
  modalBoxFrame.modalBox.open("login");
  $("#modalBoxFrame").css("left","");
  $("#modalBoxFrame").css("right","0px");
  $(modalBoxFrame).focus();
  modalBoxFrame.$("#mb_username").focus();
}
);
}
,toggleLogin:function()
{
window.location.reload();
var panelLogin = $("#panelLogin");
var userInfo = $("#userInfo");
panelLogin[0].style.display = "none";
userInfo[0].style.display = "block";
util.debug("toolbarState.userData.loggedIn=" + toolbarState.userData.loggedIn);
}
,twitterShare:function(_54)
{
var url="http://twitter.com/home?status=SU: ";
if(toolbarState.stumble.title)
{
  url+=toolbarState.stumble.title+" ";
}
url+=encodeURIComponent("http://su.pr/"+_54)+"&source=StumbleUpon";
var _56="sutweet";
var _57="800px";
var _58="500px";
var _59=true;
openPopup(url,_56,_58,_57,_59);
}
,facebookShare:function(_5a)
{
var url="http://www.facebook.com/sharer.php?u="+encodeURIComponent("http://su.pr/"+_5a);
var _5c="620px";
var _5d="550px";
var _5e="sufb";
var _5f=false;
openPopup(url,_5e,_5d,_5c,_5f);
}
,reloadSidePanel:function()
{
sidepanel.openSidePanel($("#spFrame").attr("src"));
}

//行为分析，暂时先关闭
,trackWebStumble:function()
{
//var s=s_gi(s_account);
//s.eVar18="+1";
//s.prop18="1";
//s.linkTrackVars="eVar18,prop18";
//s.tl(true,"o","Web Stumble Button");
}
,
//页面初始化
init:function()
{
util.debug("@1379:::document.location.pathname.toString() = " + document.location.pathname.toString());
//if(!document.location.pathname.toString().match(/^\/s\//)&&document.location.pathname.toString().match(/^\/toolbar\//))
//判断URL是否是本网站的URL，如果不是的话，取出参数，重新载入页面
if(!document.location.pathname.toString().match(/^\/topic\/view/))
{
var _61=document.location.hash;
_61=_61.replace(/#/,"");
var _62=_61.split("&");
for(var i=0;i<_62.length;i++)
{
  var _64=_62[i].split("=");
  if(_64[1])
  {
    webtb.request[_64[0]]=util.unescaped(_64[1]);
  }
  else
  {
    webtb.request[_64[0]]=true;
  }
}
if(webtb.request.url)
{
  var _65="/s/"+webtb.request.url;
  document.location.replace(_65);//在服务器端重新生成页面，reload()相当于重新提交一次
  return;
}
}

var _66=
{
timeout:toolbarConf.defaultXhrTimeout,error:function(xhr,_68,_69)
{
  util.reportError("Failure in ajax request: "+_68);
  toolbarState.ratingLock=false;
}
};
//设置ajax全局变量：timeout和error错误处理函数
jQuery.ajaxSetup(_66);//jQuery.ajaxSetup函数传入的参数是个对象
//将URL中的参数取出来，放入webtb.request中
webtb.parseHash();
//将页面上的对象和响应时间绑定
webtb.bindListeners();

toolbarConf.authToken=util.getToken();
//0.5后带参数调用后台程序，生成下一个页面
setInterval("webtb.pollHash()",500);

webtb.setStumbleMode("general",true);
if(webtb.request.stumblethru)
{
webtb.setModeLabel("");
webtb.setStumbleMode("stumblethru",true);
toolbarState.partner=webtb.request.stumblethru;
}
else
{
if(webtb.request.metatopic)
{
  webtb.setModeLabel("");
  webtb.setStumbleMode("metatopic",true);
  toolbarState.topic=webtb.request.metatopic;
}
else
{
  if(webtb.request.navtopic)
  {
    webtb.setModeLabel("");
    webtb.setStumbleMode("navtopic",true);
    toolbarState.topic=webtb.request.navtopic;
  }
  else
  {
    if(webtb.request.topic)
    {
      if(webtb.request.topic=="Videos")
      {
        webtb.setStumbleMode("video");
      }
      else
      {
        webtb.setStumbleMode("topic",true);
        toolbarState.topic=webtb.request.topic;
        webtb.setModeLabel("");
      }
    }
    else
    {
      if(webtb.request.photos)
      {
        webtb.setStumbleMode("photos",true);
      }
      else
      {
        if(webtb.request.stumbler)
        {
          webtb.setStumbleMode("instumbler",true);
        }
        else
        {
          if(webtb.request.search)
          {
            webtb.setStumbleMode("search",true);
          }
        }
      }
    }
  }
}
}
if(webtb.request.url)
{
toolbarState.noHistory=true;
webtb.showStumble(webtb.request.url);
}
if(webtb.request.pid)
{
toolbarState.noHistory=true;
webtb.showPid(webtb.request.pid);
if(toolbarState.supr)
{
  webtb.setStumbleMode("supr",true);
}
}
else
{
webtb.stumble();
}
if(webtb.request.cid||(webtb.request.sid&&webtb.request.h))
{
webtb.toggleSidePanel("sharemsg");
}
//设置超链接的鼠标划过提示样式(鼠标移过显示的内容的样式)
$("a.tips").cluetip(
{
cluetipClass:"jtip",dropshadow:false,showTitle:false,splitTitle:"|",arrows:true,width:150,dropShadow:false,hoverIntent:
{
  sensitivity:3,interval:400,timeout:0
}
}
);
}
};
