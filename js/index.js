var timer = null;
var clientId = 'c949c19103fe594d0013af94455a6052';
var url_str = 'https://api.soundcloud.com/tracks';
var list = $("#track-list")[0];

var nodeObject = {
  voice: MP3_URL,
  voiceDuration: 98,
  backgroundSound: null
};


$("#search-tracks").submit(function(event){
  event.preventDefault();
});

$("#search").keyup(function() {

  if(timer) clearTimeout(timer);
  timer = setTimeout(function() {
   var searchText = $("#search").val();
   if(searchText != ''){
     showLoader();
     $.ajax({
       type: "GET",
       url: url_str,
       data: {
        q: $("#search").val(),
        client_id: clientId
       },
       cache: true,
       success: function(htmlresp){
          hideLoader();
          console.log(htmlresp);
          insertElements(htmlresp);
       }
     });
   }else{
    $("#search").focus();
   }
  }, 500);

});



function insertElements(objectArray){
  list.innerHTML = '';
  var xhr = new XMLHttpRequest();
  var ul = document.createElement('ul');
  ul.id = 'ul-tracks';
  for(var x = 0, len = objectArray.length; x < len; x++){
    var track  = objectArray[x];
    var li     = document.createElement('li');
    var audio  = document.createElement('audio');
    var button = document.createElement('button');
    button.textContent = 'Trocar música';
    button.onclick = function(){
      $('#track-list')[0].style.opacity = .5;
      $('#blocker-inside').show();
      $('#in-loader').show();
      
      nodeObject.backgroundSound = this.previousSibling.src;
      nodeObject.backgroundDuration = Math.round(document.querySelector('[src=\"' + nodeObject.backgroundSound + '\"]').duration);
      nodeObject.requisitionId = nodeObject.backgroundSound.match(/\d+\d/g)[0];
      
      $.post("http://127.0.0.1:8080/teste",
        nodeObject,
        function(data, status){
          $('#user-audio').hide();
          $('#track-list')[0].style.opacity = 1;
          $('#blocker-inside').hide();
          $('#in-loader').hide();
          $('#blocker').hide();
          buildElement(data);
        }
      );
    };
    li.innerHTML = track.title;
    with(audio){
    	controls = true;
		autoplay = false;
		preload = 'metadata';
		src = track.stream_url + '?client_id=' + clientId;
    }
    li.appendChild(audio);
    li.appendChild(button);
    ul.appendChild(li);  
  }
  list.appendChild(ul);
}