//Dependencies
var express = require('express');
var methodO = require('method-override');
var bodyParse = require('body-parser');
var router = express.Router();
var sequelize = require ('sequelize');
var app = express();
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var server = require("../server.js");
var models = require('../models');

// Used in both profile and home page
function getAllUserTables(req, res, handlebarsRoute) {
		models.User.findOne({ where: {id: req.user.id} }).then(function(user) {
		user.getFriends().then(function(allFriends) {
			user.getBets().then(function(userBets) {
				var betReferee = [];
				var refPending = [];
				var joinedBet = [];
				var joinPending = [];
				var userOwnsBets = [];
				var ownerPending = [];
				var betsWon = [];
				var betsLost = [];
				//all bets user has some association with
				for (var i = 0; i < userBets.length; i++) {
					// if user created bet and a winner has not been decided
					if (userBets[i].adminPlayer === req.user.UserName && !userBets[i].winner) {
						userOwnsBets.push(userBets[i]);

					// user was invited to bet and a winner has not been decided
					} else if (userBets[i].secondPlayer === req.user.UserName && !userBets[i].winner) {
						joinedBet.push(userBets[i]); 
					};

					//if user is ref and a winner has not been decided
					if (userBets[i].referee === req.user.UserName && !userBets[i].winner) {
						betReferee.push(userBets[i]);
					};
					//user won bet
					if (userBets[i].winner === req.user.UserName) {
						betsWon.push(userBets[i]);

					// user lost bet
					} else if (userBets[i].winner) {
						betsLost.push(userBets[i]);
					}

				};

				//user is ref and bet is pending
				for (var i = 0; i < betReferee.length; i++) {
					if(betReferee[i].pending === true) {
						var singleBet = betReferee.splice(i, 1);
						refPending.push(singleBet[0]);
						i--;
					};
				};
				//user owns bet and it is pending
				for (var i = 0; i < userOwnsBets.length; i++) {
					if (userOwnsBets[i].pending === true) {
						var singleBet = userOwnsBets.splice(i, 1);
						ownerPending.push(singleBet[0]);
						i--;
					};
				};
				//user was invited to bet and it is pending
				for (var i = 0; i < joinedBet.length; i++) {
					if (joinedBet[i].pending === true) {
						var singleBet = joinedBet.splice(i, 1);
						joinPending.push(singleBet[0]);
						i--;
					};
				};

				res.render(handlebarsRoute, {
					betReferee: betReferee,
					refPending: refPending,
					joinedBet: joinedBet, //bets that user is betting in
					joinPending: joinPending, //bets that are pending for the user
					userOwnsBets: userOwnsBets, //bets that user has created
					ownerPending: ownerPending,
					friends: allFriends,
					betsWon: betsWon,
					betsLost: betsLost,
					user:user
				})
			})	
		}) 
		}).catch(function(err){
			if(err){
				throw err;
			}
	})
};
//==================LOGIN GET============================
router.get('/', function (req, res) {
	if (req.isAuthenticated()) {
		req.session.error = 'Please sign in!';
		res.redirect('/home');
		return false;
	};

	res.render('login');
});

//==================LOGIN POST============================
router.post('/login',
	passport.authenticate('loginStrategy',{ 
		successRedirect: '/home',
		failureRedirect: '/' 
	})
);

//==================LOGOUT============================
router.get('/logout', function(req, res){
	console.log("logged out!");
	req.logout();
	res.redirect('/');
});

//==================SIGNUP GET=============================
router.get('/signup', function(req, res) {

	res.render('signup'); // uses signup.handlebars
});

//=====================SIGNUP POST=========================
router.post('/signUp', function(req, res) {
	var newName = req.body.userName;
	var newEmail = req.body.email;
	var dataName;
	var dataEmail;
	models.User.findAll({ 
		// Check for email and username in the DB
		where: sequelize.or(
			{UserName: newName},
			{Email: newEmail}
		)
	}).then(function(data){
		if(data.length){
			//Grab incoming matched username and email, if any
			dataName = data[0].dataValues.UserName;
			dataEmail = data[0].dataValues.Email;
			//redirect to signup if email or username matches
			if (dataName === newName){
				console.log("That Username is already in use");
				res.redirect("/signUp");
			}else{
				console.log("That email is already in use");
				res.redirect("/signUp");
			}
		}else{
		//Otherwise, continue adding the user
			models.User.create({
				FirstName: req.body.firstName,
				LastName: req.body.lastName,
				Email: newEmail,
				UserName: newName,
				Password: req.body.password,
				ImageLink: req.body.image
			}).then(function() {
				res.redirect('/');
			}).catch(function(err){
				throw err;
			});
		}
	})	
})

