Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Template.body.helpers({
    pizzas: function () {
      return Pizzas.find({});
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
