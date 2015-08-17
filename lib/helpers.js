if (Meteor.isClient) {

	Template.registerHelper('pizzaMembersTop', function () {

		if (!this.members) {
			return;
		}
		
		var ids = this.members.map(function (obj) {
		  return obj._id;
		});

		var members = Meteor.users.find({ '_id' : { $in : ids }}).fetch();

		$('.tooltipped').tooltip({delay: 25});

		var firstRow = members.slice(0, 4);

		return firstRow;

	});

	Template.registerHelper('pizzaMembersBottom', function () {

		if (!this.members) {
			return;
		}
		
		var ids = this.members.map(function (obj) {
		  return obj._id;
		});

		var members = Meteor.users.find({ '_id' : { $in : ids }}).fetch();

		$('.tooltipped').tooltip({delay: 25});

		var secondRow = members.slice(4, members.length);

		return secondRow;

	});

	Template.registerHelper('gravUrl', function () {
		var image = Gravatar.imageUrl(Meteor.user().emails[0].address, {
			size: 400,
			default: 'mm'
		});

		return image;
	});

	Template.registerHelper('getUserOwnedPizzas', function (id) {
		var pizzas = Parties.find({ 'owner' : id }).fetch();

		console.log(id);

		return pizzas;

	});

	Template.registerHelper('getUserMemberPizzas', function (id) {
		var pizzas = Parties.find({ members: { $elemMatch: { _id: id }}}).fetch();

		console.log(pizzas);

		return pizzas;
	})

}