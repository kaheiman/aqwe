
app.controller('mcController', ['$scope', '$location', '$rootScope', 'accountService', 'utilityService', function($scope, $location, $rootScope, accountService, utilityService){
      var vm = this;
      vm.warm_register = false;
      vm.success_register = false;
      vm.warm_msg = "";
      vm.user = utilityService.getAuth().user;
      //function 2-way bind
      vm.create = create;
      $scope.oneAtATime = true;      

      vm.retrieve = retrieve;
      vm.deletes = deletes;
      vm.launched = launched;
      vm.edit = edit;

      activate();

      function edit(index){
      	var data = vm.mymcs[index];
      	accountService.resave(data)
      		.success(function(msg){
      			console.log('finished hehe');
      		})
      		.error(function(err){

      		});
      }
      function retrieve(index){
      	console.log("index0 : ", index);
      	vm.mymcs[index].launched = false;
      	var data = vm.mymcs[index];
      	accountService.resave(vm.mymcs)
      		.success(function(msg){
      			console.log('updated');
      		})
      		.error(function(err){

      		});      	

      }
      function launched(index){
      	console.log("index1 : ", index);
      	vm.mymcs[index].launched = true;   
      	var data = vm.mymcs[index];      	   	
      	accountService.resave(data)
      		.success(function(msg){
      			console.log('updated');
      		})
      		.error(function(err){

      		});      	

      }
      function deletes(index){
      	console.log(index);
      	var data = vm.mymcs.splice(index, 1);
      	console.log(data);
      	var deleteData = {data: data, delete: true};
      	accountService.resave(deleteData)
      		.success(function(msg){
      			console.log('deleted success');
      		})
      		.error(function(err){

      		});      	

      }
      function activate(){
      	accountService.getMymc(vm.user._id)
      		.success(function(mcs){
      			console.log("$$$$$$$$$$$$$$$$$$$$$", mcs);
      			vm.mymcs = mcs;
      		})
      		.error(function(err){
      			console.log(err);
      		});
      }
      function create(){
		vm.warm_register = false;
		vm.success_register = false;
            vm.tag = vm.tag.split(" ");
		var data = {
			title: vm.title,
			tags: vm.tag,
			question: vm.question,
			choiceA: vm.choice1,
			choiceB: vm.choice2,
			choiceC: vm.choice3,
			choiceD: vm.choice4,
			description: vm.explain,
			ownername: vm.user.username,
			creator: vm.user._id
		};
		console.log("data: ", data);
		accountService.createMc(data)
			.success(function(msg){
				console.log("success: ", msg);
			      vm.success_register = true;
			      vm.warm_msg = "create success";	
                        $scope.showCreate = !$scope.showCreate;
                        vm.mymcs.push(data);		
                        vm.title = "";
                        vm.tag = "";
                        vm.question = "";
                        vm.choice1 = "";
                        vm.choice2 = "";
                        vm.choice3 = "";
                        vm.explain = "";
                        vm.choice4 = "";

			})
			.error(function(err){
				console.log("err: ", err);
			    vm.warm_register = true;
			    vm.warm_msg = err;				
			});
      }


      //function 1 way only

}]);