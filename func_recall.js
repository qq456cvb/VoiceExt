var iat_res = document.createElement("div");
// var scontent = document.getElementsByClassName("scontent")[0];
iat_res.setAttribute("class", "voice");




function trim_time(time){
  var seconds = Math.round(time);
  var result = "";
  if (seconds/60<10) {
    result += "0";
  };
  result += Math.floor(seconds/60) + ":";
  if (seconds%60<10) {
    result += "0";
  };
  result += seconds%60;
  return result;
}



var dmlist = new DmList();
var postComment = PostComment.createNew();

dmlist.init();

function rowStyle(row, index) {
  var style = '';
  if (index == dmlist.selected_index) {
      style += 'selecting';
  };
  if (index > 0) {
    if (dmlist.attrib_array[dmlist.total_index-index+1].expired == true) {
      style += ' success';
    }
  };
  return { classes: style};
}

function initialTable() {
  $('#mytable').bootstrapTable('append', {});
  // recognition.start();
}

function Attrib(expired, start_time) {
  this.expired = expired;
  this.start_time = start_time;
  this.timer = {};
}

function post(index, time, word, sys_time) {
  dmlist.attrib_array[index].expired = true;
  var temp = $('#mytable').bootstrapTable('getData', false);
  $('#mytable').bootstrapTable('load', temp);
  // postComment.onPost(time, sys_time, word);
  chrome.runtime.sendMessage({playtime: time, timenow: sys_time, 
    message: word, page: "func_recall.js"}, function(response) {  
    console.log(response.message);
  });
}

function DmList () {
  this.total_index = 0;
  this.selected_index = 0;
  this.total_offset = 0;
  this.offset_array = new Array();
  this.attrib_array = new Array();
  this.offset_array[0] = 0;
  this.edit_text = $("<input></input>");
  this.init = function () {
    this.edit_text.html("hahahahhaha");
    this.edit_text.attr('id', 'edit_text');
    this.edit_text.css('height', '40px');
    this.edit_text.css('width', '140px');
    this.edit_text.css("z-index", 20);
    this.edit_text.css("position", "absolute");
    this.edit_text.css("right", "80px");
    // this.edit_text.css("top", "120px");
    var table = document.createElement("table");
    table.innerHTML = "<thead><tr><th data-field='time' data-width='70px' data-align='left'>时间</th><th data-field='comment' data-width='140px'>评论</th><th data-field='sendtime' data-width='80px'>发送时间</th></tr></thead>";
    table.setAttribute("id", "mytable");
    table.setAttribute("style", "word-break:break-all; word-wrap:break-all;");
    table.setAttribute("data-toggle", "table");
    table.setAttribute("data-classes", "table table-hover table-condensed");
    table.setAttribute("data-striped", "true");
    table.setAttribute("data-row-style","rowStyle");
    table.setAttribute("data-pagination", "true");
    table.setAttribute("data-height", "600");
    iat_res.appendChild(table);
    //var icon = document.createElement("img");
    //icon.setAttribute("src","https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/voice/imgs/start_btn_6d57b7ec.png");
    //icon.setAttribute("style","width:30px;height:30px;");
    //table.appendChild(icon);
    document.body.appendChild(iat_res);
    
    setTimeout(initialTable, 2000);
  };

  

  this.calc_offset = function(saidWord){
    var str = saidWord.replace(/[^\x00-\xff]/g, 'xx');
    
    // if (this.total_index%10 == 0) {
    //   this.total_offset = 0;
    // };
    // console.dir(this);
    this.offset_array[this.total_index] = 0;
    // console.log(this.total_index / 10 * 10 + 1);
    for (var i = Math.floor(this.total_index / 10) * 10 + 1; i < this.total_index; i++) {
      // console.log(i);
      console.log(Math.ceil(str.length/26));
      this.offset_array[i] += (str.length == 0 ? 1 : Math.ceil(str.length/16))*21+20;
    };
    // this.offset_array[this.total_index] = this.total_offset;
    // this.total_offset += Math.ceil(str.length/26)*17+22;
    return saidWord;
  }

  function Data () {
    this.time = "";
    this.comment = "";
    this.sendtime = "";
    return this;
  }

  function Data (time, word, sys_time) {
    this.time = trim_time(time);
    this.comment = word;
    this.sendtime = controller.curr_time();
  }

  this.add = function (time, word, sys_time) {
    var data = new Data(time, word, sys_time);
    var attrib = new Attrib(false, new Date());
    var timenow = CurrentTime();      
    this.total_index++;
    this.calc_offset(word);
    attrib.timer = setTimeout("post('"+this.total_index+"','"+time+"','"+word+"','"+timenow+"')", 5000);  
    this.attrib_array[this.total_index] = attrib;   
    $('#mytable').bootstrapTable('insertRow', {index: 1, row: data});
    return true;
  }

  this.update = function (index, time, word, sys_time) {
    if (!this.attrib_array[this.total_index-index+1].expired) {
      
      var timenow = CurrentTime();  
      var trim_index = this.total_index-index+1;
      this.attrib_array[trim_index].timer = setTimeout("post('"+trim_index+"','"+time+"','"+word+"','"+timenow+"')", 5000);  
      var data = new Data(time, word, sys_time);
      $('#mytable').bootstrapTable('updateRow', {index: index, row: data});
      return true;
    };
    return false;
  }

  this.update = function (index, word) {
    if (!this.attrib_array[this.total_index-index+1].expired) {
      var timenow = CurrentTime();  
      var trim_index = this.total_index-index+1;
      var curr_page = $('#mytable').bootstrapTable('getData', true);
      console.log(curr_page);
      var time = curr_page[index % 10][time];
      this.attrib_array[trim_index].timer = setTimeout("post('"+trim_index+"','"+time+"','"+word+"','"+timenow+"')", 5000);  
      $('#mytable').bootstrapTable('updateCell', {rowIndex: index, fieldName: 'comment', fieldValue: word});
      return true;
    }
    return false;
  }
}




