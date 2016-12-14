"use strict";
var app = angular.module('routerRoutes', ['ngRoute'])
	.config(function($routeProvider, $locationProvider){
		$routeProvider.
			when('/login', {
				templateUrl: './views/login.html',
				controller: 'loginController',
				controllerAs: 'vm'
			}).
			when('/register', {
				templateUrl: './views/register.html',
				controller: 'loginController',
				controllerAs: 'vm'
			}).
			when('/myMc',{
				templateUrl: './views/mymc.html',
				controller: 'mcController',
				controllerAs: 'vm'				
			}).
			when('/explore', {
				templateUrl: '/views/explore.html',
				controller: 'mainController'
			}).
			when('/mcDetail/:id', {
				templateUrl: '/views/mcDetail.html',
				controller: 'mainController'				
			}).
			when('/about', {
				templateUrl: 'views/about.html',
				controller: 'mainController'
			}).
			otherwise({
				redirectTo: '/' 
			});

			 $locationProvider.html5Mode(true);
	});
// 	.controller('HomeController', ['$scope', function HomeController($scope) {
// 		$scope.helloWorld = "Hello, AngularJS!";

// }]);