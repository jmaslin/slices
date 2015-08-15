Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Meteor.subscribe("pizzas");
  Meteor.subscribe('allUsers');

  var MAP_ZOOM = 16;

  Session.set('showMap', false);

  Meteor.startup(function () {
    // $(".map-card").hide();
    // $(".my-pizzas").hide();
    $(".button-collapse").sideNav();

    GoogleMaps.load();
  });

  Template.home.helpers({
    showMap: function () {
      return Session.get('showMap') && Geolocation.latLng();
    },
    openPizzas: function () {
      return Pizzas.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.home.events({
    "submit .new-pizza": function (event) {
      event.preventDefault();

      var pizzaName = event.target.pizzaName.value;

      Meteor.call("addPizza", pizzaName);

      event.target.pizzaName.value = "";
    }
  });

  Template.navbar.events({
    "click .find-pizzas": function () {
      Session.set('showMap', ! Session.get('showMap'));
      console.log(Session.get('showMap'));
    }

  });

  Template.map.helpers({
    geolocationError: function () {
      var error = Geolocation.error();
      return error && error.message;
    },
    mapOptions: function () {
      var latLng = Geolocation.latLng();
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }

  });

  Template.map.onCreated(function() {  
  var self = this;

  GoogleMaps.ready('map', function(map) {
    var marker;

    // Create and move the marker when latLng changes.
    self.autorun(function() {
      var latLng = Geolocation.latLng();
      if (! latLng)
        return;

      // If the marker doesn't yet exist, create it.
      if (! marker) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance
        });
      }
      // The marker already exists, so we'll just change its position.
      else {
        marker.setPosition(latLng);
      }

      // Center and zoom the map view onto the current position.
      map.instance.setCenter(marker.getPosition());
      map.instance.setZoom(MAP_ZOOM);
    });
  });
});

  Template.pizza.events({
    "click .delete": function () {
      Meteor.call("deletePizza", this._id);
    },
    "click .join": function () {
      Meteor.call("joinPizza", this._id, Meteor.userId());
      Materialize.toast('You joined the pizza party: ' + this.name, 2000);
    },
    "click .leave": function () {
      Meteor.call("leavePizza", this._id, Meteor.userId());
      Materialize.toast('You left the pizza party: ' + this.name, 2000);
    }

  });

  Template.pizza.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    isOtherUser: function () {
      return this.owner !== Meteor.userId() && Meteor.user();
    },
    isPizzaMember: function () {
      if (this.members) {
        for (var x = 0; x < this.members.length; x++) {
          if (this.members[x]._id == Meteor.userId()) {
            console.log(this.members[x]._id + " " + Meteor.userId());
            return true;
          }
        }
      }
      return false;
    },
    pizzaMembers: function () {

      var ids = this.members.map(function (obj) {
        return obj._id;
      });

      var members = Meteor.users.find({ '_id' : { $in : ids }}).fetch();

      return members;
    }

  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

Meteor.methods({

  addPizza: function (pizzaName) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Pizzas.insert({
      name: pizzaName,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      members: [{ _id : Meteor.userId(), slices: 8 }]
    });

    console.log(Pizzas.find({"owner": Meteor.userId()}).fetch());
  },
  deletePizza: function (pizzaId) {
    Pizzas.remove(pizzaId);
  },
  joinPizza: function (pizzaId, userId) {
    Pizzas.update(
      { "_id": pizzaId },
      { "$push": { members: { _id: userId } } }
    );
  },
  leavePizza: function (pizzaId, userId) {
    Pizzas.update(
      { "_id": pizzaId },
      { "$pull": { members: { _id: userId } } }
    );    
  }

});

if (Meteor.isServer) {

  Meteor.publish("pizzas", function() {
    return Pizzas.find();
  });

  Meteor.publish("allUsers", function () {
  return Meteor.users.find({});
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
