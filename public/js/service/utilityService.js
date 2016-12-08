"use strict";
app.factory('utilityService', utilityService);
utilityService.$inject = [];

function utilityService($scope) {

	var username = "";
	var auth = false;
	console.log("fuck fuk");
	var service = {
		setAuth : setAuth,
		getAuth	: getAuth
	};
	return service;

	function setAuth(name){
		username = name;
		auth = true;
		console.log("service called");
	}

	function getAuth(){
		return {auth: auth, username: username};
	}

}