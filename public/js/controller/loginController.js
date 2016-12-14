
app.controller('loginController', ['$scope', '$location', '$rootScope', 'accountService', 'utilityService', function($scope, $location, $rootScope, accountService, utilityService){
      var vm = this;
      vm.list = ["hello", "world", "hahaha", "bob"];
      vm.warm_register = false;
      vm.success_register = false;
      vm.warm_msg = "";

      //function 2-way bind
      vm.register = register;
      vm.login = login;

      function register(){
		vm.warm_register = false;
		vm.success_register = false;
		var letterNumber = /^[0-9a-zA-Z]+$/;
		console.log(vm.email);
		console.log(vm.password);
		console.log(vm.password2);
		console.log(vm.username);
		if(!vm.password || !vm.password2 || !vm.username || !vm.email ){
			vm.warm_msg = "Please fill in all the boxes!";
			vm.warm_register = true;			
		}
		else if(vm.username.length > 12 || !vm.username.match(letterNumber)){ 
			vm.warm_msg = "Username should contain at most 12 alphanumeric characters!";
			vm.warm_register = true;
		}
		//check password
		else if(vm.password !== vm.password2){
			vm.warm_msg = "Please check your password!";
			vm.warm_register = true;
		} else {
			//check email validate
			if(!emailValidate(vm.email)){
				vm.warm_msg = "The email is incorrect!";
				vm.warm_register = true;      			
			}
			else{
				//pass to database to check exist user/email
				var data = {email: vm.email, password: vm.password, username: vm.username};
				accountService.register(data)
					.success(function(msg){
						if(msg.error){
							vm.warm_msg = msg.error;
							vm.warm_register = true;
						} else{
							vm.warm_msg = msg.success;
							vm.success_register = true;
						}
					})
					.error(function(err){
						console.log('baby');
					});
			}
		}
      }

      function login(){
      	console.log(vm.pwdlogin);
      	console.log(vm.userlogin);
		vm.warm_register = false;
		vm.success_register = false;      	
		var data = {username: vm.userlogin, password: vm.pwdlogin};
		accountService.login(data)
			.success(function(user){
				console.log(user);
				$scope.$emit('changeAuth',{ auth: true, user: user});
				$location.url('/myMc');

			})
			.error(function(err){
				console.log('baby');
				vm.warm_msg = err;
				vm.warm_register = true;
			});      	
      }

      //function 1 way only
      function emailValidate(email){
      	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(email);
      }
}]);