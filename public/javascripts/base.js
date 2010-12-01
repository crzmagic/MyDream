(function($) {

//sets default value for a input field	
$.fn.defaultvalue = function() {
	
	// Scope
	var elements = this;
	var args = arguments;
	var c = 0;
	
	return(
		elements.each(function() {				
			
			// Default values within scope
			var el = $(this);
			var def = args[c++];

			el.val(def).focus(function() {
				if(el.val() == def) {
					el.val("");
					el.removeClass('textUncolor');
				}
				el.blur(function() {
					if(el.val() == "") {
						el.val(def);
						el.addClass('textUncolor');
					}
				});
			});
			
		})
	);
}

//better default value. doesn't whack all content, supports a new value on focus, back to default on blur
$.fn.defaultvaluebetter = function() {
	
	// Scope
	var elements = this;
	var args = arguments;
	var c = 0;

	if (args[1])
		var focusdefault = args[1];
	
	return(
		elements.each(function() {				
			
			// Default values within scope
			var el = $(this);
			var def = args[c++];

			el.val(def).focus(function() {
				if(el.val() == def) {
					el.val(focusdefault);
					el.removeClass('textUncolor');
				}
				el.blur(function() {
					if(el.val() == "" || el.val() == focusdefault) {
						el.val(def);
						el.addClass('textUncolor');
					}
				});
			});
			
		})
	);
}

// check max length of a field
$.fn.maxlength = function (settings) {

    if (typeof settings == 'string') {
        settings = { feedback : settings };
    }

    settings = $.extend({}, $.fn.maxlength.defaults, settings);

    function length(el) {
    	var parts = el.value;
    	if ( settings.words )
    		parts = el.value.length ? parts.split(/\s+/) : { length : 0 };
    	return parts.length;
    }
    
    return this.each(function () {
        var field = this,
        	$field = $(field),
        	$form = $(field.form),
        	limit = settings.useInput ? $form.find('input[name=maxlength]').val() : $field.attr('maxlength'),
        	$charsLeft = $form.find(settings.feedback);

    	function limitCheck(event) {
        	var len = length(this),
        	    exceeded = len >= limit,
        		code = event.keyCode;

        	if ( !exceeded )
        		return;

            switch (code) {
                case 8:  // allow delete
                case 9:
                case 17:
                case 36: // and cursor keys
                case 35:
                case 37: 
                case 38:
                case 39:
                case 40:
                case 46:
                case 65:
                    return;

                default:
                    return settings.words && code != 32 && code != 13 && len == limit;
            }
        }


        var updateCount = function () {
            var len = length(field),
            	diff = limit - len;

            $charsLeft.html( diff || "0" );

            // truncation code
            if (settings.hardLimit && diff < 0) {
            	field.value = settings.words ? 
            	    // split by white space, capturing it in the result, then glue them back
            		field.value.split(/(\s+)/, (limit*2)-1).join('') :
            		field.value.substr(0, limit);

                updateCount();
            }
        };

        $field.keyup(updateCount).change(updateCount);
        if (settings.hardLimit) {
            $field.keydown(limitCheck);
        }

        updateCount();
    });
};

$.fn.maxlength.defaults = {
    useInput : false,
    hardLimit : true,
    feedback : '.charsLeft',
    words : false
};

// auto gro text area
var self = null;

jQuery.fn.autogrow = function(o)
{	
	return this.each(function() {
		new jQuery.autogrow(this, o);
	});
};


/**
 * The autogrow object.
 *
 * @constructor
 * @name jQuery.autogrow
 * @param Object e The textarea to create the autogrow for.
 * @param Hash o A set of key/value pairs to set as configuration properties.
 * @cat Plugins/autogrow
 */

jQuery.autogrow = function (e, o)
{
	this.options		  	= o || {};
	this.dummy			  	= null;
	this.interval	 	  	= null;
	this.line_height	  	= this.options.lineHeight || parseInt(jQuery(e).css('line-height'));
	this.min_height		  	= this.options.minHeight || parseInt(jQuery(e).css('min-height'));
	this.max_height		  	= this.options.maxHeight || parseInt(jQuery(e).css('max-height'));;
	this.textarea		  	= jQuery(e);
	
	if(this.line_height == NaN)
	  this.line_height = 0;
	
	// Only one textarea activated at a time, the one being used
	this.init();
};

jQuery.autogrow.fn = jQuery.autogrow.prototype = {
autogrow: '1.2.2'
};

jQuery.autogrow.fn.extend = jQuery.autogrow.extend = jQuery.extend;

jQuery.autogrow.fn.extend({
					 
	init: function() {			
		var self = this;			
		this.textarea.css({overflow: 'hidden', display: 'block'});
		this.textarea.bind('focus', function() { self.startExpand() } ).bind('blur', function() { self.stopExpand() });
		this.checkExpand();	
	},
					 
	startExpand: function() {				
	  var self = this;
		this.interval = window.setInterval(function() {self.checkExpand()}, 400);
	},
	
	stopExpand: function() {
		clearInterval(this.interval);	
	},
	
	checkExpand: function() {
		
		if (this.dummy == null)
		{
			this.dummy = jQuery('<div></div>');
			this.dummy.css({
											'font-size'  : this.textarea.css('font-size'),
											'font-family': this.textarea.css('font-family'),
											'width'      : this.textarea.css('width'),
											'padding'    : this.textarea.css('padding'),
											'line-height': this.line_height + 'px',
											'overflow-x' : 'hidden',
											'position'   : 'absolute',
											'top'        : 0,
											'left'		 : -9999
											}).appendTo('body');
		}
		
		// Strip HTML tags
		var html = this.textarea.val().replace(/(<|>)/g, '');
		
		// IE is different, as per usual
		if ($.browser.msie)
		{
			html = html.replace(/\n/g, '<BR>new');
		}
		else
		{
			html = html.replace(/\n/g, '<br>new');
		}
		
		if (this.dummy.html() != html)
		{
			this.dummy.html(html);	
			
			if (this.max_height > 0 && (this.dummy.height() + this.line_height > this.max_height))
			{
				this.textarea.css('overflow-y', 'auto');	
			}
			else
			{
				this.textarea.css('overflow-y', 'hidden');
				if (this.textarea.height() < this.dummy.height() + this.line_height || (this.dummy.height() < this.textarea.height()))
				{	
					this.textarea.animate({height: (this.dummy.height() + this.line_height) + 'px'}, 100);	
				}
			}
		}
	}
					 
 });


})(jQuery)

