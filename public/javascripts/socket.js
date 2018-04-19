$(function(){
   	//make connection
	var socket = io.connect('https://danu7.it.nuigalway.ie:8652')

	//buttons and inputs
	var message = $("#message")
	var user_name = (getCookie("Authorization").split(" "))[0];
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
    
    socket.emit('change_username', {username : user_name})
    
	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'><b>" + data.username  + "</b>: " + data.message + "</p>");
		if(user_name != data.username)
		{
			onclick = notifyMe(data.username);
		}
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});

document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe(uName) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
      uName = uName + " is in the chat.";
    var notification = new Notification('Loop', {
      icon: "images/face.jpg",
      body: uName,
    });

    notification.onclick = function () {
      window.open("/play");
    };

  }

}

