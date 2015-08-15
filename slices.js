Router.route('/', function () {
  this.render('Home', {});
});

Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Meteor.subscribe("pizzas");
  Meteor.subscribe('allUsers');

  Session.set('showMap', false);

  Meteor.startup(function () {
    // $(".map-card").hide();
    $(".my-pizzas").hide();
    $(".button-collapse").sideNav();

    GoogleMaps.load();
  });

  Template.home.helpers({
    showMap: function () {
      return Session.get('showMap');
    }
  });

  Template.body.helpers({
    pizzas: function () {
      return Pizzas.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-pizza": function (event) {
      event.preventDefault();

      var pizzaName = event.target.name.value;

      Meteor.call("addPizza", pizzaName);

      event.target.name.value = "";
    },
    "click .find": function () {
      if ($('.map-card').css('display') == 'none') {
        $(".map-card").show();
        $(".my-pizzas").show();
      }

      else if ($('.map-card').css('display') != 'none') {
        $(".map-card").hide();
        $(".my-pizzas").hide();
      }
    }
  });

  Template.navbar.events({
    "click .find-pizzas": function () {
      Session.set('showMap', ! Session.get('showMap'));
      console.log(Session.get('showMap'));
    }

  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(-37.8136, 144.9631),
          zoom: 8
        };
      }
    }

  })

  Template.pizza.events({
    "click .delete": function () {
      Meteor.call("deletePizza", this._id);
    },
    "click .join": function() {
      Meteor.call("joinPizza", this._id, Meteor.userId());
      Materialize.toast('You joined the pizza party: ' + this.name, 2000);
    },
    "click .leave": function() {
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
