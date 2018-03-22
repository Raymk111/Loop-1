var showPosts = false;

$(document).ready( function()
                  {
  var totalCharacters = 140;
  $("#postForm").keyup(function (event)
	{
      	   var inputText = event.target.value;
      	   $("#charRemaining").html(totalCharacters - inputText.length);
  	});
});

$("#postForm").submit(function (event) { event.preventDefault(); $.post("/addComment", 
	{
		comment: event.target.inputPost.value }, function (result) {
		$("#charRemaining").html(totalCharacters); event.target.reset();
	});
	getComments();
	});

function getComments(){
	$.get( "/getComments", function( data ) {
		var posts = "";
		for(var i=0; i<data.length; i++) {
			posts += "<div class='well'><div class='row'><div class='col-xs-9'>"
			+ data[i].comment + "</div><div class='col-xs-3'>" +
			"<button type='button' name='"+data[i]._id+"' class='btn btn-danger'>" +"Delete</button></div></div></div></div>";
 		}
		$( "#feedPosts" ).html( posts );
		$("#count").html(data.length);
		if(!showPosts)
		{
		$("#feedPosts").show();
		}
		else
		{
		$("#feedPosts").show();
		}
		// Recursively call getComments every 4 seconds
		});
		setTimeout(getComments,4000);
}

$("#btn-count").click(function (event) { var options = {};
if(!showPosts)
{
$("#feedPosts").show( "blind", options, 1000);
showPosts = true; }
else
{
$("#feedPosts").hide( "blind", options, 1000); showPosts = false;
} });

$("#feedPosts").click(function (event) {
    console.log(event.target.name); if(event.target.name)
    {
        $.ajax(
            {
            url: '/deleteComment/' + event.target.name, type: 'DELETE',
                success: function(result) {
                    getComments(); }
            });
    }
});

