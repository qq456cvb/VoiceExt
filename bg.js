// chrome.tabs.onCreated.addListener(function(tab) {
// 	// alert("fuck");
// 	chrome.tabs.update(tab.id, {url: "https://www.baidu.com"});
// });

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

var aid, cid;
if (localStorage["bind_key"] === undefined)
  localStorage['bind_key'] = 83;


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
    } else if (request.intent == "read_binding_key") {
      sendResponse({bind_key: localStorage["bind_key"]});
    } else {
      if (request.page == "recognition.js") {
        var gen_emoji_set = generate_emoji_set();
        sendResponse({emoji_set: gen_emoji_set});
      } else {
          postComment.onPost(request.playtime, request.timenow, request.message);
          sendResponse({message: "success"});   
      }
    }
    
  });

// function bg_generate_emoji_set() {
//   popup = chrome.extension.getViews()[0];
//   alert(popup);
//   return popup.generate_emoji_set();
// }

