
var totalCharacters = 140;
var profile;
var bprofile;
var feedLoop = "myPosts";
var user_name = getCookie("Authorization").split(" ");
var anony = true;
var voteTally;

$(document).ready( function()
{
	getBreaking();
  $("#postForm").keyup(function(event){
      	   var inputText = event.target.value;
      	   $("#charRemaining").html(totalCharacters - inputText.length);
  	});

  loopDifferentiator();
});

$("#postForm").submit(function (event) { event.preventDefault(); $.post("/addComment",
	{
		comment: event.target.inputPost.value,
		loop: event.target.loopSelect.value,
		college: event.target.collegeSelect.value,
		token: getCookie("Authorization"),
		user_name: user_name[0],
    anon: anony,
	},  function (result) {
		$("#charRemaining").html(totalCharacters); event.target.reset();
	});
	getComments();
	});

$("#anon").click(function(){
        document.getElementById("anon").innerHTML = "Not Anon";
	      anony = !anony;
    });

function chooseMyLoop(fCall){
    feedLoop = fCall;
}

function loopDifferentiator()
{
  switch (feedLoop){
    case 'myPosts':
      getMyPosts();
      break;
    case 'Basketball':
      getLoopComments("Basketball");
      break;
    case 'Engineering':
      getLoopComments("Engineering");
      break;
    case 'Weather':
      getLoopComments("Weather");
      break;
  }
setTimeout(loopDifferentiator,1000);
}

function getComments(){
	$.get( "/getComments", function( data ) {
		var posts = "";
		var dNt, date, month, year, secs, mins, hour;
		for(var i=0; i<data.length; i++) {

			dNt = new Date(data[i].date_created);
			date = dNt.getDate();
			month = (dNt.getMonth()+1);
			year = dNt.getFullYear();
			secs = dNt.getSeconds();
			mins = dNt.getMinutes();
			hour = dNt.getHours();
      var button = (user_name[0] == data[i].user_name) ? "<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button>" : "";

      posts = "<div class='well'><div class='row col-xs-12'><div class='col-lg-10 col-xs-10'>"
      + escapeHTML(data[i].comment) + "</div>" + "<div class='col-lg-2 col-xs-12'>" 
      + button
      +"</div></div><div class='row'><div class='col-lg-1 col-xs-0'></div><div class='col-lg-11 col-xs-12'><i>" + data[i].user_name + " - " 
      +data[i].loop + " - " + data[i].college + " - " + hour + ":" + mins + ":" + secs + "    " + date + "-" + month + "-" + year +"</i></div></div></div>" + posts;
 		}
});

}

function getMyPosts(){
  $.get( "/getMyPosts", function( data ) {
	if(typeof data[0] == 'undefined')
	{
		var posts = "No Comments";
		$("#feedPosts").html( posts );
		$("#feedPosts").show();
		return;
	}
	if(typeof data[0].comment == 'undefined')
	{
                var posts = "No Comments";
                $("#feedPosts").html( posts );
                $("#feedPosts").show();
		return;
	}
    var posts = "";
    var dNt, date, month, year, secs, mins, hour;
    for(var i=0; i<data.length; i++) {

      dNt = new Date(data[i].date_created);
      date = dNt.getDate();
      month = (dNt.getMonth()+1);
      year = dNt.getFullYear();
      secs = dNt.getSeconds();
      mins = dNt.getMinutes();
      hour = dNt.getHours();
      var button = (user_name[0] == data[i].user_name) ? "<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button>" : "";
      var check = (data[i].user_name == "") ? "" : " - ";
      posts = "<div class='well'><div class='row col-xs-12'><div class='col-lg-9 col-xs-9 col-md-9 col-sm-10'>"
      + escapeHTML(data[i].comment) + "</div>" + "<div class='col-lg-3 col-xs-3 col-md-3 col-sm-3'>" 
      + button
      +"</div></div><div class='row'><div class='col-lg-1 col-xs-0'></div><div class='col-lg-11 col-xs-12'><i>" + data[i].user_name + check  
      +data[i].loop + " - " + data[i].college + " - " + hour + ":" + mins + ":" + secs + "    " + date + "-" + month + "-" + year +"</i></div></div></div>" + posts;
    }
    $("#feedPosts").html( posts );
    $("#count").html(data.length);
    $("#feedPosts").show();
});

}

function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function getLoopComments(loop){
	$.get( "/getComments/"+loop, function( data ) {
		var posts = "";
		var dNt, date, month, year, secs, mins, hour;
		for(var i=0; i<data.length; i++) {

			dNt = new Date(data[i].date_created);
			date = dNt.getDate();
			month = (dNt.getMonth()+1);
			year = dNt.getFullYear();
			secs = dNt.getSeconds();
			mins = dNt.getMinutes();
			hour = dNt.getHours();
            var button = (user_name[0] == data[i].user_name) ? "<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button>" : "";
            posts = "<div class='well'><div class='row col-xs-12'><div class='col-lg-10 col-xs-10'>"
                + escapeHTML(data[i].comment) + "</div>" + "<div class='col-lg-2 col-xs-12'>" + button + "</div></div><div class='row'><div class='col-lg-1 col-xs-0'></div><div class='col-lg-11 col-xs-12'><i>" + data[i].user_name +  " - " + data[i].loop + " - " + data[i].college + " - " + hour + ":" + mins + ":" + secs + "    " + date + "-" + month + "-" + year +"</i></div></div></div>" + posts;
        }
		$("#feedPosts").html( posts );
		$("#feedPosts").show();
});
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
            profile += " <br/> ";
            profile += "<{img}>";
			profile += res[0].img;  
		}
		else
		{
			profile = "Profile not Found";
		}
});
}

$("#search_user").submit(function (event) {
	event.preventDefault();
	var name = document.getElementById("user_name").value;
    getProfile(name);
    profile = profile.split("<{img}>");
    document.getElementById("searchPP").src =  profile[1];
	$("#out").html(profile[0]);
});


function getName()
{
   if(profile == undefined)
       {
          setTimeout(getName, 500);
       }
   else
    {
        profile = profile.split("<{img}>");
        document.getElementById("propic").src =  profile[1];
    	document.getElementById("pname").innerHTML =  profile[0];
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

$("#bioForm").submit(function (event) {
	event.preventDefault();
	$.put("/editUserBio", {
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

$("#profUp").click(function (event) {
	event.preventDefault();
	var imageNew = "";
	resizeBase64Img(document.getElementById("ppic").src, 150, 150).then(function(newImg){
	$.post("/addUserPic",
	{
		img: newImg[0].src
	},  function (result) {
		window.alert(result.status);
	});
	});
});

function resizeBase64Img(base64, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    var deferred = $.Deferred();
    $("<img/>").attr("src", base64).load(function() {
        context.scale(width/this.width,  height/this.height);
        context.drawImage(this, 0, 0); 
        deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
     });
     return deferred.promise();
}

function voteUp(id){
        $.put("/vote/"+id, {
        vote: 1 },  function (result) {console.log(result)} );

      }

function voteDown(id){
        $.put("/vote/"+id, {
        vote: -1 },  function (result) {console.log(result)} );

      }