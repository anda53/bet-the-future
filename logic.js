var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var sequelize = require('sequelize');
var routes = require('./controllers/bet_controllers.js');

var app = express();


var defImg = "https://placeholdit.imgix.net/~text?txtsize=19&txt=200%C3%97200&w=200&h=200";
function makeUserPics(){
		var DImages = []
		for (var i = 0; i < 10; i++) {

			var newPic ={
				ImageLink: defImg
			}
			DImages.push(newPic);
	}
	return DImages;
}




//Check new user info
module.exports = {
	//We should be able to use the sequelize-isunique-validator npm package instead of this method; keeping this method for now, JIC
	userCheck: function(newName, newEmail, table){
		//Select all current users from DB
		table.findAll().then(function(data){
			//Loop through the resulting array of users
			var email = true;
			var name = true;
			data.forEach(function(userObj){
				//If the new user's User Name or Email matches that of a currrent user, return false
				if (userObj.userName === newName){
					name = false;
				};
				if (userObj.email === newEmail){
					email = false
				}
			})
			var output = {
				email: email, 
				name: name};
			return output;
		})
	},



}

