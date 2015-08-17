if (Meteor.isClient) {

	Template.registerHelper('pizzaMembers', function () {

		if (!this.members) {
			return;
		}
		
		var ids = this.members.map(function (obj) {
		  return obj._id;
		});

		var members = Meteor.users.find({ '_id' : { $in : ids }}).fetch();

		$('.tooltipped').tooltip({delay: 25});

		return members;

	});

	Template.registerHelper('gravUrl', function () {
		var image = Gravatar.imageUrl(Meteor.user().emails[0].address, {
			size: 100,
			default: 'mm'
		});

		return image;
	});

}