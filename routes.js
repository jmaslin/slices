Router.route('/', function () {
  this.render('Home', {});
});

Router.route('/add-pizza', function () {
	this.render('addPizza', {});
});
