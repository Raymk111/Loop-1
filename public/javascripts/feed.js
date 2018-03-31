var showPosts = false;
var totalCharacters = 140;
var profile;

$(document).ready( function()
{
  $("#postForm").keyup(function (event)
	{
      	   var inputText = event.target.value;
      	   $("#charRemaining").html(totalCharacters - inputText.length);
  	});
  getComments();
  getName();
  getBreaking();
});

$("#postForm").submit(function (event) { event.preventDefault(); $.post("/addComment", 
	{
		comment: event.target.inputPost.value,
		loop: event.target.loopSelect.value,
		college: event.target.collegeSelect.value,
		token: getCookie("Authorization")
	},  function (result) {
		$("#charRemaining").html(totalCharacters); event.target.reset();
	});
	getComments();
	});

function getComments(){
	$.get( "/getComments", function( data ) {
		var posts = "";
		for(var i=0; i<data.length; i++) {
			posts = "<div class='well'><div class='row'><div class='col-xs-9'>"
			+ data[i].comment + "</div><div class='col-xs-3'>" +
			"<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button></div></div></div></div>" + posts;
 		}
		$("#feedPosts").html( posts );
		$("#count").html(data.length);
		$("#feedPosts").show();
});
setTimeout(getComments,1000);
}

$("#feedPosts").click(function (event) {
    console.log(event.target.name); if(event.target.name)
    {
        $.ajax(
            {
            url: '/removeComment/' + event.target.name, type: 'DELETE',
                success: function(result) {
                 }
            });
    }
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getProfile(name)
{
	$.get( "/getUser/"+name, function(res) {
		if(res[0] != null)
		{
			profile = "";
            profile += "Name: " + res[0].full_name;
            profile += " <br/> ";
			profile += "Username: " +res[0].user_name;

		}
		else
		{
			profile = "Profile not Found";
		}
});
}

$("#search_user").click(function (event) {
	event.preventDefault();
	var name = document.getElementById("user_name").value;
	getProfile(name);
 		
	$("#out").html(profile);
});

function getName()
{
    var myName = getCookie("Authorization");
    myName = myName.split(" ");
   
   document.getElementById("pname").innerHTML = myName[0];
}

function getBreaking(){
	$.get( "/getComments", function( data ) {
		var main = "";
		for(var i=2; i<data.length; i++){
			main = "<div class='col-xs-9'>"
				+ data[i].comment + "</div>"
		}
		$("#breakingNews").html(main);
	});
}