if (Meteor.isClient) {

	Template.picForm.events({
		'click .grav-confirm': function () {
		var image = Gravatar.imageUrl(Meteor.user().emails[0].address, {
			size: 400,
			default: 'mm'
		});

		Meteor.users.update({ _id : Meteor.userId()}, { $set : { 'profile.imageUrl': image, 'profile.imagePrompt': false }});

		},
		'click .grav-deny': function () {
			Meteor.users.update({ _id : Meteor.userId()}, { $set : { 'profile.imagePrompt': false }});
		}
	});

	Template.userPage.events({
		'click .add-friend': function () {
			var profileId = Router.current().data()._id;
			Meteor.users.update({ _id: Meteor.userId()}, { $push : { 'profile.friends' : { '_id': profileId }}});


		}
	})


}