var z = document.getElementsByClassName("z")[0];
var player = document.getElementsByClassName("player-wrapper")[0];

var controller = {
  bind_key : 83,
  input_mode : false,
  started : false,
  paused : true,
  total_time : 0,
  send_time : 0,
  
  // scontent : document.getElementsByClassName("scontent")[0],
  curr_time : function (){
    var now = new Date();  
         
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var clock = "";
         
    if(hh < 10) clock += "0";  
    clock += hh + ":";  

    if (mm < 10) clock += '0';   
    clock += mm;

    return clock;
  },
  // width_min : z.offsetLeft,
  // width_max : z.offsetLeft + player.clientWidth,
  // height_min : z.offsetTop + player.offsetTop - document.body.scrollTop,
  // height_max : z.offsetTop + player.offsetTop + player.clientHeight - document.body.scrollTop
  width_min: 0,
  width_max: document.body.clientWidth-290,
  height_min: 50,
  height_max: document.body.clientHeight-50
}


function calTime() {
    controller.total_time += 0.1;
    controller.gone_time += 0.1;
    if (!controller.paused) {
        setTimeout(calTime, 100);
    };
    
}

function CurrentTime()  
{   
    var now = new Date();  
         
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
         
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss=now.getSeconds();            //秒  
         
    var clock = year + "-";  
         
    if(month < 10) clock += "0";         
    clock += month + "-";  
         
    if(day < 10) clock += "0";   
    clock += day + " ";  
         
    if(hh < 10) clock += "0";  
    clock += hh + ":";  
  
    if (mm < 10) clock += '0';   
    clock += mm+ ":";  
          
    if (ss < 10) clock += '0';   
    clock += ss;  
  
    return(clock);   
}  

