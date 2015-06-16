var player = document.getElementById("bofqi");
var player_html = player.innerHTML;
var pos1 = player_html.indexOf("cid=");
var pos2 = player_html.indexOf("aid=");
var pos3 = player_html.indexOf("</object>");

var cid = player_html.substring(pos1+4, pos2-5);
var aid = player_html.substring(pos2+4, pos3-2);

chrome.runtime.sendMessage({aid: aid, cid: cid}, function(response) {  
	// alert(cid);
  // console.log(response.aid);  
});