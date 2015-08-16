if (Meteor.isClient) {

	Template.registerHelper('pizzaMembers', function () {

		if (!this.members) {
			return;
		}
		
		var ids = this.members.map(function (obj) {
		  return obj._id;
		});

		var members = Meteor.users.find({ '_id' : { $in : ids }}).fetch();

		$('.tooltipped').tooltip({delay: 50});

		return members;

	})

}