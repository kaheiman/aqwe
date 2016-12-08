
app.controller('mcController', ['$scope', '$location', '$rootScope', 'accountService', 'utilityService', function($scope, $location, $rootScope, accountService, utilityService){
      var vm = this;
      vm.warm_register = false;
      vm.success_register = false;
      vm.warm_msg = "";

      //function 2-way bind
      vm.create = create;

      function create(){
		vm.warm_register = false;
		vm.success_register = false;
		var data = {
			title: vm.title,
			tags: vm.tag,
			question: vm.question,
			choiceA: vm.choice1,
			choiceB: vm.choice2,
			choiceC: vm.choice3,
			choiceD: vm.choice4,
			explain: vm.explain
		};
		console.log("data: ", data);
		accountService.createMc(data)
			.success(function(msg){
				console.log("success: ", msg);
			      vm.success_register = true;
			      vm.warm_msg = "create success";				
			})
			.error(function(err){
				console.log("err: ", err);
			    vm.warm_register = true;
			    vm.warm_msg = err;				
			});
      }


      //function 1 way only

}]);