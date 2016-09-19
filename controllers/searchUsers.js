var models = require('../models');
$('#search').on('click', function() {
	console.log('hello');
	var query = $('#searchQuery').val();

	models.Users.findAll({ where: {UserName: query}}).then(function(results) {

		for (var i = 0; i < results.length; i++) {
			var userDiv = $('<div>', {
				id: results[i].id,
				class: 'col-md-12'
			});
			var friendBtn = $('<button>', {
				text: 'Add Friend',
				id: results[i].id,
				class: 'btn btn-primary addFriend'
			});
			userDiv.html(results[i].UserName);

			models.Friends.findAll({ where: {User1: '1'}})

			userDiv.append(friendBtn);
			$('#searchResults').append(userDiv);
		};

	}).catch(function(err){
		if(err){
			throw err;
		}
	})
});

$('.addFriend').on('click', function() {
	models.Friends.create({
		User1: this.id,
		User2: '1' //placeholder for now, need to get logged in user's id
	})
});

