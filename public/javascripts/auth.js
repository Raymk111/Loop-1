$(document).ready( function() {
/**
* Event handler for when the user attempts to register */
$("#reg-form").submit(function (event) { event.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/users/register', dataType: 'json',
		data: {
			'user_name': event.target.inputUsername.value,
			'password': event.target.inputPassword.value,
			'full_name': event.target.inputFullname.value },
		success: function(token){ $(location).attr('href', '/feed' );
	},
	error: function(errMsg) {
	swal( 'Oops...',
	errMsg.responseJSON.body,
	'error'
	) }
}); }); 

$("#log-form").submit(function (event) { event.preventDefault();
        $.ajax({
                type: 'POST',
                url: '/users/login',
		dataType: 'json',
                	data: {
                        	'user_name': event.target.inputUsername.value,
                        	'password': event.target.inputPassword.value },
                	success: function(token){ $(location).attr('href', '/feed' );
        	},
		error: function(errMsg) {
        		swal( 'Oops...',
        			errMsg.responseJSON.body,
        		'error'
			)
		}
}); });

});

function onSignIn(googleUser)
{
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  $.ajax({
                 type: 'POST',
                 url: '/users/login',
                 dataType: 'json',
                         data: {
                                 'user_name': profile.getEmail(),
                                 'password': profile.getId() },
                         success: function(token){ $(location).attr('href', '/feed' );
                 },
                 error: function(errMsg) {
                         swal( 'Oops...',
                                 errMsg.responseJSON.body,
                         'error'
                         )
                 }
 });
}

function onRegIn(googleUser)
{
   var profile = googleUser.getBasicProfile();
   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
   console.log('Name: ' + profile.getName());
   console.log('Image URL: ' + profile.getImageUrl());
   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
         $.ajax({
                 type: 'POST',
                 url: '/users/register', dataType: 'json',
                 data: {
                         'user_name': profile.getEmail(),
                         'password': profile.getId() },
                 success: function(token){ $(location).attr('href', '/feed' );
         },
         error: function(errMsg) {
         swal( 'Oops...',
         errMsg.responseJSON.body,
         'error'
         ) }
 });
 }
