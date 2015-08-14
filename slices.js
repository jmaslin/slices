Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Template.body.helpers({
    pizzas: function () {
      return Pizzas.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-pizza": function (event) {
      event.preventDefault();

      var pizzaName = event.target.name.value;

      Pizzas.insert({
        name: pizzaName,
        createdAt: new Date()
      });

      event.target.name.value = "";
    }
  });

  Template.pizza.events({
    "click .delete": function () {
      Pizzas.remove(this._id);
    }

  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
