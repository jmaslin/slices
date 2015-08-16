Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Meteor.subscribe("pizzas");
  Meteor.subscribe('allUsers');

  var MAP_ZOOM = 16;

  Session.set('showMap', false);
  Session.set('showForm', false);

  Meteor.startup(function () {
    // $(".map-card").hide();
    // $(".my-pizzas").hide();
    $(".button-collapse").sideNav();

    sAlert.config({
          effect: 'bouncyflip',
          position: 'top-right',
          timeout: 4000,
          html: false,
          onRouteClose: true,
          stack: true,
          offset: 0
      });    

    GoogleMaps.load();
  });

  Template.home.helpers({
    showMap: function () {
      return Session.get('showMap') && Geolocation.latLng();
    },
    openPizzas: function () {
      return Pizzas.find({ owner: { $not: Meteor.userId() } }, {sort: {createdAt: -1}});
    },
    userPizzas: function () {
      return Pizzas.find({ owner: Meteor.userId() }, {sort: {createdAt: -1}});
    },
    showForm: function() {
      return Session.get('showForm') && Meteor.user();
    }
  });

  Template.home.events({
    "submit .new-pizza": function (event) {
      event.preventDefault();

      Router.go('/add-pizza');

      Session.set('pizzaName', event.target.pizzaName.value);

      //event.target.pizzaName.value = "";
    }
  });

  Template.navbar.events({
    "click .find-pizzas": function () {
      Session.set('showMap', ! Session.get('showMap'));
    },
    "click .new-party": function () {
      Session.set('showForm', ! Session.get('showForm'));
    }

  });

  Template.addPizza.events({
    "click .map-confirm": function () {
      console.log(Geolocation.latLng());

      if (Session.get('pizzaName')) {

        var pizza = Session.get('pizzaName');
        Meteor.call("addPizza", pizza, Geolocation.latLng().lat, Geolocation.latLng().lng);
        delete Session.keys['pizzaName'];

      }

      Router.go('/');
    },
    "click .map-cancel": function () {
      Router.go('/');
    }
  })

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
          zoom: MAP_ZOOM,
          streetViewControl: false,
          zoomControl: false,
          mapTypeControl: false,
          maxZoom: 18
        };
      }
    }

  });

  Template.map.onCreated(function() {  
  var self = this;

  if (Session.get('pizzaName')) {
    GoogleMaps.ready('map', function(map) {
    var latLng = Geolocation.latLng();

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latLng.lat, latLng.lng),
      map: map.instance
    });
  });
  }
  else {
    GoogleMaps.ready('map', function(map) {
      var mapPizzas = Pizzas.find().fetch();

      for (i = 0; i < mapPizzas.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(mapPizzas[i].location.latitude, mapPizzas[i].location.longitude),
          map: map.instance
        });

        console.log(mapPizzas[i].location);
      }

    });
  }
});

  Template.pizza.events({
    "click .delete": function () {
      Meteor.call("deletePizza", this._id);
    },
    "click .join": function () {
      Meteor.call("joinPizza", this._id, Meteor.userId());
      sAlert.success('You joined the pizza party: ' + this.name);
    },
    "click .leave": function () {
      Meteor.call("leavePizza", this._id, Meteor.userId());
      sAlert.warning('You left the pizza party: ' + this.name);
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

  addPizza: function (pizzaName, lat, lng) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Pizzas.insert({
      name: pizzaName,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      location: { latitude: lat, longitude: lng},
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
