
var PostComment = {
    xmlHttpRequest : "",
    createNew : function () {
        var post_comment = {};
        
        

        //XmlHttpRequest对象    
        post_comment.createXmlHttpRequest = function () {    
            //alert("yes!");
            if(window.ActiveXObject){ //如果是IE浏览器    
                return new ActiveXObject("Microsoft.XMLHTTP");    
            }else if(window.XMLHttpRequest){ //非IE浏览器    
                return new XMLHttpRequest();    
            }    
        }

        PostComment.xmlHttpRequest = post_comment.createXmlHttpRequest();

        post_comment.onPost =  function (playtime, timenow, message){    

            var url = "http://interface.bilibili.com/dmpost?cid=" + cid + "&aid=" + aid + "&pid=1";       
                    
            //1.创建XMLHttpRequest组建    
            // xmlHttpRequest = createXmlHttpRequest();    
                
            //2.设置回调函数    
            PostComment.xmlHttpRequest.onreadystatechange = yyFun;    
            //xmlHttpRequest.dataType = "JSONP";
            //3.初始化XMLHttpRequest组建    
            PostComment.xmlHttpRequest.open("POST",url,true);   

            //xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
            //请求头 
            //xmlHttpRequest.setRequestHeader("Accept", "application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, */*");
            //xmlHttpRequest.setRequestHeader("Referer", "http://static.hdslb.com/play.swf");
            PostComment.xmlHttpRequest.setRequestHeader("Pragma", "no-cache");
            PostComment.xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
            //4.发送请求    
            var data = "color=16777215&cid="+ cid + "&playTime=" + playtime + "&mode=1&date=" + timenow + "&message=" + message +"&pool=0&fontsize=25";
            PostComment.xmlHttpRequest.send(data);      
        }
        return post_comment;
    }
    

    
}

function yyFun() {
    if(PostComment.xmlHttpRequest.readyState == 4 && PostComment.xmlHttpRequest.status == 200){    
        var b = PostComment.xmlHttpRequest.responseText; 
        // alert(b);
    }
}

postComment = PostComment.createNew();