//====================HOME GET=============================
router.get('/home', function(req, res) {
	if (!req.isAuthenticated()) {
		req.session.error = 'Please sign in!';
		res.redirect('/');
		return false;
	};
	getAllUserTables(req, res, 'home');	
});

//=====================HOME/CREATE BET POST========================
router.post('/create-bet', function(req, res){
	var participantId = parseInt(req.body.participant);
	var refereeName = req.body.referee;
	//getting the id of the referee, and the username of the second player
	models.User.findAll({ where: {$or:[{id: participantId}, {UserName: refereeName}]} }).then(function(playerRef) {
		var secondPlayer;
		var referee;
		for (var i = 0; i < playerRef.length; i++) {
			if (playerRef[i].id === participantId) {
				secondPlayer = playerRef[i];
			} else if (playerRef[i].UserName === refereeName) {
				referee = playerRef[i];
			};
		}
		models.Bet.create({
			adminPlayer:req.user.UserName,
			adminImageLink: req.user.ImageLink,
			prediction: req.body.prediction,
			challenge: req.body.challenge,
			secondPlayer: secondPlayer.UserName,
			referee: req.body.referee,
			pending: true,
			price:req.body.wager,
			judgmentDay: req.body.judgementDay

		}).then(function(group) {
			var allParticipants = [];
			allParticipants.push(req.user.id); //adds owner to array in order to add to associaion
			allParticipants.push(secondPlayer.id);
			allParticipants.push(referee.id);
			return group.addUsers(allParticipants);
		}).then(function() {
			res.redirect('/home');
		}).catch(function(err) {
			throw err;
		})
	})
});	

//====================SEARCH USERS POST===========================
router.post('/search-users', function (req, res) {
	res.redirect('/search-users/' + req.body.userName)
});

//===================SEARCH USERS TO GET SOME FRIENDS====================
router.get('/search-users/:userName', function (req, res) {
	if (!req.isAuthenticated()) {
		req.session.error = 'Please sign in!';
		res.redirect('/');
		return false;
	};
	models.User.findAll({ where: {UserName: req.params.userName}}).then(function(results) {
		var searchResult = {
			UserName: []
		};
		for (var i = 0; i < results.length; i++) {
			var users = {
				FirstName: results[i].FirstName,
				LastName: results[i].LastName,
				UserName: results[i].UserName,
				ImageLink: results[i].ImageLink,
				id: results[i].id
			};
			searchResult.UserName.push(users)
		};
		res.render('search_users', searchResult)

	}).catch(function(err){

		if(err){
			throw err;
		}
	})
});

//=====================ADD FRIENDS POST==========================
router.post('/add-friend/:id', function(req,res) {

	models.User.findOne({where: {id: req.user.id} }).then(function(user) {
		
		models.User.findOne({where: {id: req.params.id} }).then(function(friend) {
			return user.addFriend(friend);
		})
	}).then(function() {
		res.redirect('/home');
	}).catch(function(err) {
		throw err;
	})

});

//=====================PROFILE GET==========================
router.get('/profile', function(req, res) {
    if (!req.isAuthenticated()) {
        req.session.error = 'Please sign in!';
        res.redirect('/');
        return false;
    };
	getAllUserTables(req, res, 'profile');
});

//=====================ACCEPT OR DECLINE BET POST==========================
router.post('/bet-response/:id', function(req, res) {
	if (req.body.betResponse === 'decline') {
		models.Bet.destroy(
			{where: {id: req.params.id}}
		).then(function() {
			res.redirect('/')
		})
	} else {
		models.Bet.update( 
			{pending: false}, 
			{where: {id: req.params.id}}
		).then(function() {
			res.redirect('/')
		})
	};
	res.redirect('/home');
})

//=====================OWNER DELETE POST==========================
router.post('/bet-delete/:id', function(req, res) {
	models.Bet.destroy(
		{where: {id: req.params.id}}
	).then(function() {
		res.redirect('/')
	})
})

//=====================REFEREE SELECTS WINNER POST==========================

router.post('/bet-winner/:id', function(req, res) {
	models.Bet.update( 
		{winner: req.body.betWinner}, 
		{where: {id: req.params.id}}
	).then(function() {
		res.redirect('/')
	})
})

module.exports = router;