//scroll to plugin http://flesler.blogspot.com
;(function($){var o=$.scrollTo=function(a,b,c){o.window().scrollTo(a,b,c)};o.defaults={axis:'y',duration:1};o.window=function(){return $($.browser.safari?'body':'html')};$.fn.scrollTo=function(l,m,n){if(typeof m=='object'){n=m;m=0}n=$.extend({},o.defaults,n);m=m||n.speed||n.duration;n.queue=n.queue&&n.axis.length>1;if(n.queue)m/=2;n.offset=j(n.offset);n.over=j(n.over);return this.each(function(){var a=this,b=$(a),t=l,c,d={},w=b.is('html,body');switch(typeof t){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(t)){t=j(t);break}t=$(t,this);case'object':if(t.is||t.style)c=(t=$(t)).offset()}$.each(n.axis.split(''),function(i,f){var P=f=='x'?'Left':'Top',p=P.toLowerCase(),k='scroll'+P,e=a[k],D=f=='x'?'Width':'Height';if(c){d[k]=c[p]+(w?0:e-b.offset()[p]);if(n.margin){d[k]-=parseInt(t.css('margin'+P))||0;d[k]-=parseInt(t.css('border'+P+'Width'))||0}d[k]+=n.offset[p]||0;if(n.over[p])d[k]+=t[D.toLowerCase()]()*n.over[p]}else d[k]=t[p];if(/^\d+$/.test(d[k]))d[k]=d[k]<=0?0:Math.min(d[k],h(D));if(!i&&n.queue){if(e!=d[k])g(n.onAfterFirst);delete d[k]}});g(n.onAfter);function g(a){b.animate(d,m,n.easing,a&&function(){a.call(this,l)})};function h(D){var b=w?$.browser.opera?document.body:document.documentElement:a;return b['scroll'+D]-b['client'+D]}})};function j(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
//localscroll:  http://flesler.blogspot.com
;(function($){var g=location.href.replace(/#.*/,''),h=$.localScroll=function(a){$('body').localScroll(a)};h.defaults={duration:1e3,axis:'y',event:'click',stop:1};h.hash=function(a){a=$.extend({},h.defaults,a);a.hash=0;if(location.hash)setTimeout(function(){i(0,location,a)},0)};$.fn.localScroll=function(b){b=$.extend({},h.defaults,b);return(b.persistent||b.lazy)?this.bind(b.event,function(e){var a=$([e.target,e.target.parentNode]).filter(c)[0];a&&i(e,a,b)}):this.find('a,area').filter(c).bind(b.event,function(e){i(e,this,b)}).end().end();function c(){var a=this;return!!a.href&&!!a.hash&&a.href.replace(a.hash,'')==g&&(!b.filter||$(a).is(b.filter))}};function i(e,a,b){var c=a.hash.slice(1),d=document.getElementById(c)||document.getElementsByName(c)[0],f;if(d){e&&e.preventDefault();f=$(b.target||$.scrollTo.window());if(b.lock&&f.is(':animated')||b.onBefore&&b.onBefore.call(a,e,d,f)===!1)return;if(b.stop)f.queue('fx',[]).stop();f.scrollTo(d,b).trigger('notify.serialScroll',[d]);if(b.hash)f.queue(function(){location=a.hash;$(this).dequeue()})}}})(jQuery);
//serialscroll
;(function($){var a='serialScroll',b='.'+a,c='bind',C=$[a]=function(b){$.scrollTo.window()[a](b)};C.defaults={duration:1e3,axis:'x',event:'click',start:0,step:1,lock:1,cycle:1,constant:1};$.fn[a]=function(y){y=$.extend({},C.defaults,y);var z=y.event,A=y.step,B=y.lazy;return this.each(function(){var j=y.target?this:document,k=$(y.target||this,j),l=k[0],m=y.items,o=y.start,p=y.interval,q=y.navigation,r;if(!B)m=w();if(y.force)t({},o);$(y.prev||[],j)[c](z,-A,s);$(y.next||[],j)[c](z,A,s);if(!l.ssbound)k[c]('prev'+b,-A,s)[c]('next'+b,A,s)[c]('goto'+b,t);if(p)k[c]('start'+b,function(e){if(!p){v();p=1;u()}})[c]('stop'+b,function(){v();p=0});k[c]('notify'+b,function(e,a){var i=x(a);if(i>-1)o=i});l.ssbound=1;if(y.jump)(B?k:w())[c](z,function(e){t(e,x(e.target))});if(q)q=$(q,j)[c](z,function(e){e.data=Math.round(w().length/q.length)*q.index(this);t(e,this)});function s(e){e.data+=o;t(e,this)};function t(e,a){if(!isNaN(a)){e.data=a;a=l}var c=e.data,n,d=e.type,f=y.exclude?w().slice(0,-y.exclude):w(),g=f.length,h=f[c],i=y.duration;if(d)e.preventDefault();if(p){v();r=setTimeout(u,y.interval)}if(!h){n=c<0?0:n=g-1;if(o!=n)c=n;else if(!y.cycle)return;else c=g-n-1;h=f[c]}if(!h||d&&o==c||y.lock&&k.is(':animated')||d&&y.onBefore&&y.onBefore.call(a,e,h,k,w(),c)===!1)return;if(y.stop)k.queue('fx',[]).stop();if(y.constant)i=Math.abs(i/A*(o-c));k.scrollTo(h,i,y).trigger('notify'+b,[c])};function u(){k.trigger('next'+b)};function v(){clearTimeout(r)};function w(){return $(m,l)};function x(a){if(!isNaN(a))return a;var b=w(),i;while((i=b.index(a))==-1&&a!=l)a=a.parentNode;return i}})}})(jQuery);

// fancybox
(function($) {
	var opts = {}, 
		imgPreloader = new Image, imgTypes = ['png', 'jpg', 'jpeg', 'gif'], 
		loadingTimer, loadingFrame = 1;

   $.fn.fancybox = function(settings) {
		opts.settings = $.extend({}, $.fn.fancybox.defaults, settings);

		$.fn.fancybox.init();

		return this.each(function() {
			var $this = $(this);
			var o = $.metadata ? $.extend({}, opts.settings, $this.metadata()) : opts.settings;

			$this.unbind('click').click(function() {
				$.fn.fancybox.start(this, o); return false;
			});
		});
	};

	$.fn.fancybox.start = function(el, o) {
		if (opts.animating) return false;

		if (o.overlayShow) {
			$("#fancy_wrap").prepend('<div id="fancy_overlay"></div>');
			$("#fancy_overlay").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': o.overlayOpacity});

			if ($.browser.msie) {
				$("#fancy_wrap").prepend('<iframe id="fancy_bigIframe" scrolling="no" frameborder="0"></iframe>');
				$("#fancy_bigIframe").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': 0});
			}

			$("#fancy_overlay").click($.fn.fancybox.close);
		}

		opts.itemArray	= [];
		opts.itemNum	= 0;

		if (jQuery.isFunction(o.itemLoadCallback)) {
		   o.itemLoadCallback.apply(this, [opts]);

			var c	= $(el).children("img:first").length ? $(el).children("img:first") : $(el);
			var tmp	= {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}

		   for (var i = 0; i < opts.itemArray.length; i++) {
				opts.itemArray[i].o = $.extend({}, o, opts.itemArray[i].o);
				
				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
					opts.itemArray[i].orig = tmp;
				}
		   }

		} else {
			if (!el.rel || el.rel == '') {
				var item = {url: el.href, title: el.title, o: o};

				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
					var c = $(el).children("img:first").length ? $(el).children("img:first") : $(el);
					item.orig = {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}
				}

				opts.itemArray.push(item);

			} else {
				var arr	= $("a[@rel=" + el.rel + "]").get();

				for (var i = 0; i < arr.length; i++) {
					var tmp		= $.metadata ? $.extend({}, o, $(arr[i]).metadata()) : o;
   					var item	= {url: arr[i].href, title: arr[i].title, o: tmp};

   					if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
						var c = $(arr[i]).children("img:first").length ? $(arr[i]).children("img:first") : $(el);

						item.orig = {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}
					}

					if (arr[i].href == el.href) opts.itemNum = i;

					opts.itemArray.push(item);
				}
			}
		}

		$.fn.fancybox.changeItem(opts.itemNum);
	};

	$.fn.fancybox.changeItem = function(n) {
		$.fn.fancybox.showLoading();

		opts.itemNum = n;

		$("#fancy_nav").empty();
		$("#fancy_outer").stop();
		$("#fancy_title").hide();
		$(document).unbind("keydown");

		imgRegExp = imgTypes.join('|');
    	imgRegExp = new RegExp('\.' + imgRegExp + '$', 'i');

		var url = opts.itemArray[n].url;

		if (url.match(/#/)) {
			var target = window.location.href.split('#')[0]; target = url.replace(target,'');

	        $.fn.fancybox.showItem('<div id="fancy_div">' + $(target).html() + '</div>');

	        $("#fancy_loading").hide();

		} else if (url.match(imgRegExp)) {
			$(imgPreloader).unbind('load').bind('load', function() {
				$("#fancy_loading").hide();

				opts.itemArray[n].o.frameWidth	= imgPreloader.width;
				opts.itemArray[n].o.frameHeight	= imgPreloader.height;

				$.fn.fancybox.showItem('<img id="fancy_img" src="' + imgPreloader.src + '" />');

			}).attr('src', url + '?rand=' + Math.floor(Math.random() * 999999999) );

		} else {
			$.fn.fancybox.showItem('<iframe id="fancy_frame" onload="$.fn.fancybox.showIframe()" name="fancy_iframe' + Math.round(Math.random()*1000) + '" frameborder="0" hspace="0" src="' + url + '"></iframe>');
		}
	};

	$.fn.fancybox.showIframe = function() {
		$("#fancy_loading").hide();
		$("#fancy_frame").show();
	};

	$.fn.fancybox.showItem = function(val) {
		$.fn.fancybox.preloadNeighborImages();

		var viewportPos	= $.fn.fancybox.getViewport();
		var itemSize	= $.fn.fancybox.getMaxSize(viewportPos[0] - 50, viewportPos[1] - 100, opts.itemArray[opts.itemNum].o.frameWidth, opts.itemArray[opts.itemNum].o.frameHeight);

		var itemLeft	= viewportPos[2] + Math.round((viewportPos[0] - itemSize[0]) / 2) - 20;
		var itemTop		= viewportPos[3] + Math.round((viewportPos[1] - itemSize[1]) / 2) - 40;

		var itemOpts = {
			'left':		itemLeft, 
			'top':		itemTop, 
			'width':	itemSize[0] + 'px', 
			'height':	itemSize[1] + 'px'	
		}

		if (opts.active) {
			$('#fancy_content').fadeOut("normal", function() {
				$("#fancy_content").empty();
				
				$("#fancy_outer").animate(itemOpts, "normal", function() {
					$("#fancy_content").append($(val)).fadeIn("normal");
					$.fn.fancybox.updateDetails();
				});
			});

		} else {
			opts.active = true;

			$("#fancy_content").empty();

			if ($("#fancy_content").is(":animated")) {
				console.info('animated!');
			}

			if (opts.itemArray[opts.itemNum].o.zoomSpeedIn > 0) {
				opts.animating		= true;
				itemOpts.opacity	= "show";

				$("#fancy_outer").css({
					'top':		opts.itemArray[opts.itemNum].orig.pos.top - 18,
					'left':		opts.itemArray[opts.itemNum].orig.pos.left - 18,
					'height':	opts.itemArray[opts.itemNum].orig.height,
					'width':	opts.itemArray[opts.itemNum].orig.width
				});

				$("#fancy_content").append($(val)).show();

				$("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedIn, function() {
					opts.animating = false;
					$.fn.fancybox.updateDetails();
				});

			} else {
				$("#fancy_content").append($(val)).show();
				$("#fancy_outer").css(itemOpts).show();
				$.fn.fancybox.updateDetails();
			}
		 }
	};

	$.fn.fancybox.updateDetails = function() {
		$("#fancy_bg,#fancy_close").show();

		if (opts.itemArray[opts.itemNum].title !== undefined && opts.itemArray[opts.itemNum].title !== '') {
			$('#fancy_title div').html(opts.itemArray[opts.itemNum].title);
			$('#fancy_title').show();
		}

		if (opts.itemArray[opts.itemNum].o.hideOnContentClick) {
			$("#fancy_content").click($.fn.fancybox.close);
		} else {
			$("#fancy_content").unbind('click');
		}

		if (opts.itemNum != 0) {
			$("#fancy_nav").append('<a id="fancy_left" href="javascript:;"></a>');

			$('#fancy_left').click(function() {
				$.fn.fancybox.changeItem(opts.itemNum - 1); return false;
			});
		}

		if (opts.itemNum != (opts.itemArray.length - 1)) {
			$("#fancy_nav").append('<a id="fancy_right" href="javascript:;"></a>');
			
			$('#fancy_right').click(function(){
				$.fn.fancybox.changeItem(opts.itemNum + 1); return false;
			});
		}

		$(document).keydown(function(event) {
			if (event.keyCode == 27) {
            	$.fn.fancybox.close();

			} else if(event.keyCode == 37 && opts.itemNum != 0) {
            	$.fn.fancybox.changeItem(opts.itemNum - 1);

			} else if(event.keyCode == 39 && opts.itemNum != (opts.itemArray.length - 1)) {
            	$.fn.fancybox.changeItem(opts.itemNum + 1);
			}
		});
	};

	$.fn.fancybox.preloadNeighborImages = function() {
		if ((opts.itemArray.length - 1) > opts.itemNum) {
			preloadNextImage = new Image();
			preloadNextImage.src = opts.itemArray[opts.itemNum + 1].url;
		}

		if (opts.itemNum > 0) {
			preloadPrevImage = new Image();
			preloadPrevImage.src = opts.itemArray[opts.itemNum - 1].url;
		}
	};

	$.fn.fancybox.close = function() {
		if (opts.animating) return false;

		$(imgPreloader).unbind('load');
		$(document).unbind("keydown");

		$("#fancy_loading,#fancy_title,#fancy_close,#fancy_bg").hide();

		$("#fancy_nav").empty();

		opts.active	= false;

		if (opts.itemArray[opts.itemNum].o.zoomSpeedOut > 0) {
			var itemOpts = {
				'top':		opts.itemArray[opts.itemNum].orig.pos.top - 18,
				'left':		opts.itemArray[opts.itemNum].orig.pos.left - 18,
				'height':	opts.itemArray[opts.itemNum].orig.height,
				'width':	opts.itemArray[opts.itemNum].orig.width,
				'opacity':	'hide'
			};

			opts.animating = true;

			$("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedOut, function() {
				$("#fancy_content").hide().empty();
				$("#fancy_overlay,#fancy_bigIframe").remove();
				opts.animating = false;
			});

		} else {
			$("#fancy_outer").hide();
			$("#fancy_content").hide().empty();
			$("#fancy_overlay,#fancy_bigIframe").fadeOut("fast").remove();
		}
	};

	$.fn.fancybox.showLoading = function() {
		clearInterval(loadingTimer);

		var pos = $.fn.fancybox.getViewport();

		$("#fancy_loading").css({'left': ((pos[0] - 40) / 2 + pos[2]), 'top': ((pos[1] - 40) / 2 + pos[3])}).show();
		$("#fancy_loading").bind('click', $.fn.fancybox.close);
		
		loadingTimer = setInterval($.fn.fancybox.animateLoading, 66);
	};

	$.fn.fancybox.animateLoading = function(el, o) {
		if (!$("#fancy_loading").is(':visible')){
			clearInterval(loadingTimer);
			return;
		}

		$("#fancy_loading > div").css('top', (loadingFrame * -40) + 'px');

		loadingFrame = (loadingFrame + 1) % 12;
	};

	$.fn.fancybox.init = function() {
		if (!$('#fancy_wrap').length) {
			$('<div id="fancy_wrap"><div id="fancy_loading"><div></div></div><div id="fancy_outer"><div id="fancy_inner"><div id="fancy_nav"></div><div id="fancy_close" class="png"></div><div id="fancy_content"></div><div id="fancy_title"></div></div></div></div>').appendTo("body");
			$('<div id="fancy_bg"><div class="fancy_bg fancy_bg_n"></div><div class="fancy_bg fancy_bg_ne"></div><div class="fancy_bg fancy_bg_e"></div><div class="fancy_bg fancy_bg_se"></div><div class="fancy_bg fancy_bg_s"></div><div class="fancy_bg fancy_bg_sw"></div><div class="fancy_bg fancy_bg_w"></div><div class="fancy_bg fancy_bg_nw"></div></div>').prependTo("#fancy_inner");
			
			$('<table cellspacing="0" cellpadding="0" border="0"><tr><td id="fancy_title_left"></td><td id="fancy_title_main"><div></div></td><td id="fancy_title_right"></td></tr></table>').appendTo('#fancy_title');
		}

		if ($.browser.msie) {
			$("#fancy_inner").prepend('<iframe id="fancy_freeIframe" scrolling="no" frameborder="0"></iframe>');
		}

		if (jQuery.fn.pngFix) $(document).pngFix();

    	$("#fancy_close").click($.fn.fancybox.close);
	};

	$.fn.fancybox.getPosition = function(el) {
		var pos = el.offset();

		pos.top	+= $.fn.fancybox.num(el, 'paddingTop');
		pos.top	+= $.fn.fancybox.num(el, 'borderTopWidth');

 		pos.left += $.fn.fancybox.num(el, 'paddingLeft');
		pos.left += $.fn.fancybox.num(el, 'borderLeftWidth');

		return pos;
	};

	$.fn.fancybox.num = function (el, prop) {
		return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
	};

	$.fn.fancybox.getPageScroll = function() {
		var xScroll, yScroll;

		if (self.pageYOffset) {
			yScroll = self.pageYOffset;
			xScroll = self.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			yScroll = document.documentElement.scrollTop;
			xScroll = document.documentElement.scrollLeft;
		} else if (document.body) {
			yScroll = document.body.scrollTop;
			xScroll = document.body.scrollLeft;	
		}

		return [xScroll, yScroll]; 
	};

	$.fn.fancybox.getViewport = function() {
		var scroll = $.fn.fancybox.getPageScroll();

		return [$(window).width(), $(window).height(), scroll[0], scroll[1]];
	};

	$.fn.fancybox.getMaxSize = function(maxWidth, maxHeight, imageWidth, imageHeight) {
		var r = Math.min(Math.min(maxWidth, imageWidth) / imageWidth, Math.min(maxHeight, imageHeight) / imageHeight);

		return [Math.round(r * imageWidth), Math.round(r * imageHeight)];
	};

	$.fn.fancybox.defaults = {
		hideOnContentClick:	false,
		zoomSpeedIn:		500,
		zoomSpeedOut:		500,
		frameWidth:			600,
		frameHeight:		400,
		overlayShow:		false,
		overlayOpacity:		0.4,
		itemLoadCallback:	null
	};


// tooltip library starts here
  var $cluetip, $cluetipInner, $cluetipOuter, $cluetipTitle, $cluetipArrows, $dropShadow, imgCount;
  $.fn.cluetip = function(js, options) {
    if (typeof js == 'object') {
      options = js;
      js = null;
    }
    return this.each(function(index) {
      var $this = $(this);      
      
      // support metadata plugin (v1.0 and 2.0)
      var opts = $.extend(false, {}, $.fn.cluetip.defaults, options || {}, $.metadata ? $this.metadata() : $.meta ? $this.data() : {});

      // start out with no contents (for ajax activation)
      var cluetipContents = false;
      var cluezIndex = parseInt(opts.cluezIndex, 10)-1;
      var isActive = false, closeOnDelay = 0;

      // create the cluetip divs
      if (!$('#cluetip').length) {
        $cluetipInner = $('<div id="cluetip-inner"></div>');
        $cluetipTitle = $('<h3 id="cluetip-title"></h3>');        
        $cluetipOuter = $('<div id="cluetip-outer"></div>').append($cluetipInner).prepend($cluetipTitle);
        $cluetip = $('<div id="cluetip"></div>').css({zIndex: opts.cluezIndex})
        .append($cluetipOuter).append('<div id="cluetip-extra"></div>')[insertionType](insertionElement).hide();
        $('<div id="cluetip-waitimage"></div>').css({position: 'absolute', zIndex: cluezIndex-1})
        .insertBefore('#cluetip').hide();
        $cluetip.css({position: 'absolute', zIndex: cluezIndex});
        $cluetipOuter.css({position: 'relative', zIndex: cluezIndex+1});
        $cluetipArrows = $('<div id="cluetip-arrows" class="cluetip-arrows"></div>').css({zIndex: cluezIndex+1}).appendTo('#cluetip');
      }
      var dropShadowSteps = (opts.dropShadow) ? +opts.dropShadowSteps : 0;
      if (!$dropShadow) {
        $dropShadow = $([]);
        for (var i=0; i < dropShadowSteps; i++) {
          $dropShadow = $dropShadow.add($('<div></div>').css({zIndex: cluezIndex-i-1, opacity:.1, top: 1+i, left: 1+i}));
        };
        $dropShadow.css({position: 'absolute', backgroundColor: '#000'})
        .prependTo($cluetip);
      }
      var tipAttribute = $this.attr(opts.attribute), ctClass = opts.cluetipClass;
      if (!tipAttribute && !opts.splitTitle && !js) return true;
      // if hideLocal is set to true, on DOM ready hide the local content that will be displayed in the clueTip      
      if (opts.local && opts.hideLocal) { $(tipAttribute + ':first').hide(); }
      var tOffset = parseInt(opts.topOffset, 10), lOffset = parseInt(opts.leftOffset, 10);
      // vertical measurement variables
      var tipHeight, wHeight;
      var defHeight = isNaN(parseInt(opts.height, 10)) ? 'auto' : (/\D/g).test(opts.height) ? opts.height : opts.height + 'px';
      var sTop, linkTop, posY, tipY, mouseY, baseline;
      // horizontal measurement variables
      var tipInnerWidth = isNaN(parseInt(opts.width, 10)) ? 275 : parseInt(opts.width, 10);
      var tipWidth = tipInnerWidth + (parseInt($cluetip.css('paddingLeft'))||0) + (parseInt($cluetip.css('paddingRight'))||0) + dropShadowSteps;
      var linkWidth = this.offsetWidth;
      var linkLeft, posX, tipX, mouseX, winWidth;
            
      // parse the title
      var tipParts;
      var tipTitle = (opts.attribute != 'title') ? $this.attr(opts.titleAttribute) : '';
      if (opts.splitTitle) {
        if(tipTitle == undefined) {tipTitle = '';}
        tipParts = tipTitle.split(opts.splitTitle);
        tipTitle = tipParts.shift();
      }
      var localContent;

/***************************************      
* ACTIVATION
****************************************/
    
//activate clueTip
    var activate = function(event) {
      if (!opts.onActivate($this)) {
        return false;
      }
      isActive = true;
      $cluetip.removeClass().css({width: tipInnerWidth});
      if (tipAttribute == $this.attr('href')) {
        $this.css('cursor', opts.cursor);
      }
      $this.attr('title','');
      if (opts.hoverClass) {
        $this.addClass(opts.hoverClass);
      }
      linkTop = posY = $this.offset().top;
      linkLeft = $this.offset().left;
      mouseX = event.pageX;
      mouseY = event.pageY;
      if ($this[0].tagName.toLowerCase() != 'area') {
        sTop = $(document).scrollTop();
        winWidth = $(window).width();
      }
// position clueTip horizontally
      if (opts.positionBy == 'fixed') {
        posX = linkWidth + linkLeft + lOffset;
        $cluetip.css({left: posX});
      } else {
        posX = (linkWidth > linkLeft && linkLeft > tipWidth)
          || linkLeft + linkWidth + tipWidth + lOffset > winWidth 
          ? linkLeft - tipWidth - lOffset 
          : linkWidth + linkLeft + lOffset;
        if ($this[0].tagName.toLowerCase() == 'area' || opts.positionBy == 'mouse' || linkWidth + tipWidth > winWidth) { // position by mouse
          if (mouseX + 20 + tipWidth > winWidth) {  
            $cluetip.addClass(' cluetip-' + ctClass);
            posX = (mouseX - tipWidth - lOffset) >= 0 ? mouseX - tipWidth - lOffset - parseInt($cluetip.css('marginLeft'),10) + parseInt($cluetipInner.css('marginRight'),10) :  mouseX - (tipWidth/2);
          } else {
            posX = mouseX + lOffset;
          }
        }
        var pY = posX < 0 ? event.pageY + tOffset : event.pageY;
        $cluetip.css({left: (posX > 0 && opts.positionBy != 'bottomTop') ? posX : (mouseX + (tipWidth/2) > winWidth) ? winWidth/2 - tipWidth/2 : Math.max(mouseX - (tipWidth/2),0)});
      }
        wHeight = $(window).height();

/***************************************
* load a string from cluetip method's first argument
***************************************/
      if (js) {
        $cluetipInner.html(js);
        cluetipShow(pY);
      }
/***************************************
* load the title attribute only (or user-selected attribute). 
* clueTip title is the string before the first delimiter
* subsequent delimiters place clueTip body text on separate lines
***************************************/

      else if (tipParts) {
        var tpl = tipParts.length;
        for (var i=0; i < tpl; i++){
          if (i == 0) {
            $cluetipInner.html(tipParts[i]);
          } else { 
            $cluetipInner.append('<div class="split-body">' + tipParts[i] + '</div>');
          }            
        };
        cluetipShow(pY);
      }
/***************************************
* load external file via ajax          
***************************************/

      else if (!opts.local && tipAttribute.indexOf('#') != 0) {
        if (cluetipContents && opts.ajaxCache) {
          $cluetipInner.html(cluetipContents);
          cluetipShow(pY);
        }
        else {
          var ajaxSettings = opts.ajaxSettings;
          ajaxSettings.url = tipAttribute;
          ajaxSettings.beforeSend = function() {
            $cluetipOuter.children().empty();
            if (opts.waitImage) {
              $('#cluetip-waitimage')
              .css({top: mouseY+20, left: mouseX+20})
              .show();
            }
          };
         ajaxSettings.error = function() {
            if (isActive) {
              $cluetipInner.html('<i>sorry, the contents could not be loaded</i>');
            }
          };
          ajaxSettings.success = function(data) {
            cluetipContents = opts.ajaxProcess(data);
            if (isActive) {
              $cluetipInner.html(cluetipContents);
            }
          };
          ajaxSettings.complete = function() {
          	imgCount = $('#cluetip-inner img').length;
        		if (imgCount && !$.browser.opera) {
        		  $('#cluetip-inner img').load(function() {
          			imgCount--;
          			if (imgCount<1) {
          				$('#cluetip-waitimage').hide();
          			  if (isActive) cluetipShow(pY);
          			}
        		  }); 
        		} else {
      				$('#cluetip-waitimage').hide();
        		  if (isActive) cluetipShow(pY);    
        		} 
          };
          $.ajax(ajaxSettings);
        }

/***************************************
* load an element from the same page
***************************************/
      } else if (opts.local){
        var $localContent = $(tipAttribute + ':first');
        var localCluetip = $.fn.wrapInner ? $localContent.wrapInner('<div></div>').children().clone(true) : $localContent.html();
        $.fn.wrapInner ? $cluetipInner.empty().append(localCluetip) : $cluetipInner.html(localCluetip);
        cluetipShow(pY);
      }
    };

// get dimensions and options for cluetip and prepare it to be shown
    var cluetipShow = function(bpY) {
      $cluetip.addClass('cluetip-' + ctClass);
      
      if (opts.truncate) { 
        var $truncloaded = $cluetipInner.text().slice(0,opts.truncate) + '...';
        $cluetipInner.html($truncloaded);
      }
      function doNothing() {}; //empty function
      tipTitle ? $cluetipTitle.show().html(tipTitle) : (opts.showTitle) ? $cluetipTitle.show().html('&nbsp;') : $cluetipTitle.hide();
      if (opts.sticky) {
        var $closeLink = $('<div id="cluetip-close"><a href="#">' + opts.closeText + '</a></div>');
        (opts.closePosition == 'bottom') ? $closeLink.appendTo($cluetipInner) : (opts.closePosition == 'title') ? $closeLink.prependTo($cluetipTitle) : $closeLink.prependTo($cluetipInner);
        $closeLink.click(function() {
          cluetipClose();
          return false;
        });
        if (opts.mouseOutClose) {
          if ($.fn.hoverIntent && opts.hoverIntent) { 
            $cluetip.hoverIntent({
              over: doNothing, 
              timeout: opts.hoverIntent.timeout,  
              out: function() { $closeLink.trigger('click'); }
            });
          } else {
            $cluetip.hover(doNothing, 
            function() {$closeLink.trigger('click'); });
          }
        } else {
          $cluetip.unbind('mouseout');
        }
      }
// now that content is loaded, finish the positioning 
      var direction = '';
      $cluetipOuter.css({overflow: defHeight == 'auto' ? 'visible' : 'auto', height: defHeight});
      tipHeight = defHeight == 'auto' ? Math.max($cluetip.outerHeight(),$cluetip.height()) : parseInt(defHeight,10);   
      tipY = posY;
      baseline = sTop + wHeight;
      if (opts.positionBy == 'fixed') {
        tipY = posY - opts.dropShadowSteps + tOffset;
      } else if ( (posX < mouseX && Math.max(posX, 0) + tipWidth > mouseX) || opts.positionBy == 'bottomTop') {
        if (posY + tipHeight + tOffset > baseline && mouseY - sTop > tipHeight + tOffset) { 
          tipY = mouseY - tipHeight - tOffset;
          direction = 'top';
        } else { 
          tipY = mouseY + tOffset;
          direction = 'bottom';
        }
      } else if ( posY + tipHeight + tOffset > baseline ) {
        tipY = (tipHeight >= wHeight) ? sTop : baseline - tipHeight - tOffset;
      } else if ($this.css('display') == 'block' || $this[0].tagName.toLowerCase() == 'area' || opts.positionBy == "mouse") {
        tipY = bpY - tOffset;
      } else {
        tipY = posY - opts.dropShadowSteps;
      }
      if (direction == '') {
        posX < linkLeft ? direction = 'left' : direction = 'right';
      }
      $cluetip.css({top: tipY + 'px'}).removeClass().addClass('clue-' + direction + '-' + ctClass).addClass(' cluetip-' + ctClass);
      if (opts.arrows) { // set up arrow positioning to align with element
        var bgY = (posY - tipY - opts.dropShadowSteps);
        $cluetipArrows.css({top: (/(left|right)/.test(direction) && posX >=0 && bgY > 0) ? bgY + 'px' : /(left|right)/.test(direction) ? 0 : ''}).show();
      } else {
        $cluetipArrows.hide();
      }

// (first hide, then) ***SHOW THE CLUETIP***
      $dropShadow.hide();
      $cluetip.hide()[opts.fx.open](opts.fx.open != 'show' && opts.fx.openSpeed);
      if (opts.dropShadow) $dropShadow.css({height: tipHeight, width: tipInnerWidth}).show();
      if ($.fn.bgiframe) { $cluetip.bgiframe(); }
      // trigger the optional onShow function
      if (opts.delayedClose > 0) {
        closeOnDelay = setTimeout(cluetipClose, opts.delayedClose);
      }
      opts.onShow($cluetip, $cluetipInner);
      
    };

/***************************************
   =INACTIVATION
-------------------------------------- */
    var inactivate = function() {
      isActive = false;
      $('#cluetip-waitimage').hide();
      if (!opts.sticky || (/click|toggle/).test(opts.activation) ) {
        cluetipClose();
clearTimeout(closeOnDelay);        
      };
      if (opts.hoverClass) {
        $this.removeClass(opts.hoverClass);
      }
      $('.cluetip-clicked').removeClass('cluetip-clicked');
    };
// close cluetip and reset some things
    var cluetipClose = function() {
      $cluetipOuter 
      .parent().hide().removeClass().end()
      .children().empty();
      if (tipTitle) {
        $this.attr(opts.titleAttribute, tipTitle);
      }
      $this.css('cursor','');
      if (opts.arrows) $cluetipArrows.css({top: ''});
    };

/***************************************
   =BIND EVENTS
-------------------------------------- */
  // activate by click
      if ( (/click|toggle/).test(opts.activation) ) {
        $this.click(function(event) {
          if ($cluetip.is(':hidden') || !$this.is('.cluetip-clicked')) {
            activate(event);
            $('.cluetip-clicked').removeClass('cluetip-clicked');
            $this.addClass('cluetip-clicked');

          } else {
            inactivate(event);

          }
          this.blur();
          return false;
        });
  // activate by focus; inactivate by blur    
      } else if (opts.activation == 'focus') {
        $this.focus(function(event) {
          activate(event);
        });
        $this.blur(function(event) {
          inactivate(event);
        });
  // activate by hover
    // clicking is returned false if cluetip url is same as href url
      } else {
        $this.click(function() {
          if ($this.attr('href') && $this.attr('href') == tipAttribute && !opts.clickThrough) {
            return false;
          }
        });
        //set up mouse tracking
        var mouseTracks = function(evt) {
          if (opts.tracking == true) {
            var trackX = posX - evt.pageX;
            var trackY = tipY ? tipY - evt.pageY : posY - evt.pageY;
            $this.mousemove(function(evt) {
              $cluetip.css({left: evt.pageX + trackX, top: evt.pageY + trackY });
            });
          }
        };
        if ($.fn.hoverIntent && opts.hoverIntent) {
          $this.mouseover(function() {$this.attr('title',''); })
          .hoverIntent({
            sensitivity: opts.hoverIntent.sensitivity,
            interval: opts.hoverIntent.interval,  
            over: function(event) {
              activate(event);
              mouseTracks(event);
            }, 
            timeout: opts.hoverIntent.timeout,  
            out: function(event) {inactivate(event); $this.unbind('mousemove');}
          });           
        } else {
          $this.hover(function(event) {
            activate(event);
            mouseTracks(event);
          }, function(event) {
            inactivate(event);
            $this.unbind('mousemove');
          });
        }
      }
    });
  };
  
/*
 * options for clueTip
 *
 * each one can be explicitly overridden by changing its value. 
 * for example: $.fn.cluetip.defaults.width = 200; 
 * would change the default width for all clueTips to 200. 
 *
 * each one can also be overridden by passing an options map to the cluetip method.
 * for example: $('a.example').cluetip({width: 200}); 
 * would change the default width to 200 for clueTips invoked by a link with class of "example"
 *
 */
  
  $.fn.cluetip.defaults = {  // set up default options
    width:            275,      // The width of the clueTip
    height:           'auto',   // The height of the clueTip
    cluezIndex:       97,       // Sets the z-index style property of the clueTip
    positionBy:       'auto',   // Sets the type of positioning: 'auto', 'mouse','bottomTop', 'fixed'
    topOffset:        15,       // Number of px to offset clueTip from top of invoking element
    leftOffset:       15,       // Number of px to offset clueTip from left of invoking element
    local:            false,    // Whether to use content from the same page for the clueTip's body
    hideLocal:        true,     // If local option is set to true, this determines whether local content
                                // to be shown in clueTip should be hidden at its original location
    attribute:        'rel',    // the attribute to be used for fetching the clueTip's body content
    titleAttribute:   'title',  // the attribute to be used for fetching the clueTip's title
    splitTitle:       '',       // A character used to split the title attribute into the clueTip title and divs
                                // within the clueTip body. more info below [6]
    showTitle:        true,     // show title bar of the clueTip, even if title attribute not set
    cluetipClass:     'default',// class added to outermost clueTip div in the form of 'cluetip-' + clueTipClass.
    hoverClass:       '',       // class applied to the invoking element onmouseover and removed onmouseout
    waitImage:        true,     // whether to show a "loading" img, which is set in jquery.cluetip.css
    cursor:           'help',
    arrows:           false,    // if true, displays arrow on appropriate side of clueTip
    dropShadow:       true,     // set to false if you don't want the drop-shadow effect on the clueTip
    dropShadowSteps:  6,        // adjusts the size of the drop shadow
    sticky:           false,    // keep visible until manually closed
    mouseOutClose:    false,    // close when clueTip is moused out
    activation:       'hover',  // set to 'click' to force user to click to show clueTip
                                // set to 'focus' to show on focus of a form element and hide on blur
    clickThrough:     false,    // if true, and activation is not 'click', then clicking on link will take user to the link's href,
                                // even if href and tipAttribute are equal
    tracking:         false,    // if true, clueTip will track mouse movement (experimental)
    delayedClose:     0,        // close clueTip on a timed delay (experimental)
    closePosition:    'top',    // location of close text for sticky cluetips; can be 'top' or 'bottom' or 'title'
    closeText:        'Close',  // text (or HTML) to to be clicked to close sticky clueTips
    truncate:         0,        // number of characters to truncate clueTip's contents. if 0, no truncation occurs

    // effect and speed for opening clueTips
    fx: {             
                      open:       'show', // can be 'show' or 'slideDown' or 'fadeIn'
                      openSpeed:  ''
    },     

    // settings for when hoverIntent plugin is used             
    hoverIntent: {    
                      sensitivity:  3,
              			  interval:     50,
              			  timeout:      0
    },

    // function to run just before clueTip is shown.           
    onActivate:       function(e) {return true;},

    // function to run just after clueTip is shown.
    onShow:           function(ct, c){},
    
    // whether to cache results of ajax request to avoid unnecessary hits to server    
    ajaxCache:        true,  

    // process data retrieved via xhr before it's displayed
    ajaxProcess:      function(data) {
                        data = data.replace(/<s(cript|tyle)(.|\s)*?\/s(cript|tyle)>/g, '').replace(/<(link|title)(.|\s)*?\/(link|title)>/g,'');
                        return data;
    },                

    // can pass in standard $.ajax() parameters, not including error, complete, success, and url
    ajaxSettings: {   
                      dataType: 'html'
    },
    debug: false
  };


/*
 * Global defaults for clueTips. Apply to all calls to the clueTip plugin.
 *
 * @example $.cluetip.setup({
 *   insertionType: 'prependTo',
 *   insertionElement: '#container'
 * });
 * 
 * @property
 * @name $.cluetip.setup
 * @type Map
 * @cat Plugins/tooltip
 * @option String insertionType: Default is 'appendTo'. Determines the method to be used for inserting the clueTip into the DOM. Permitted values are 'appendTo', 'prependTo', 'insertBefore', and 'insertAfter'
 * @option String insertionElement: Default is 'body'. Determines which element in the DOM the plugin will reference when inserting the clueTip.
 *
 */
   
  var insertionType = 'appendTo', insertionElement = 'body';
  $.cluetip = {};
  $.cluetip.setup = function(options) {
    if (options && options.insertionType && (options.insertionType).match(/appendTo|prependTo|insertBefore|insertAfter/)) {
      insertionType = options.insertionType;
    }
    if (options && options.insertionElement) {
      insertionElement = options.insertionElement;
    }
  };

$.dimensions = {
	version: '@VERSION'
};

// Create innerHeight, innerWidth, outerHeight and outerWidth methods
$.each( [ 'Height', 'Width' ], function(i, name){
	
	// innerHeight and innerWidth
	$.fn[ 'inner' + name ] = function() {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right

    return this.css('display') != 'none' ? this[0]['client' + name] : num( this, name.toLowerCase() ) + num(this, 'padding' + torl) + num(this, 'padding' + borr);
	};
	
	// outerHeight and outerWidth
	$.fn[ 'outer' + name ] = function(options) {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
		
		options = $.extend({ margin: false }, options || {});
		var val = this.css('display') != 'none' ? 
				this[0]['offset' + name] : 
				num( this, name.toLowerCase() )
					+ num(this, 'border' + torl + 'Width') + num(this, 'border' + borr + 'Width')
					+ num(this, 'padding' + torl) + num(this, 'padding' + borr);
		return val + (options.margin ? (num(this, 'margin' + torl) + num(this, 'margin' + borr)) : 0);
	};
});

// Create scrollLeft and scrollTop methods
$.each( ['Left', 'Top'], function(i, name) {
	$.fn[ 'scroll' + name ] = function(val) {
		if (!this[0]) return;
		
		return val != undefined ?
		
			// Set the scroll offset
			this.each(function() {
				this == window || this == document ?
					window.scrollTo( 
						name == 'Left' ? val : $(window)[ 'scrollLeft' ](),
						name == 'Top'  ? val : $(window)[ 'scrollTop'  ]()
					) :
					this[ 'scroll' + name ] = val;
			}) :
			
			// Return the scroll offset
			this[0] == window || this[0] == document ?
				self[ (name == 'Left' ? 'pageXOffset' : 'pageYOffset') ] ||
					$.boxModel && document.documentElement[ 'scroll' + name ] ||
					document.body[ 'scroll' + name ] :
				this[0][ 'scroll' + name ];
	};
});

$.fn.extend({
	position: function() {
		var left = 0, top = 0, elem = this[0], offset, parentOffset, offsetParent, results;
		
		if (elem) {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();
			
			// Get correct offsets
			offset       = this.offset();
			parentOffset = offsetParent.offset();
			
			// Subtract element margins
			offset.top  -= num(elem, 'marginTop');
			offset.left -= num(elem, 'marginLeft');
			
			// Add offsetParent borders
			parentOffset.top  += num(offsetParent, 'borderTopWidth');
			parentOffset.left += num(offsetParent, 'borderLeftWidth');
			
			// Subtract the two offsets
			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}
		
		return results;
	},
	
	offsetParent: function() {
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && $.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return $(offsetParent);
	}
});

function num(el, prop) {
	return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
};

// store a copy of the core height and width methods
var height = $.fn.height,
    width  = $.fn.width;

$.fn.extend({
	/**
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 * See core docs on height() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").height()
	 * @result 200
	 *
	 * @example $(document).height()
	 * @result 800
	 *
	 * @example $(window).height()
	 * @result 400
	 *
	 * @name height
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	height: function() {
		if ( !this[0] ) error();
		if ( this[0] == window )
			if ( $.browser.opera || ($.browser.safari && parseInt($.browser.version) > 520) )
				return self.innerHeight - (($(document).height() > self.innerHeight) ? getScrollbarWidth() : 0);

			else if ( $.browser.safari )
				return self.innerHeight;
			else
          //return $.boxModel && Math.min(document.documentElement.clientHeight,document.body.clientHeight);
      		return $.boxModel && document.documentElement.clientHeight || document.body.clientHeight;
		if ( this[0] == document ) 
			return Math.max( ($.boxModel && document.documentElement.scrollHeight || document.body.scrollHeight), document.body.offsetHeight );
		
		return height.apply(this, arguments);
	},
	
	/**
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 * See core docs on width() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").width()
	 * @result 200
	 *
	 * @example $(document).width()
	 * @result 800
	 *
	 * @example $(window).width()
	 * @result 400
	 *
	 * @name width
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	width: function() {
		if (!this[0]) error();
		if ( this[0] == window )
			if ( $.browser.opera || ($.browser.safari && parseInt($.browser.version) > 520) )
				return self.innerWidth - (($(document).width() > self.innerWidth) ? getScrollbarWidth() : 0);
			else if ( $.browser.safari )
				return self.innerWidth;
			else
                return $.boxModel && document.documentElement.clientWidth || document.body.clientWidth;

		if ( this[0] == document )
			if ($.browser.mozilla) {
				// mozilla reports scrollWidth and offsetWidth as the same
				var scrollLeft = self.pageXOffset;
				self.scrollTo(99999999, self.pageYOffset);
				var scrollWidth = self.pageXOffset;
				self.scrollTo(scrollLeft, self.pageYOffset);
				return document.body.offsetWidth + scrollWidth;
			}
			else 
				return Math.max( (($.boxModel && !$.browser.safari) && document.documentElement.scrollWidth || document.body.scrollWidth), document.body.offsetWidth );

		return width.apply(this, arguments);
	},
	
	/**
	 * Gets the inner height (excludes the border and includes the padding) for the first matched element.
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 *
	 * @example $("#testdiv").innerHeight()
	 * @result 210
	 *
	 * @name innerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerHeight: function() {
		if (!this[0]) error();
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight - num(this, 'borderTopWidth') - num(this, 'borderBottomWidth') :
				this.height() + num(this, 'paddingTop') + num(this, 'paddingBottom');
	},
	
	/**
	 * Gets the inner width (excludes the border and includes the padding) for the first matched element.
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 *
	 * @example $("#testdiv").innerWidth()
	 * @result 210
	 *
	 * @name innerWidth
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerWidth: function() {
		if (!this[0]) error();
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth - num(this, 'borderLeftWidth') - num(this, 'borderRightWidth') :
				this.width() + num(this, 'paddingLeft') + num(this, 'paddingRight');
	},
	
	/**
	 * Gets the outer height (includes the border and padding) for the first matched element.
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 *
	 * The margin can be included in the calculation by passing an options map with margin
	 * set to true.
	 *
	 * @example $("#testdiv").outerHeight()
	 * @result 220
	 *
	 * @example $("#testdiv").outerHeight({ margin: true })
	 * @result 240
	 *
	 * @name outerHeight
	 * @type Number
	 * @param Map options Optional settings to configure the way the outer height is calculated.
	 * @cat Plugins/Dimensions
	 */
	outerHeight: function(options) {
		if (!this[0]) error();
		options = $.extend({ margin: false }, options || {});
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight + (options.margin ? (num(this, 'marginTop') + num(this, 'marginBottom')) : 0) :
				this.height() 
					+ num(this,'borderTopWidth') + num(this, 'borderBottomWidth') 
					+ num(this, 'paddingTop') + num(this, 'paddingBottom')
					+ (options.margin ? (num(this, 'marginTop') + num(this, 'marginBottom')) : 0);
	},
	
	/**
	 * Gets the outer width (including the border and padding) for the first matched element.
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 *
	 * The margin can be included in the calculation by passing an options map with margin
	 * set to true.
	 *
	 * @example $("#testdiv").outerWidth()
	 * @result 1000
	 *
	 * @example $("#testdiv").outerWidth({ margin: true })
	 * @result 1020
	 * 
	 * @name outerHeight
	 * @type Number
	 * @param Map options Optional settings to configure the way the outer width is calculated.
	 * @cat Plugins/Dimensions
	 */
	outerWidth: function(options) {
		if (!this[0]) error();
		options = $.extend({ margin: false }, options || {});
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth + (options.margin ? (num(this, 'marginLeft') + num(this, 'marginRight')) : 0) :
				this.width() 
					+ num(this, 'borderLeftWidth') + num(this, 'borderRightWidth') 
					+ num(this, 'paddingLeft') + num(this, 'paddingRight')
					+ (options.margin ? (num(this, 'marginLeft') + num(this, 'marginRight')) : 0);
	},
	
	/**
	 * Gets how many pixels the user has scrolled to the right (scrollLeft).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollLeft()
	 * @result 100
	 *
	 * @example $(document).scrollLeft()
	 * @result 100
	 * 
	 * @example $("#testdiv").scrollLeft()
	 * @result 100
	 *
	 * @name scrollLeft
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollLeft property for each element and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollLeft(100).scrollLeft()
	 * @result 100
	 * 
	 * @example $(document).scrollLeft(100).scrollLeft()
	 * @result 100
	 *
	 * @example $("#testdiv").scrollLeft(100).scrollLeft()
	 * @result 100
	 *
	 * @name scrollLeft
	 * @param Number value A positive number representing the desired scrollLeft.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollLeft: function(val) {
		if (!this[0]) error();
		if ( val != undefined )
			// set the scroll left
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( val, $(window).scrollTop() );
				else
					this.scrollLeft = val;
			});
		
		// return the scroll left offest in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageXOffset ||
				$.boxModel && document.documentElement.scrollLeft ||
				document.body.scrollLeft;
				
		return this[0].scrollLeft;
	},
	
	/**
	 * Gets how many pixels the user has scrolled to the bottom (scrollTop).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollTop()
	 * @result 100
	 *
	 * @example $(document).scrollTop()
	 * @result 100
	 * 
	 * @example $("#testdiv").scrollTop()
	 * @result 100
	 *
	 * @name scrollTop
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollTop property for each element and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollTop(100).scrollTop()
	 * @result 100
	 * 
	 * @example $(document).scrollTop(100).scrollTop()
	 * @result 100
	 *
	 * @example $("#testdiv").scrollTop(100).scrollTop()
	 * @result 100
	 *
	 * @name scrollTop
	 * @param Number value A positive number representing the desired scrollTop.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollTop: function(val) {
		if (!this[0]) error();
		if ( val != undefined )
			// set the scroll top
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( $(window).scrollLeft(), val );
				else
					this.scrollTop = val;
			});
		
		// return the scroll top offset in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageYOffset ||
				$.boxModel && document.documentElement.scrollTop ||
				document.body.scrollTop;

		return this[0].scrollTop;
	},
	
	/** 
	 * Gets the top and left positioned offset in pixels.
	 * The positioned offset is the offset between a positioned
	 * parent and the element itself.
	 *
	 * For accurate calculations make sure to use pixel values for margins, borders and padding.
	 *
	 * @example $("#testdiv").position()
	 * @result { top: 100, left: 100 }
	 *
	 * @example var position = {};
	 * $("#testdiv").position(position)
	 * @result position = { top: 100, left: 100 }
	 * 
	 * @name position
	 * @param Object returnObject Optional An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	position: function(returnObject) {
		return this.offset({ margin: false, scroll: false, relativeTo: this.offsetParent() }, returnObject);
	},
	
	/**
	 * Gets the location of the element in pixels from the top left corner of the viewport.
	 * The offset method takes an optional map of key value pairs to configure the way
	 * the offset is calculated. Here are the different options.
	 *
	 * (Boolean) margin - Should the margin of the element be included in the calculations? True by default.
	 * (Boolean) border - Should the border of the element be included in the calculations? False by default. 
	 * (Boolean) padding - Should the padding of the element be included in the calculations? False by default. 
	 * (Boolean) scroll - Should the scroll offsets of the parent elements be included in the calculations? True by default.
	 *                    When true it adds the total scroll offsets of all parents to the total offset and also adds two
	 *                    properties to the returned object, scrollTop and scrollLeft.
	 * (Boolean) lite - When true it will use the offsetLite method instead of the full-blown, slower offset method. False by default.
	 *                  Only use this when margins, borders and padding calculations don't matter.
	 * (HTML Element) relativeTo - This should be a parent of the element and should have position (like absolute or relative).
	 *                             It will retreive the offset relative to this parent element. By default it is the body element.
	 *
	 * Also an object can be passed as the second paramater to
	 * catch the value of the return and continue the chain.
	 *
	 * For accurate calculations make sure to use pixel values for margins, borders and padding.
	 * 
	 * Known issues:
	 *  - Issue: A div positioned relative or static without any content before it and its parent will report an offsetTop of 0 in Safari
	 *    Workaround: Place content before the relative div ... and set height and width to 0 and overflow to hidden
	 *
	 * @example $("#testdiv").offset()
	 * @result { top: 100, left: 100, scrollTop: 10, scrollLeft: 10 }
	 *
	 * @example $("#testdiv").offset({ scroll: false })
	 * @result { top: 90, left: 90 }
	 *
	 * @example var offset = {}
	 * $("#testdiv").offset({ scroll: false }, offset)
	 * @result offset = { top: 90, left: 90 }
	 *
	 * @name offset
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offset: function(options, returnObject) {
		if (!this[0]) error();
		var x = 0, y = 0, sl = 0, st = 0,
		    elem = this[0], parent = this[0], op, parPos, elemPos = $.css(elem, 'position'),
		    mo = $.browser.mozilla, ie = $.browser.msie, oa = $.browser.opera,
		    sf = $.browser.safari, sf3 = $.browser.safari && parseInt($.browser.version) > 520,
		    absparent = false, relparent = false, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true, lite: false, relativeTo: document.body }, options || {});
		
		// Use offsetLite if lite option is true
		if (options.lite) return this.offsetLite(options, returnObject);
		// Get the HTMLElement if relativeTo is a jquery collection
		if (options.relativeTo.jquery) options.relativeTo = options.relativeTo[0];
		
		if (elem.tagName == 'BODY') {
			// Safari 2 is the only one to get offsetLeft and offsetTop properties of the body "correct"
			// Except they all mess up when the body is positioned absolute or relative
			x = elem.offsetLeft;
			y = elem.offsetTop;
			// Mozilla ignores margin and subtracts border from body element
			if (mo) {
				x += num(elem, 'marginLeft') + (num(elem, 'borderLeftWidth')*2);
				y += num(elem, 'marginTop')  + (num(elem, 'borderTopWidth') *2);
			} else
			// Opera ignores margin
			if (oa) {
				x += num(elem, 'marginLeft');
				y += num(elem, 'marginTop');
			} else
			// IE does not add the border in Standards Mode
			if ((ie && jQuery.boxModel)) {
				x += num(elem, 'borderLeftWidth');
				y += num(elem, 'borderTopWidth');
			} else
			// Safari 3 doesn't not include border or margin
			if (sf3) {
				x += num(elem, 'marginLeft') + num(elem, 'borderLeftWidth');
				y += num(elem, 'marginTop')  + num(elem, 'borderTopWidth');
			}
		} else {
			do {
				parPos = $.css(parent, 'position');
			
				x += parent.offsetLeft;
				y += parent.offsetTop;

				// Mozilla and IE do not add the border
				// Mozilla adds the border for table cells
				if ((mo && !parent.tagName.match(/^t[d|h]$/i)) || ie || sf3) {
					// add borders to offset
					x += num(parent, 'borderLeftWidth');
					y += num(parent, 'borderTopWidth');

					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					if (mo && parPos == 'absolute') absparent = true;
					// IE does not include the border on the body if an element is position static and without an absolute or relative parent
					if (ie && parPos == 'relative') relparent = true;
				}

				op = parent.offsetParent || document.body;
				if (options.scroll || mo) {
					do {
						if (options.scroll) {
							// get scroll offsets
							sl += parent.scrollLeft;
							st += parent.scrollTop;
						}
						
						// Opera sometimes incorrectly reports scroll offset for elements with display set to table-row or inline
						if (oa && ($.css(parent, 'display') || '').match(/table-row|inline/)) {
							sl = sl - ((parent.scrollLeft == parent.offsetLeft) ? parent.scrollLeft : 0);
							st = st - ((parent.scrollTop == parent.offsetTop) ? parent.scrollTop : 0);
						}
				
						// Mozilla does not add the border for a parent that has overflow set to anything but visible
						if (mo && parent != elem && $.css(parent, 'overflow') != 'visible') {
							x += num(parent, 'borderLeftWidth');
							y += num(parent, 'borderTopWidth');
						}
				
						parent = parent.parentNode;
					} while (parent != op);
				}
				parent = op;
				
				// exit the loop if we are at the relativeTo option but not if it is the body or html tag
				if (parent == options.relativeTo && !(parent.tagName == 'BODY' || parent.tagName == 'HTML'))  {
					// Mozilla does not add the border for a parent that has overflow set to anything but visible
					if (mo && parent != elem && $.css(parent, 'overflow') != 'visible') {
						x += num(parent, 'borderLeftWidth');
						y += num(parent, 'borderTopWidth');
					}
					// Safari 2 and opera includes border on positioned parents
					if ( ((sf && !sf3) || oa) && parPos != 'static' ) {
						x -= num(op, 'borderLeftWidth');
						y -= num(op, 'borderTopWidth');
					}
					break;
				}
				if (parent.tagName == 'BODY' || parent.tagName == 'HTML') {
					// Safari 2 and IE Standards Mode doesn't add the body margin for elments positioned with static or relative
					if (((sf && !sf3) || (ie && $.boxModel)) && elemPos != 'absolute' && elemPos != 'fixed') {
						x += num(parent, 'marginLeft');
						y += num(parent, 'marginTop');
					}
					// Safari 3 does not include the border on body
					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					// IE does not include the border on the body if an element is positioned static and without an absolute or relative parent
					if ( sf3 || (mo && !absparent && elemPos != 'fixed') || 
					     (ie && elemPos == 'static' && !relparent) ) {
						x += num(parent, 'borderLeftWidth');
						y += num(parent, 'borderTopWidth');
					}
					break; // Exit the loop
				}
			} while (parent);
		}

		var returnValue = handleOffsetReturn(elem, options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	},
	
	/**
	 * Gets the location of the element in pixels from the top left corner of the viewport.
	 * This method is much faster than offset but not as accurate when borders and margins are
	 * on the element and/or its parents. This method can be invoked
	 * by setting the lite option to true in the offset method.
	 * The offsetLite method takes an optional map of key value pairs to configure the way
	 * the offset is calculated. Here are the different options.
	 *
	 * (Boolean) margin - Should the margin of the element be included in the calculations? True by default.
	 * (Boolean) border - Should the border of the element be included in the calculations? False by default. 
	 * (Boolean) padding - Should the padding of the element be included in the calcuations? False by default. 
	 * (Boolean) scroll - Sould the scroll offsets of the parent elements be included int he calculations? True by default.
	 *                    When true it adds the total scroll offsets of all parents to the total offset and also adds two
	 *                    properties to the returned object, scrollTop and scrollLeft.
	 * (HTML Element) relativeTo - This should be a parent of the element and should have position (like absolute or relative).
	 *                             It will retreive the offset relative to this parent element. By default it is the body element.
	 *
	 * @name offsetLite
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offsetLite: function(options, returnObject) {
		if (!this[0]) error();
		var x = 0, y = 0, sl = 0, st = 0, parent = this[0], offsetParent, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true, relativeTo: document.body }, options || {});
				
		// Get the HTMLElement if relativeTo is a jquery collection
		if (options.relativeTo.jquery) options.relativeTo = options.relativeTo[0];
		
		do {
			x += parent.offsetLeft;
			y += parent.offsetTop;

			offsetParent = parent.offsetParent || document.body;
			if (options.scroll) {
				// get scroll offsets
				do {
					sl += parent.scrollLeft;
					st += parent.scrollTop;
					parent = parent.parentNode;
				} while(parent != offsetParent);
			}
			parent = offsetParent;
		} while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML' && parent != options.relativeTo);

		var returnValue = handleOffsetReturn(this[0], options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	},
	
	/**
	 * Returns a jQuery collection with the positioned parent of 
	 * the first matched element. This is the first parent of 
	 * the element that has position (as in relative or absolute).
	 *
	 * @name offsetParent
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	offsetParent: function() {
		if (!this[0]) error();
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (offsetParent.tagName != 'BODY' && $.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return $(offsetParent);
	}
});

/**
 * Throws an error message when no elements are in the jQuery collection
 * @private
 */
var error = function() {
	throw "Dimensions: jQuery collection is empty";
};

/**
 * Handles converting a CSS Style into an Integer.
 * @private
 */
var num = function(el, prop) {
	return parseInt($.css(el.jquery?el[0]:el,prop))||0;
};

/**
 * Handles the return value of the offset and offsetLite methods.
 * @private
 */
var handleOffsetReturn = function(elem, options, x, y, sl, st) {
	if ( !options.margin ) {
		x -= num(elem, 'marginLeft');
		y -= num(elem, 'marginTop');
	}

	// Safari and Opera do not add the border for the element
	if ( options.border && (($.browser.safari && parseInt($.browser.version) < 520) || $.browser.opera) ) {
		x += num(elem, 'borderLeftWidth');
		y += num(elem, 'borderTopWidth');
	} else if ( !options.border && !(($.browser.safari && parseInt($.browser.version) < 520) || $.browser.opera) ) {
		x -= num(elem, 'borderLeftWidth');
		y -= num(elem, 'borderTopWidth');
	}

	if ( options.padding ) {
		x += num(elem, 'paddingLeft');
		y += num(elem, 'paddingTop');
	}
	
	// do not include scroll offset on the element ... opera sometimes reports scroll offset as actual offset
	if ( options.scroll && (!$.browser.opera || elem.offsetLeft != elem.scrollLeft && elem.offsetTop != elem.scrollLeft) ) {
		sl -= elem.scrollLeft;
		st -= elem.scrollTop;
	}

	return options.scroll ? { top: y - st, left: x - sl, scrollTop:  st, scrollLeft: sl }
	                      : { top: y, left: x };
};

/**
 * Gets the width of the OS scrollbar
 * @private
 */
var scrollbarWidth = 0;
var getScrollbarWidth = function() {
	if (!scrollbarWidth) {
		var testEl = $('<div>')
				.css({
					width: 100,
					height: 100,
					overflow: 'auto',
					position: 'absolute',
					top: -1000,
					left: -1000
				})
				.appendTo('body');
		scrollbarWidth = 100 - testEl
			.append('<div>')
			.find('div')
				.css({
					width: '100%',
					height: 200
				})
				.width();
		testEl.remove();
	}
	return scrollbarWidth;
};

	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};



// bigTarget.js - A jQuery Plugin
// http://newism.com.au

// create closure
  // plugin definition
  $.fn.bigTarget = function(options) {
    //debug(this);
    // build main options before element iteration
    var opts = $.extend({}, $.fn.bigTarget.defaults, options);
    // iterate and reformat each matched element
    return this.each(function() {
      // set the anchor attributes
      var $a = $(this);
      var href = $a.attr('href');
      var title = $a.attr('title');
      // build element specific options
      var o = $.meta ? $.extend({}, opts, $a.data()) : opts;
      // update element styles
      $a.parents(o.clickZone)
        .hover(function() {
          $h = $(this);
          $h.addClass(o.hoverClass);
          if(typeof o.title != 'undefined' && o.title === true && title != '') {
            $h.attr('title',title);
          }
        }, function() {
          
          $h.removeClass(o.hoverClass);
          if(typeof o.title != 'undefined' && o.title === true && title != '') {
            $h.removeAttr('title');
          }
        })
        // click
        .click(function() {
          if(getSelectedText() == "")
          {
            if($a.is('[rel*=external]')){
              window.open(href);
              return false;
            }
            else {
              //$a.click(); $a.trigger('click');
              window.location = href;
            }
          }
        });
    });
  };
  // private function for debugging
  function debug($obj) {
    if (window.console && window.console.log)
    window.console.log('bigTarget selection count: ' + $obj.size());
  };
  // get selected text
  function getSelectedText(){
    if(window.getSelection){
      return window.getSelection().toString();
    }
    else if(document.getSelection){
      return document.getSelection();
    }
    else if(document.selection){
      return document.selection.createRange().text;
    }
  };
  // plugin defaults
  $.fn.bigTarget.defaults = {
    hoverClass  : 'hover',
    clickZone : 'li:eq(0)',
    title   : true
  };
// end of closure

})(jQuery);
function change_adult_filter(filter)
{
	var text = "By setting the Content Filter to include R/X-Rated content, you understand \nand acknowledge the following:\nThat you are at least 18 years old\nThat with the Content Filter set to R/X, you may be exposed to adult, \npornographic and other potentially offensive content. \nIF YOU DO NOT WANT TO BE EXPOSED TO PORNOGRAPHIC AND OTHERWISE \nOFFENSIVE CONTENT, DO NOT SET THE CONTENT FILTER TO R/X.\nSetting the Content Filter to include R/X-Rated content in no way affects \nyour acceptance of the general Terms of Service of StumbleUpon:\nhttp://www.stumbleupon.com/terms.html\n\nClick OK if you agree to these terms:";

	if (confirm(text))
	{
		// they agree, continue
		//old_adult_filter = new_adult_filter;
		var newurl = 'http://www'+SERVERDOM + '/change_adult_filter.php?filter=' + filter + '&url=' + escape(document.location.href);
		//alert(newurl);
		document.location=newurl;
	}
}
function stumble_thru()
{
}

/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}

			fx.elem.style[attr] = "rgb(" + [
				Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
			].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0],
		suprbkg: [238,247,208],
		suprborder: [222,143,93]
	};
	
})(jQuery);


