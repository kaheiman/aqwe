  angular.module('app', ['routerRoutes'])
    .controller('mainController', ['$scope', '$rootScope', 'utilityService', 'accountService', function($scope, $rootScope, utilityService, accountService){
      
      $scope.isAuth = {auth: false, username: ""};
      $scope.$on('changeAuth', function(event, args){
          console.log("change detected");
          console.log(args);
          $scope.isAuth = args;

          //any other action can be perfomed here
      });      
      $scope.list = [];
      $scope.mcs = [];
      $scope.input = 0;

      activate()

      function activate(){
        accountService.getMcQuestion()
          .success(function(mcs){
              console.log('######################: ');
              console.log(mcs);
              $scope.mcs = mcs;
          })
          .error(function(err){
              console.log('mc error: ', err);
          });
      }

      $scope.push = function(){
        console.log("input: " + $scope.input);
        var type = "";
        if($scope.input < 0){ type = "type3";} //-ve
        else{
          if($scope.input % 2 == 0){type = "type1";} //even
          else
            type = "type2"; //odd
        }
        $scope.list.push({"num" : $scope.input, "type": type});
        console.log($scope.list);
        $scope.input = "";
      };
      $scope.pop = function(){
        $scope.list.shift();
        $scope.input = "";
      };
      $scope.about = function(){
        console.log("come on jeans");
      }
    }]);