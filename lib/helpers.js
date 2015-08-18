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

		var firstRow = members.slice(0, 4);

		return members;

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

		return pizzas;

	});

	Template.registerHelper('getUserMemberPizzas', function (id) {
		var pizzas = Parties.find({ members: { $elemMatch: { _id: id }}}).fetch();

		return pizzas;
	});

	Template.registerHelper('isOwnProfile', function (id) {
		return Meteor.userId() == id;
	});

	Template.registerHelper('isFriend', function (id) {
		if (Meteor.user()) {
			for (i=0; i < Meteor.user().profile.friends.length; i++) {
				if (Meteor.user().profile.friends[i]._id == id) {
					return true;
				}
			}
			return false;
		}

		
	});

	Template.registerHelper('getProfileFriends', function (id) {
		if (Meteor.user()) {
			var user = Meteor.users.findOne({ _id : id});
			var friends = user.profile.friends;
			var friendArray = [];

			for (i=0; i < friends.length; i++) {
				friendArray.push(friends[i]._id);
			}

			var results = Meteor.users.find({ _id : {$in : friendArray}});

			return results;
		}

	});

	Template.registerHelper('pizzaMapOptions', function() {
		if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(0, 0),
          zoom: 16,
          streetViewControl: false,
          zoomControl: false,
          mapTypeControl: false,
          maxZoom: 18
        };
      }
	})

}