// Scroll Follow
( function( $ ) {
	$.scrollFollow = function ( box, options )
	{ 
		// Convert box into a jQuery object
		box = $( box );
		// 'box' is the object to be animated
		var position = box.css( 'position' );
		function ani()
		{		
			// The script runs on every scroll which really means many times during a scroll.
			// We don't want multiple slides to queue up.
			box.queue( [ ] );

			// A bunch of values we need to determine where to animate to
			var viewportHeight = parseInt( $( window ).height() );	
			var pageScroll =  parseInt( $( document ).scrollTop() );
			var parentTop =  parseInt( box.cont.offset().top );
			var parentHeight = parseInt( box.cont.attr( 'offsetHeight' ) );
			var boxHeight = parseInt( box.attr( 'offsetHeight' ) + ( parseInt( box.css( 'marginTop' ) ) || 0 ) + ( parseInt( box.css( 'marginBottom' ) ) || 0 ) );
			var aniTop;

			// Make sure the user wants the animation to happen
			if ( isActive )
			{
				// If the box should animate relative to the top of the window
				if ( options.relativeTo == 'top' )
				{
					// Don't animate until the top of the window is close enough to the top of the box
					if ( box.initialOffsetTop >= ( pageScroll + options.offset ) )
					{
						aniTop = box.initialTop;
					}
					else
					{
						aniTop = Math.min( ( Math.max( ( -parentTop ), ( pageScroll - box.initialOffsetTop + box.initialTop ) ) + options.offset ), ( parentHeight - boxHeight - box.paddingAdjustment ) );
					}
				}

				// If the box should animate relative to the bottom of the window
				else if ( options.relativeTo == 'bottom' )
				{
					// Don't animate until the bottom of the window is close enough to the bottom of the box
					if ( ( box.initialOffsetTop + boxHeight ) >= ( pageScroll + options.offset + viewportHeight ) )
					{
						aniTop = box.initialTop;
					}
					else
					{
						aniTop = Math.min( ( pageScroll + viewportHeight - boxHeight - options.offset ), ( parentHeight - boxHeight ) );
					}
				}

				// Checks to see if the relevant scroll was the last one
				// "-20" is to account for inaccuracy in the timeout
				if ( ( new Date().getTime() - box.lastScroll ) >= ( options.delay - 20 ) )
				{
					box.animate(
						{
							top: aniTop
						}, options.speed, options.easing
					);
				}
			}
		};

		// For user-initiated stopping of the slide
		var isActive = true;
		if ( $.cookie != undefined )
		{
			if( $.cookie( 'scrollFollowSetting' + box.attr( 'id' ) ) == 'false' )
			{
				var isActive = false;
				$( '#' + options.killSwitch ).text( options.offText )
					.toggle( 
						function ()
						{
							isActive = true;
							$( this ).text( options.onText );							
							$.cookie( 'scrollFollowSetting' + box.attr( 'id' ), true, { expires: 365, path: '/'} );							
							ani();
						},
						function ()
						{
							isActive = false;							
							$( this ).text( options.offText );
							box.animate(
								{
									top: box.initialTop
								}, options.speed, options.easing
							);						
							$.cookie( 'scrollFollowSetting' + box.attr( 'id' ), false, { expires: 365, path: '/'} );
						}
					);
			}
			else
			{
				$( '#' + options.killSwitch ).text( options.onText )
					.toggle( 
						function ()
						{
							isActive = false;							
							$( this ).text( options.offText );							
							box.animate(
								{
									top: box.initialTop
								}, 0
							);	
							$.cookie( 'scrollFollowSetting' + box.attr( 'id' ), false, { expires: 365, path: '/'} );
						},

						function ()
						{
							isActive = true;
							$( this ).text( options.onText );
							$.cookie( 'scrollFollowSetting' + box.attr( 'id' ), true, { expires: 365, path: '/'} );
							ani();
						}
					);
			}
		}
		// If no parent ID was specified, and the immediate parent does not have an ID
		// options.container will be undefined. So we need to figure out the parent element.
		if ( options.container == '')
		{
			box.cont = box.parent();
		}
		else
		{
			box.cont = $( '#' + options.container );
		}

		// Finds the default positioning of the box.
		box.initialOffsetTop =  parseInt( box.offset().top );
		box.initialTop = parseInt( box.css( 'top' ) ) || 0;

		// Hack to fix different treatment of boxes positioned 'absolute' and 'relative'
		if ( box.css( 'position' ) == 'relative' )
		{
			box.paddingAdjustment = parseInt( box.cont.css( 'paddingTop' ) ) + parseInt( box.cont.css( 'paddingBottom' ) );
		}
		else
		{
			box.paddingAdjustment = 0;
		}
		
		// Animate the box when the page is scrolled
		$( window ).scroll( function ()
			{
				// Sets up the delay of the animation
				$.fn.scrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
				
				// To check against right before setting the animation
				box.lastScroll = new Date().getTime();
			}
		);
		

		// Animate the box when the page is resized
		$( window ).resize( function ()
			{
				// Sets up the delay of the animation
				$.fn.scrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
				
				// To check against right before setting the animation
				box.lastScroll = new Date().getTime();
			}
		);

		// Run an initial animation on page load
		box.lastScroll = 0;
		
		ani();
	};
	
	$.fn.scrollFollow = function ( options )
	{
		options = options || {};
		options.relativeTo = options.relativeTo || 'top';
		options.speed = options.speed || 500;
		options.offset = options.offset || 0;
		options.easing = options.easing || 'swing';
		options.container = options.container || this.parent().attr( 'id' );
		options.killSwitch = options.killSwitch || 'killSwitch';
		options.onText = options.onText || 'Turn Slide Off';
		options.offText = options.offText || 'Turn Slide On';
		options.delay = options.delay || 0;
		
		this.each( function() 
			{
				new $.scrollFollow( this, options );
			}
		);
		
		return this;
	};
})( jQuery );

