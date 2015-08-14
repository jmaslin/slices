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
            return true;
          }
        }
      }
      return false;
    },
    // getMembers: function () {
    //   Meteor.call("getUsers", this.members, function(err, data) {
    //     console.log(data);
    //     return data;
    //   });
    // }

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
  },
  getUsers: function (members) {
    if (!members) { return; }
    console.log(members, Meteor.users.find({}));
    Meteor.users.find(
      { '_id': { $in : members } },
      function (err, docs) {
        console.log(docs);
      }
    );
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
