var app = angular.module('slices', [
	'angular-meteor',
	'ui.router',
	'ngMaterial'
]);

function onReady() {
  angular.bootstrap(document, ['slices']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);