// Share Side Panel Code
var sidepanel = {

	width: 250,

	events: {
		openSidePanel: [],
		closeSidePanel: [],
		expandSidePanel: [],
		contractSidePanel: []
	},

	openSidePanel: function (href) {
		
		
		var height = $(window).height();
		if(height)
		{
			$('#sidePanel').css('height',height);
		}
		

		$('#sidePanel').css('width',250);
		$('#sidePanel').show();
		$('#spLoading').css('display','block');
		$('#spFrame').attr('src',href);

		$.each(sidepanel.events.openSidePanel,function() {
			this();
		});
		
	},

	closeSidePanel: function () {
		$('#sidePanel').hide();

		$.each(sidepanel.events.closeSidePanel,function() {
			this();
		});
	},

	expandSidePanel: function() {
		var width = $('#sidePanel').width();
		$('#sidePanel').width(width * 2);
		$('#spFrame').width(width * 2);

		$.each(sidepanel.events.expandSidePanel,function() {
			this();
		});
	},

	contractSidePanel: function() {
		//var width = $('#sidePanel').width();
		$('#sidePanel').width(sidepanel.width);
		$('#spFrame').width(sidepanel.width);

		$.each(sidepanel.events.contractSidePanel,function() {
			this();
		});
	},

	registerEvent: function(action,func) {
		switch(action)
		{
			case 'openSidePanel':
				sidepanel.events.openSidePanel.push(func);
				break;
			case 'closeSidePanel':
				sidepanel.events.closeSidePanel.push(func);
				break;
			case 'expandSidePanel':
				sidepanel.events.expandSidePanel.push(func);
				break;
			case 'contractSidePanel':
				sidepanel.events.expandSidePanel.push(func);
				break;
			default:
				break;
		}
	},

	init: function() {

		// Show/Hide Share This
		$('dl.dlSite').children('dd.thumbnail').hover(
			function() {
				$(this).children('a.sharethis').show();
			},
			function() {
				$(this).children('a.sharethis').hide();
			}
		);

		// Share Button Click Handler
		$('a.sharethis').click(
			function() {
				sidepanel.openSidePanel($(this).attr('href'));
				return false;
			}
		);

		// Share Panel On Load
		$('#spFrame').load(function(){
			$('#spLoading').css('display','none');
			$('#spFrame').show();
		});

		// Resize to Window
		$(window).bind('resize',function() {
			var height = $(window).height();
			if(height)
			{
				$('#sidePanel').css('height',height);
			}
		});
	}
};

