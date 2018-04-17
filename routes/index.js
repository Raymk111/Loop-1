var express = require('express');
var router = express.Router();
var Comment = require('../models/comments');
var jwt = require('jsonwebtoken');
var User = require('../models/users');
var moment = require('moment-timezone');
var xssEscape = require('xss-escape');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('aboutus', { title: 'Loop' });
});

router.get('/feed', function(req, res, next) {
        try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
                        res.render('feed', {title : 'Loop'});
                }
		else{
			res.render('error', {message : "Oops. something went wrong with your authentication"});
		}
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/play', function(req, res, next) {
	try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
                        res.render('play', {});
                }
                else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/aboutus', function(req, res, next) {
        res.render('aboutus');
});

router.get('/local', function(req, res, next) {
        res.render('local');
});

router.get('/loops', function(req, res, next) {
        res.render('loops');
});

router.get('/profile', function(req, res, next) {
	try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
                        res.render('profile', {});
                }
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/loops/sports', function(req, res, next) {
  res.render('sports', {});
});

router.get('/loops/college', function(req, res, next) {
  res.render('college', {});
});

router.get('/loops/tv', function(req, res, next) {
  res.render('tv', {});
});

/**
 * Adds comments to our database
 */
router.post('/addComment', function(req, res, next) {
    // Extract the request body which contains the comments
    try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
			comment = new Comment(req.body);
			comment.date_created = moment().tz("Europe/Dublin").format();
			comment.save(function (err, savedComment) {
        		if (err)
            			throw err;

		        res.json({
        		    "id": savedComment._id
        			});
    			});
                }
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

/**
 * Returns all comments from our database
 */

router.get('/getComments', function(req, res, next) {
    try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
				var mysort = {date_created : 1};
				Comment.find({}, function (err, comments) {
        	if (err)
            		res.send(err);
        	comments.sort(mysort);
		var i = 0;
		while(i<comments.length)
		{
			comments[i].token = null;
			if(comments[i].anon)
			{
				comments[i].user_name = "";
			}
			i++;
		}
        	res.json(comments);
    		});
            }
	    else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/getMyPosts', function(req, res, next) {
        try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                var username = jwtString[0];
		var mysort = {date_created : 1};
		if(profile){
			Comment.find({user_name:username}, function (err, comments) {
			    if (err)
				res.send(err);
        		comments.sort(mysort);
			var i = 0;
                	while(i<comments.length)
                	{
                	        comments[i].token = null;
                        	if(comments[i].anon)
                        	{
                        	        comments[i].user_name = "";
                        	}
                	        i++;
                	}
			res.json(comments);
			});
            	}
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/getComments/:loop', function(req, res, next) {
        try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
			var loop = req.params.loop;
    			var mysort = {date_created : 1};
    			Comment.find({loop:loop}, function (err, comments) {
        			if (err)
        			    res.send(err);
		        	comments.sort(mysort);
		        	var i = 0;
                		while(i<comments.length)
                		{
                        		comments[i].token = "";
                       	                if(comments[i].anon)
                        		{
                                		comments[i].user_name = "";
                        		}
					i++;
                		}
				res.json(comments);
				});
            }
	    else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.get('/chooseLoop/:loop', function(req, res, next) {

    var loop = req.params.loop;
    var posts = "";
    var mysort = {date_created : 1};
	try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
                jwtString = jwtString.split(" ");
                if(profile){
                        Comment.find({loop:loop}, function (err, comments) {
        		if (err)
        		{
        		   res.send(err);
        		}
        		comments.sort(mysort);
			while(i<comments.length)
                        {
                                comments[i].token = null;
                                if(comments[i].anon)
                                {
                                        comments[i].user_name = "";
                                }
                                i++;
                        }
        		res.render('generic',{"comment" : comments});
        		});
                }
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "Access Denied. You are not logged in."});
        }
});

