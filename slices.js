Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Meteor.subscribe("pizzas");

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
    }
  });

  Template.pizza.events({
    "click .delete": function () {
      Meteor.call("deletePizza", this._id);
    }

  });

  Template.pizza.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
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
      username: Meteor.user().username
    });
  },
  deletePizza: function (pizzaId) {
    Pizzas.remove(pizzaId);
  }

});

if (Meteor.isServer) {

  Meteor.publish("pizzas", function() {
    return Pizzas.find();
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
