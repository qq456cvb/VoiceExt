(function($){
  var defaults = {
    data: [],
    path: 'emoji/',
    category: ['EmojiCategory-Shock','EmojiCategory-Happy','EmojiCategory-Indifferent','EmojiCategory-Cry','EmojiCategory-Cute','EmojiCategory-Angry','EmojiCategory-Lifttable'],
    showbar: true,
    trigger: 'click',
    insertAfter: function(){}
  };

  var render_nav = function(obj,options){
    console.log(options)
    $(obj).append('<div class="emoji-inner"><ul class="emoji-nav"></ul><div class="emoji-content"></div></div>')
    if (!options.showbar) {
      $(obj).addClass('no-bar')
      return
    }
    var navs = _.reduce(options.category,function(items,item){
      var citem = _.find(options.data,function(da){return da.typ == item})
      return items + '<li data-name="'+item+'">'+citem.nm+'</li>'
    },'')
    $(obj).find('.emoji-nav').empty().append(navs)
  }

  var render_emoji = function(obj,options,typ){
    var list = _.find(options.data,function(item){return item.typ == typ})
    if(!list){
      list = options.data[0]
    }	
    var imgs = _.reduce(list.items,function(items,item){
      if(item){
				var emoji_set = [0,0,0,0,0,0,0];//emoji_set.length === Default.data.length
				if(!(localStorage["emoji_set"]===undefined)){
					emoji_set = JSON.parse(localStorage["emoji_set"]);
				}
				if(emoji_set[item.category]==item.index)
					return items + '<div class="item_selected" text="'+item.src+'" title="'+item.title+'">'+item.src+'</div>';
				return items + '<div text="'+item.src+'" title="'+item.title+'" category='+item.category+' index='+item.index+'>'+item.src+'</div>';
        //return items + '<img title="'+item.name+'" src="' + options.path + item.src+'" data-name="'+item.name+'" data-src="' + options.path + item.src+'">';
      }else{
        return items
      }
    },'')
    $(obj).find('.emoji-content').empty().append(imgs)
    $(obj).find('.emoji-nav li[data-name='+list.typ+']').addClass('on').siblings().removeClass("on")
  }

  var switchitem = function(obj,options){
    $(obj).on(options.trigger,'.emoji-nav > li',function(){
      render_emoji(obj,options,$(this).attr('data-name'))
      return false; 
    })
    $(obj).on('click','.emoji-content > div',function(){
			$(".item_selected").removeClass("item_selected");
			$(this).addClass("item_selected");
      options.insertAfter({name: $(this).attr('data-name'),src: $(this).attr('text'),category:$(this).attr('category'),index:$(this).attr('index')})
    })
  }

  var togglew = function(obj,option){
    $(obj).on('click','.emoji-tbtn',function(){
      $(obj).find('.emoji-inner').toggle()
      return false;    
    })
    $(document).click(function(){
      $(obj).find('.emoji-inner').hide()
    })
  }

  $.fn.emoji = function(opt){
    var options = $.extend({}, defaults, opt || {});
    //var options = $.extend(defaults,opt);
    
    this.hide = function(){
      $(this).find('.emoji-inner').hide()
    }

    this.show = function(){
      $(this).find('.emoji-inner').show() 
    }

    return this.each(function(){
      render_nav(this,options)
      render_emoji(this,options)
      switchitem(this,options)
      togglew(this,options)
    })
    
  }
})(jQuery)

