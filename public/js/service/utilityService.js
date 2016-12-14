"use strict";
app.factory('utilityService', utilityService);
utilityService.$inject = [];

function utilityService($scope) {

	var username = "";
	var auth = "";
	var mcDetail = "";
	console.log("fuck fuk");
	var service = {
		setAuth : setAuth,
		getAuth	: getAuth,
		setMcDetail: setMcDetail,
		getMcDetail: getMcDetail
	};
	return service;

	function setAuth(user){
		auth = user;
		console.log("service called", user);
	}

	function getAuth(){
		return auth;
	}
	function setMcDetail(mcInfo){
		mcDetail = mcInfo;
	}
	function getMcDetail(){
		return mcDetail;
	}
}