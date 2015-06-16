function FlyDanmu(msg, right, left, duration){
  var div = $("<div></div>");
  div.html(msg).appendTo($('body'));
  div.css("position","absolute");
  div.css("top","240px");
  div.css("left", right + "px");
  div.css("color","red");
  div.css("font-size", "24px");
  div.css("border","1px solid #33ffff");
  div.animate({left: left - 200 + "px"}, duration * 1000, "linear", function(){$(this).remove();});
  return 0;
}


var emoji_set = [
{keyword:["开心"],emoji:"ヾ(o◕∀◕)ﾉ "},
{keyword:["大笑","狂笑"],emoji:"o(*≧▽≦)ツ"},
{keyword:["卖萌"],emoji:" (=￣ω￣=)"},
{keyword:["大哭"],emoji:"〒▽〒"},
{keyword:["无奈"],emoji:"╮（￣﹏￣）╭"}
];
function Word2Emoji(str){
	var length = emoji_set.length;
	 for(var i=0;i<length;i++){
		 var item = emoji_set[i];
		 for(var j=0;j<item.keyword.length;j++){
			 var index = str.indexOf(item.keyword[j]);
			 if(index>=0){//found,replace it with corresponding emoji
				 var result = Word2Emoji(str.slice(0,index))+item.emoji+Word2Emoji(str.slice(index+item.keyword[j].length));
				 return result;
			 }
		 }
	 }
	return str;
}

var test_str = "卖萌可耻\
外面的世界很无奈\
汪汪大笑";
// console.log("Before："+test_str);
// console.log("After:"+Word2Emoji(test_str));