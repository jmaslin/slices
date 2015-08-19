angular.module('slices').controller('PartiesListCtrl', function ($scope, $meteor, $rootScope) {
		
	$scope.parties = $meteor.collection(Parties).subscribe('parties');

	$scope.page = 1;
	$scope.perPage = 3;
	$scope.sort = { name: 1 };

	$scope.getUserById = function (userId) {
		return Meteor.users.findOne(userId);
	};

	$scope.creator = function (party) {
		if (!party)
			return;
		var owner = $scope.getUserById(party.owner);
		if (!owner)
			return 'Nobody';

	  if ($rootScope.currentUser)
	    if ($rootScope.currentUser._id)
	      if (owner._id === $rootScope.currentUser._id)
	        return 'Me';
	}

	$scope.addParty = function (party) {

		if (!$rootScope.currentUser || !party) {
			return;
		}
		party.owner = $rootScope.currentUser._id;
		$scope.parties.push(party);
		$scope.newParty = '';
	};

	$scope.removeParty = function (party) {
	  $scope.parties.remove(party);
	};

})