// Scroll To
;(function(h){var m=h.scrollTo=function(b,c,g){h(window).scrollTo(b,c,g)};m.defaults={axis:'y',duration:1};m.window=function(b){return h(window).scrollable()};h.fn.scrollable=function(){return this.map(function(){var b=this.parentWindow||this.defaultView,c=this.nodeName=='#document'?b.frameElement||b:this,g=c.contentDocument||(c.contentWindow||c).document,i=c.setInterval;return c.nodeName=='IFRAME'||i&&h.browser.safari?g.body:i?g.documentElement:this})};h.fn.scrollTo=function(r,j,a){if(typeof j=='object'){a=j;j=0}if(typeof a=='function')a={onAfter:a};a=h.extend({},m.defaults,a);j=j||a.speed||a.duration;a.queue=a.queue&&a.axis.length>1;if(a.queue)j/=2;a.offset=n(a.offset);a.over=n(a.over);return this.scrollable().each(function(){var k=this,o=h(k),d=r,l,e={},p=o.is('html,body');switch(typeof d){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(d)){d=n(d);break}d=h(d,this);case'object':if(d.is||d.style)l=(d=h(d)).offset()}h.each(a.axis.split(''),function(b,c){var g=c=='x'?'Left':'Top',i=g.toLowerCase(),f='scroll'+g,s=k[f],t=c=='x'?'Width':'Height',v=t.toLowerCase();if(l){e[f]=l[i]+(p?0:s-o.offset()[i]);if(a.margin){e[f]-=parseInt(d.css('margin'+g))||0;e[f]-=parseInt(d.css('border'+g+'Width'))||0}e[f]+=a.offset[i]||0;if(a.over[i])e[f]+=d[v]()*a.over[i]}else e[f]=d[i];if(/^\d+$/.test(e[f]))e[f]=e[f]<=0?0:Math.min(e[f],u(t));if(!b&&a.queue){if(s!=e[f])q(a.onAfterFirst);delete e[f]}});q(a.onAfter);function q(b){o.animate(e,j,a.easing,b&&function(){b.call(this,r,a)})};function u(b){var c='scroll'+b,g=k.ownerDocument;return p?Math.max(g.documentElement[c],g.body[c]):k[c]}}).end()};function n(b){return typeof b=='object'?b:{top:b,left:b}}})(jQuery);

// Wait
(function($){
	jQuery.fn.wait = function(time){
		var obj = $(this);
		obj.queue(function(){
			setTimeout(function(){
				obj.dequeue();
			}, time);
		});
		return obj;
	};
})(jQuery);

function openPopup(url,name,height,width,opt_show_scrollbars)
{
	var scrollbar_param=opt_show_scrollbars?",scrollbars=1":"";
	var newwindow=window.open(url,name,'height='+height+',width='+width+scrollbar_param);
	if(newwindow&&!newwindow.opener){newwindow.opener=window;}
	if(window.focus){newwindow.focus()}
	return false;
}



// ShareThis JS
$(document).ready(function() {
	sidepanel.init();
});
