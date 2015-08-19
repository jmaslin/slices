angular.module('slices').controller('PartiesListCtrl', function ($scope, $meteor, $rootScope) {
		
	$scope.parties = $meteor.collection(Parties).subscribe('parties');

	$scope.page = 1;
	$scope.perPage = 3;
	$scope.sort = { name: 1 };

	$scope.addParty = function (party) {

		if (!$rootScope.currentUser || !party) {
			return;
		}
		party.owner = $rootScope.currentUser._id;
		$scope.parties.push(party);
		$scope.newParty = '';
	}

	$scope.removeParty = function (party) {
	  $scope.parties.remove(party);
	};

})