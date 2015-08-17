if (Meteor.isClient) {

	Template.picForm.events({
		'click .grav-confirm': function () {
		var image = Gravatar.imageUrl(Meteor.user().emails[0].address, {
			size: 100,
			default: 'mm'
		});

		Meteor.users.update({ _id : Meteor.userId()}, { $set : { 'profile.imageUrl': image, 'profile.imagePrompt': false }});

		},
		'click .grav-deny': function () {
			Meteor.users.update({ _id : Meteor.userId()}, { $set : { 'profile.imagePrompt': false }});
		}
	})


}