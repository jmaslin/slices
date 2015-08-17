Router.configure({
	layoutTemplate: 'main'

});

Router.route('/', function () {
  this.render('Home', {});
});

Router.route('/add-pizza', function () {
	this.render('addPizza', {});
});

Router.route('/parties/:_id', {
	template: 'partyPage',
	data: function () {
		var partyId = this.params._id;
		return Parties.findOne({ _id: partyId });
	}
});

Router.route('/users/:username', {
	template: 'userPage',
	data: function () {
		var user = this.params.username;
		$('.tooltipped').tooltip("close");
		return Meteor.users.findOne({ 'username' : user });
	}
})