Router.configure({
	layoutTemplate: 'main'

});

Router.route('/', function () {
  this.render('Home', {});
});

Router.route('/add-pizza', function () {
	this.render('addPizza', {});
});

Router.route('/parties/:_id', function () {
	this.render('Party', {

	})
})