function keyDown(e) {  
    
    var keycode = e.which;  
    var realkey = String.fromCharCode(e.which); 
    var temp = $('#mytable').bootstrapTable('getData', false);

    // alert("按键码:"  + keycode + "字符:" + realkey); 
    chrome.runtime.sendMessage({intent: "read_binding_key", page: "func_recall.js"}, function(response) {  
      controller.bind_key = response.bind_key;
      if (keycode == 37) { //<-
        e.preventDefault();
        dmlist.selected_index-=10;
        if (dmlist.selected_index<0) {
            dmlist.selected_index = 0;
        };
        $('#mytable').bootstrapTable('prevPage');      
      };
      if (keycode == 38) { //^
          e.preventDefault();
          dmlist.selected_index--;
          if (dmlist.selected_index < 0) {
              dmlist.selected_index = 0;
          };
          if (dmlist.selected_index % 10 == 9) {
              $('#mytable').bootstrapTable('prevPage');
          };
      };
      if (keycode == 39) { //->
          e.preventDefault();
          dmlist.selected_index+=10;
          if (dmlist.selected_index > dmlist.total_index) {
              dmlist.selected_index = dmlist.total_index;
          };
          $('#mytable').bootstrapTable('nextPage');    
      };
      if (keycode == 40) { //v
          e.preventDefault();
          dmlist.selected_index++;
          if (dmlist.selected_index > dmlist.total_index) {
              dmlist.selected_index = dmlist.total_index;
          };

          if (dmlist.selected_index % 10 == 0) {
              $('#mytable').bootstrapTable('nextPage');
          };
          // $('#mytable').bootstrapTable('hideRow', {index: selected_index, isIdField: false});  
      };
      if (keycode == 32) {
        if (controller.paused == true) {
              setTimeout(calTime, 100);
              //alert("start");
          };
          if (controller.paused == false) {
              //alert("stop");
              //alert(total_time);
          };
          controller.paused = !controller.paused;
      };
      if (keycode == controller.bind_key && !controller.started && !controller.input_mode) {
          e.preventDefault();
          if (dmlist.selected_index != 0 && !dmlist.attrib_array[dmlist.total_index-dmlist.selected_index+1].expired) {
            clearTimeout(dmlist.attrib_array[dmlist.total_index-dmlist.selected_index+1].timer);
          };
          controller.send_time = controller.total_time;
          controller.started = true;
          recognition.start();
          console.log("S key is down");
          document.getElementById("microphone").style.display = "block";

      };

      if (keycode == 13) { //回车
        if (dmlist.selected_index != 0 && !dmlist.attrib_array[dmlist.total_index-dmlist.selected_index+1].expired) {
          controller.input_mode = !controller.input_mode;
          if (controller.input_mode) {
            // console.log(dmlist.selected_index);
            console.log(dmlist.offset_array);
            dmlist.edit_text.css('top', (159 + dmlist.offset_array[dmlist.total_index-dmlist.selected_index+1]) + "px");
            dmlist.edit_text.appendTo($("body"));
            dmlist.edit_text.focus();
            clearTimeout(dmlist.attrib_array[dmlist.total_index-dmlist.selected_index+1].timer);
          } else {
            // alert($('#edit_text').val());
            dmlist.update(dmlist.selected_index, $('#edit_text').val());
            dmlist.edit_text.remove();
          };
        }
        // dmlist.edit_text.appendTo($("body"));
        
      };
      $('#mytable').bootstrapTable('load', temp);
      $('#mytable').bootstrapTable('scrollTo', dmlist.offset_array[dmlist.selected_index]); // 4:85, 3:68
    });
    
  }  

function keyUp(e) {
    
    var keycode = e.which;  
    var realkey = String.fromCharCode(e.which); 
    // alert(controller.bind_key);
    if (keycode == controller.bind_key && controller.started) {   
        e.preventDefault();     
        recognition.stop();
        // console.log("Final:" + saidWord + " S key is up!\n");
        controller.started = false;
        document.getElementById("microphone").style.display = "none";
        console.log("S key is up");
        // FlyDanmu("测试一下", 1000, 0, 10);
    };
    // if (realkey == 'T'){
    //   FlyDanmu("测试一下", 1300, 0, 10);
    // }
}

document.onkeyup = keyUp;
document.onkeydown = keyDown;



document.onmousedown = function(event) {
    


    
    if (event.clientX > controller.width_min && event.clientX < controller.width_max 
     && event.clientY > controller.height_min && event.clientY < controller.height_max) {
      // alert("clicked at (" + event.clientX + "," + event.clientY + ")");
        if (controller.paused == true) {
            setTimeout(calTime, 100);
            //alert("start");
        };
        if (controller.paused == false) {
            //alert("stop");
            //alert(total_time);
        };
        controller.paused = !controller.paused;
    };
};

var microphone_str = '<div id="microphone"><img src="https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/voice/imgs/start_btn_6d57b7ec.png"/><div class="round"></div><div id="round" class="round"></div><div id="round2" class="round"></div></div>';
$(microphone_str).appendTo($("body"));
setInterval(function(){
    $("#round").animate({width:150,height:150,top:-35,left:-35,opacity:0.2},2000,function(){
      $("#round").css("width","84px").css("height","84px").css("top","-2px").css("left","-2px").css("opacity","1");
    });
    setTimeout(function(){
      $("#round2").animate({width:150,height:150,top:-35,left:-35,opacity:0.2},2000,function(){
        $("#round2").css("width","84px").css("height","84px").css("top","-2px").css("left","-2px").css("opacity","1");
      });},1000);
  },100);