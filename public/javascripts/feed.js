var showPosts = false;
var totalCharacters = 140;
var profile;
var bprofile;
var loop;
var user_name = getCookie("Authorization").split(" ");


$(document).ready( function()
{
	getBreaking();
  $("#postForm").keyup(function (event)
	{
      	   var inputText = event.target.value;
      	   $("#charRemaining").html(totalCharacters - inputText.length);
  	});
  getComments();
});

$("#postForm").submit(function (event) { event.preventDefault(); $.post("/addComment", 
	{
		comment: event.target.inputPost.value,
		loop: event.target.loopSelect.value,
		college: event.target.collegeSelect.value,
		token: getCookie("Authorization"),
		user_name: user_name[0],
	},  function (result) {
		$("#charRemaining").html(totalCharacters); event.target.reset();
	});
	getComments();
	});

function getComments(){
	$.get( "/getComments", function( data ) {
		var posts = "";
		for(var i=0; i<data.length; i++) {
			var dNt = new Date(data[i].date_created);
			date = data[i].date_created.split("T");
			time = date[1].split(".");
			posts = "<div class='well'><div class='row col-xs-12'><div class='col-lg-10 col-xs-10'>"
			+ data[i].comment + "</div>" + "<div class='col-lg-2 col-xs-12'>" +"<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button></div>"
			+"</div><div class='row'><div class='col-lg-1 col-xs-0'></div><div class='col-lg-11 col-xs-12'><i>" + data[i].user_name + " - " 
			+data[i].loop + " - " + data[i].college + " - " + dNt + "</i></div></div></div>" + posts;
 		}
		$("#feedPosts").html( posts );
		$("#count").html(data.length);
		$("#feedPosts").show();
});
setTimeout(getComments,1000);
}

function getLoopComments(loop){
	$.get( "/getComments/"+loop, function( feed1 ) {
		var feed1 = "";
		for(var i=0; i<data.length; i++) {
			var dNt = new Date(feed1[i].date_created);
			date = feed1[i].date_created.split("T");
			time = date[1].split(".");
			posts = "<div class='well'><div class='row col-xs-12'><div class='col-lg-12 col-xs-12'>"
			+ feed1[i].comment + "</div>" + 
			+"</div><div class='row'><div class='col-lg-1 col-xs-0'></div><div class='col-lg-11 col-xs-12'><i>" + data[i].user_name + " - " 
			+feed1[i].loop + " - " + feed1[i].college + " - " + dNt + "</i></div></div></div>" + posts;
 		}
		$("#menu1").html( posts );
		$("#menu1").show();
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
    if(name == "")
        {
            var myName = getCookie("Authorization");
            myName = myName.split(" ");
            myName[0];
            getProfile(myName[0]);
            profile;
        }
	$.get( "/getUser/"+name, function(res) {

		if(res[0] != null)
		{
			profile = " <br/> ";
            profile += "Name: " + res[0].full_name;
            profile += " <br/> ";
			profile += "Username: " +res[0].user_name;
            profile += " <br/> ";
			profile += "Biography: " +res[0].bio;
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
   if(profile == undefined)
       {
          setTimeout(getName, 500);
       }
   else
    {
    	document.getElementById("pname").innerHTML =  profile;
    }
}

function getBreaking(){
	$.get( "/getComments", function( data ) {
		var main = "<div class='ticker-wrap'><div class='ticker'>";
		if(data.length >=10)
		{
			for(var i=0; i<10; i++){
				main += "<div class='ticker__item'>" + data[i].comment + "</div>";
			}
			main = main + "</div></div>";
			$("#breakingNews").html(main);
		}
	});
}

$("#bioForm").submit(function (event) { event.preventDefault(); $.put("/editUserBio", {
   bio: event.target.inputBio.value },  function (result) {} );
	$("#outb").html(bprofile);
});

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});
