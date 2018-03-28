var showPosts = false;
var totalCharacters = 140;

$(document).ready( function()
{
  $("#postForm").keyup(function (event)
	{
      	   var inputText = event.target.value;
      	   $("#charRemaining").html(totalCharacters - inputText.length);
  	});
});

$("#postForm").submit(function (event) { event.preventDefault(); $.post("/addComment", 
	{
		comment: event.target.inputPost.value,
		loop: event.target.loopSelect.value,
		college: event.target.collegeSelect.value
	},  function (result) {
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
		$("#feedPosts").show();
});
setTimeout(getComments,100);
}

$("#feedPosts").click(function (event) {
    console.log(event.target.name); if(event.target.name)
    {
        $.ajax(
            {
            url: '/removeComment/' + event.target.name, type: 'DELETE',
                success: function(result) {
                    getComments(); }
            });
    }
});
