Pizzas = new Mongo.Collection("pizzas");

if (Meteor.isClient) {

  Meteor.subscribe("pizzas");

  Meteor.subscribe('allUsers');

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
    pizzaMembers: function () {
      var pizza = Pizzas.find({ '_id' : this._id }).fetch();
      if (!pizza[0].members) { return; }

      memberArray = [];

      for (i=0; i < pizza[0].members.length; i++) {
        memberArray.push(pizza[0].members[i]._id);
      }

      var mems = Meteor.users.find({ '_id' : { $in : memberArray }}).fetch();

      console.log(mems);



      return mems;

    // console.log(memberArray);

    // var memberString = "";

    // for (i=0; i < memberArray.length; i++) {
    //   //if (i == memberString.length) {
    //   // memberString = memberString + memberArray[i];
    //   //}
    //   //else {
    //     memberString = memberString + memberArray[i] + ", ";
    //   //}
    // }

    // return memberString.substring(0, memberString.length - 2);

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
      members: [{ _id : Meteor.userId(), username: Meteor.user().username, slices: 8}]
    });

    console.log(Pizzas.find({"owner": Meteor.userId()}));
  },
  deletePizza: function (pizzaId) {
    Pizzas.remove(pizzaId);
  },
  joinPizza: function (pizzaId, userId) {
    Pizzas.update(
      { "_id": pizzaId },
      { "$push": { members: { _id: userId, username: Meteor.user().username } } }
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
