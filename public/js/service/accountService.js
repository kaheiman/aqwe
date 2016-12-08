//name if services suggestions, variable name demoSuggestions and return 
//demoSuggestions is a json object 
"use strict";
app.factory('accountService', accountService);
accountService.$inject = ['$http'];

function accountService($http) {

	var service = {
		register: register,
		login : login,
		createMc: createMc,
		getMcQuestion: getMcQuestion
	};
	return service;

	function register(data){
		console.log("register: ", data);
		return $http.post('/api/account/register', {register: data});
	}

	function login(data){
		// return $http.post()
		console.log('login', data);
		return $http.post('/api/account/login', {login: data});
	}
	function createMc(data){
		console.log('Mc: ', data);
		return $http.post('api/account/createMc',{mc: data});
	}
	function getMcQuestion(){
		return $http.get('api/account/getMc');
	}

}