var data = [
	{"typ":"EmojiCategory-Shock","nm":"惊呆了","items":[
		{"title":"hurt","src":"（⊙ˍ⊙）",category:0,index:0},
		{"title":"shocked","src":"Σ（ ° △ °|||）︴",category:0,index:1},
		{"title":"","src":"（。_。）",category:0,index:2},
		{"title":"","src":"ㄟ（≧◇≦）ㄏ",category:0,index:3}
	]},
	{"typ":"EmojiCategory-Happy","nm":"开心","items":[
		{"title":"satisfied","src":"（=￣ω￣=）",category:1,index:0},
		{"title":"cheers","src":"[]~（￣▽￣）~*",category:1,index:1},
		{"title":"handsup","src":"≧▽≦y",category:1,index:2},
		{"title":"happy","src":"o（≧o≦）o",category:1,index:3},
		{"title":"content","src":"╮（‵▽′）╭",category:1,index:4},
		{"title":"shy","src":"（＠￣︶￣＠）",category:1,index:5}]},
	{"typ":"EmojiCategory-Indifferent","nm":"无奈","items":[
		{"title":"speechless","src":"╮（╯＿╰）╭",category:2,index:0},
		{"title":"speechless2","src":"╮（﹀＿﹀）╭",category:2,index:1},
		{"title":"speechless3","src":"┐（─__─）┌ ",category:2,index:2},
		{"title":"speechless4","src":"（＃－.－）",category:2,index:3}]},
	{"typ":"EmojiCategory-Cry","nm":"大哭","items":[
		{"title":"cryout","src":"〒▽〒",category:3,index:0},
		{"title":"cryout2","src":"╥﹏╥ ",category:3,index:1},
		{"title":"cryout3","src":"（ToT）/~~~ ",category:3,index:2},
		{"title":"cryout4","src":"╥﹏╥ ",category:3,index:3}
	]},
	{"typ":"EmojiCategory-Cute","nm":"卖萌","items":[
		{"title":"miaowu","src":"（＾ｕ＾）",category:4,index:0},
		{"title":"smoke","src":"<（￣ c￣）y▂ξ",category:4,index:1},
		{"title":"whatsup","src":" ˋ（ ° ▽、° ） ",category:4,index:2},
		{"title":"daretosee","src":"（*/ω＼*）",category:4,index:3},
		{"title":"miaowu","src":"~o（ =∩ω∩= ）m",category:4,index:4}
	]},
	{"typ":"EmojiCategory-Angry","nm":"打人","items":[
		{"title":"hitinface","src":"（￣ε（#￣）☆╰╮（￣▽￣///）",category:5,index:0},
		{"title":"drag_ear","src":"＜（‵□′）＞───Ｃε（┬＿┬）３ ",category:5,index:1},
		{"title":"getaway","src":"o（#￣▽￣）==O））￣▽￣'）o",category:5,index:2},
		{"title":"beat","src":"（ ￣ ▽￣）o╭╯☆#╰ _─﹏─）╯",category:5,index:3}
	]},
	{"typ":"EmojiCategory-Lifttable","nm":"掀桌","items":[
		{"title":"lifttable","src":"（≧▽≦）/~┴┴ ",category:6,index:0},
		{"title":"lifttable","src":"（╯－＿－）╯╧╧ ",category:6,index:1},
		{"title":"lifttable","src":"（╯‵□′）╯︵┴─┴",category:6,index:2},
		{"title":"departhouse","src":"┴┴︵╰（‵□′）╯︵┴┴ ",category:6,index:3},
		{"title":"lifttable","src":"（/≡ _ ≡）/~┴┴ ",category:6,index:4}
	]}
];

var recording = false;

function generate_emoji_set() {
	var emoji_set = [0,0,0,0,0,0,0];//emoji_set.length === Default.data.length
	if(!(localStorage["emoji_set"]===undefined)){
		emoji_set = JSON.parse(localStorage["emoji_set"]);
	}
	var result = [];
	for(var i=0;i<emoji_set.length;i++){
		var item = {};
		item.keyword = [data[i].nm];
		item.emoji = data[i].items[emoji_set[i]].src;
		result.push(item);
	}
	return result;
}

function init(){
		
	var em1 = $('#emoji1').emoji({
		data:data,
  		insertAfter: function(item){
			var emoji_set = [0,0,0,0,0,0,0];//emoji_set.length === Default.data.length
			if(!(localStorage["emoji_set"]===undefined)){
				emoji_set = JSON.parse(localStorage["emoji_set"]);
			}
			emoji_set[item.category] = Number.parseInt(item.index);
			localStorage["emoji_set"] = JSON.stringify(emoji_set);
      }
    });
	em1.hide();
	em1.isshow = false;
	document.getElementById('key_now').innerHTML = "&nbsp;&nbsp;当前键位:" + String.fromCharCode(localStorage["bind_key"]);
    $('#emoji_set_btn').click(function() {
      if(em1.isshow)
				em1.hide();
			else
				em1.show();
      return false;
    })
    $('#record_set_btn').click(function() {
    	if (!recording) {
    		document.getElementById('key_now').style.display = "none";
			  // var div = $("#config");
	  		$('#config').html("&nbsp;&nbsp;请按任意键");
        recording = !recording;
    	} 
      
    })

}

//key_binding
function keyDown(e) {  
    
    var keycode = e.which;  
    var realkey = String.fromCharCode(e.which); 
    if (recording) {
    	
    	localStorage["bind_key"] = keycode;
    	document.getElementById('key_now').innerHTML = "&nbsp;&nbsp;当前键位:" + String.fromCharCode(localStorage["bind_key"]);
    	document.getElementById('key_now').style.display = "";
    	$('#config').html("");
    	console.log(keycode);
    	recording = !recording;
    };
}

document.onkeydown = keyDown;

$(function(){
	init();
});
