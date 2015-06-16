// new instance of speech recognition



var recognition = new webkitSpeechRecognition();
// set params
recognition.continuous = true;
recognition.interimResults = true;




recognition.onresult = function(event){
  
  // delve into words detected results & get the latest
  // total results detected
  var resultsLength = event.results.length -1 ;
  // get length of latest results
  var ArrayLength = event.results[resultsLength].length -1;
  // get last word detected
  var saidWord = event.results[resultsLength][ArrayLength].transcript;

  
  console.log(saidWord);
  // append the last word to the bottom sentence
  if(event.results[resultsLength].isFinal)
  {

    
  	saidWord = Word2Emoji(saidWord);
    if (dmlist.selected_index != 0) {
      // console.log(dmlist.selected_index);
      dmlist.update(dmlist.selected_index, controller.send_time, saidWord, controller.curr_time);
    } else {
      // console.log(dmlist.selected_index);
      dmlist.add(controller.send_time, saidWord, controller.curr_time);
    }
    FlyDanmu(saidWord, 1300, 0, 10);
  };
}

//alert(CurrentTime());
// speech error handling
recognition.onerror = function(event){
  console.log('error?');
  console.log(event);
}

recognition.onend = function(event) {
  // recognition.start();
  // console.log("end!");
  // console.log(saidWord);
}





