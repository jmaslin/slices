angular.module('slices').controller('PartyDetailsCtrl', function ($scope, $meteor, $stateParams) {
	
	$scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

	var autoSave = true;

	$scope.party = $meteor.object(Parties, $stateParams.partyId).subscribe('parties');

})