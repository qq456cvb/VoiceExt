// chrome.tabs.onCreated.addListener(function(tab) {
// 	// alert("fuck");
// 	chrome.tabs.update(tab.id, {url: "https://www.baidu.com"});
// });

var aid, cid;

chrome.runtime.onMessage.addListener(  
  function(request, sender, sendResponse) {  
    // alert(sender.tab.url);
    console.log(sender.tab.url);
    if (sender.tab.url.indexOf("static-s") == -1) {
      aid = request.aid;
      cid = request.cid;
      sendResponse({aid: aid});  
      chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.update(tab.id, {url: "https://static-s.bilibili.com/play.swf?cid=" + cid});
       });
    } else {
      // alert(request.playtime);
      // alert(request.timenow);
      // alert(request.message);
      postComment.onPost(request.playtime, request.timenow, request.message);
      sendResponse({message: "success"});
    }
    
  });
