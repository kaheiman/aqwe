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
		getMcQuestion: getMcQuestion,
		search: search,
		getMymc: getMymc,
		resave: resave,
		downLoadFile: downLoadFile,
		getUserInfo: getUserInfo,
		logout: logout
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
	function search(data){
		console.log("johioasda");
		return $http.post('api/account/search', {data: data});
	}
	function getMymc(data){
		console.log("my mc is called: ", data);
		return $http.post('api/account/getMymc', {id: data});
	}
	function resave(data){
		console.log("resave is called: ", data);
		if(data.delete)
			return $http.post('api/account/resave', {data: data.data, delete: data.delete});
		else
			return $http.post('api/account/resave', {data: data});
	}
	function downLoadFile(data){
		console.log("downLoadFile: ", data);
		return $http.post('api/account/downLoadFile', {data: data});
	}
	function getUserInfo(){
		return $http.get('api/account/getUserInfo');
	}
	function logout(){
		return $http.get('api/account/logout');
	}

}