router.get('/chooseCollege/:college', function(req, res, next) {

    var college = req.params.college;
    var posts = "";
    var mysort = {date_created : 1};
        try{
                var jwtString = req.cookies.Authorization;
                var profile = verifyJwt(jwtString);
		jwtString = jwtString.split(" ");
                if(profile){
                        Comment.find({college:college}, function (err, comments) {
                        if (err)
                        {
                           res.send(err);
                        }
		        comments.sort(mysort);
                        while(i<comments.length)
                        {
                                comments[i].token = null;
                                if(comments[i].anon)
                                {
                                        comments[i].user_name = "";
                                }
                                i++;
                        }
			res.render('generic',{"comment" : comments});
                        });
                }
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "Access Denied. You are not logged in."});
        }
});

router.get('/getUser/:user_name', function(req, res, next) {
            try{
                    var jwtString = req.cookies.Authorization;
    var profile = verifyJwt(jwtString);
    jwtString = jwtString.split(" ");
    var username = jwtString[0];
    var name = req.params.user_name;
    if(profile)
    {
	User.find({user_name:name}, function (err, users) {
        if (err)
            res.send(err);
	users[0].access_token = null;
        res.json(users);
    });
    }
	    else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

router.put('/editUserBio', function(req, res, next){
    var jwtString = req.cookies.Authorization;
    var profile = verifyJwt(jwtString);
    jwtString = jwtString.split(" ");
    var username = jwtString[0];
    var bioFor = xssEscape(req.body.bio);
    console.log(bioFor);
    if(profile)
    {
         User.update({user_name:username}, {bio: bioFor}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully updated Bio"});
    });
    }
    else{
                        res.json({status : "Oops. something went wrong with your authentication"});
                }
});

router.post('/addUserPic', function(req, res, next){
    try{
        var jwtString = req.cookies.Authorization;
        var profile = verifyJwt(jwtString);
	jwtString = jwtString.split(" ");
        var username = jwtString[0];
        if(profile)
        {
            User.update({user_name:username}, req.body, function (err){
                if (err)
                    res.send(err);
                res.json({status : "Successfully added pic"});
            });
        }
        else{
            res.json({status : "Oops. something went wrong with your authentication"});
        }
    }
    catch(err){
	console.log(err);
        res.json({status : err});
    }
});


/**
 * Deletes a comment from the database
 */
router.delete('/removeComment/:id', function(req, res, next){

    var id = req.params.id;
    var jwtString = req.cookies.Authorization;
    var profile = verifyJwt(jwtString);
    jwtString = jwtString.split(" ");
    var username = jwtString[0];
    if(profile)
    {
	Comment.remove({_id:id, user_name:username}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully removed the document"});
    });
    }
    else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
});
module.exports = router;

router.put('/vote/:id', function(req, res, next){
	var id = req.params.id;
	var jwtString = req.cookies.Authorization.split(" ");
	try{
                var profile = verifyJwt(jwtString);
		jwtString = jwtString.split(" ");
                if(profile){
                                var user_name = jwtString[0];
        			Comment.find({_id:id}, function(err, comment){
                	if(err)
                	{
                        	res.send(err);
                	}
               			 if(comment[0].voted.indexOf(user_name) >= 0)
               			 {
                		        res.send({status : "already voted"});
                		 }
               			 else
               			 {
                			        comment[0].up_votes = comment[0].up_votes + req.body.vote;
                			        comment[0].voted += " " + user_name;
                			        Comment.update({_id:id}, {voted : comment[0].voted, up_votes : comment[0].up_votes}, function(err){if(err){res.send(err)}})
                			        res.send({status:"Up - Voted"});
                			}
			})
                }
		else{
                        res.render('error', {message : "Oops. something went wrong with your authentication"});
                }
        }
        catch(err){
                res.render('error', {message : "You are not logged in."});
        }
});

function verifyJwt(jwtString)
{
	var tokenTest = jwtString.split(" ");
        value = jwt.verify(tokenTest[1], "CSIsTheWorst");
	if(value.user_name == tokenTest[0])
	{
        	return value;
	}
        return false;
}
