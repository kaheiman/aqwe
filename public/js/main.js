  angular.module('app', ['routerRoutes', 'ui.bootstrap'])
    .controller('mainController', ['$scope', '$rootScope', 'utilityService', 'accountService', '$routeParams', '$location', '$window', function($scope, $rootScope, utilityService, accountService, $routeParams, $location, $window){
      
      $scope.exportMc = [];         
      $scope.isAuth = {auth: false, username: ""};
      $scope.$on('changeAuth', function(event, args){
          console.log("change detected");
          console.log(args);
          $scope.isAuth = args;
          utilityService.setAuth(args);
          //any other action can be perfomed here
      });      
      $scope.list = [];
      $scope.mcs = [];
      $scope.input = 0;
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.filteredTodos = [];
      $scope.tag = "";
      $scope.username = "";
      $scope.time = "active";
      $scope.mcDetail = utilityService.getMcDetail();
      $scope.oneAtATime = true;
      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };      
      $scope.addMcToExport = addMcToExport;
      $scope.downLoadFile = downLoadFile;
      $scope.logout = logout;

      activate()

      function downLoadFile(){
        console.log("click downLoadFile");
        accountService.downLoadFile($scope.exportMc)
          .success(function(data){
              console.log(data);
              var fileName = "mcfile";
              var url = 'data:text/csv;charset=utf-8,' + encodeURI(data);
              var link = document.createElement("a");
              link.href = url;
              link.style = "visibility:hidden";
              link.download = fileName + ".csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          })
          .error(function(){

          });
      }
      function activate(){
        $scope.path = $location.path();
        console.log("path: ", $scope.path);
        if($scope.path == '/'){
          $scope.fistShow = true;
        }
        console.log("@@@@@@@@@@@@");
        $scope.isAuth = utilityService.getAuth();
        //get userinfo()
        accountService.getUserInfo()
          .success(function(userInfo){
              if(userInfo){
                console.log("hello world");
                $scope.isAuth = {auth: true, user:userInfo};
                utilityService.setAuth($scope.isAuth);
                console.log("isAuth: ", $scope.isAuth);                 
              }
          })
          .error(function(err){
            console.log(err);
          });
        accountService.getMcQuestion()
          .success(function(mcs){
              console.log('######################: ');
              console.log(mcs);
              $scope.mcs = mcs;
              if($scope.mcs.length > 10)
                $scope.filteredTodos = $scope.mcs.slice(0, 10);
              else
                $scope.filteredTodos = $scope.mcs.slice(0, $scope.mcs.length);          
          })
          .error(function(err){
              console.log('mc error: ', err);
          });
      }
      function addMcToExport(mc){
            var index = "";
            var indexBool = $scope.exportMc.some(function(el, idx){
                  if(el._id == mc._id){
                        index = idx;   
                        return true;
                      }
                  else
                      return false;
            });
            console.log(index);
            if(indexBool == false){
                  $scope.exportMc.push(mc);
                }
            else
                  $scope.exportMc.splice(index, 1);
      }      

      function logout(){
         console.log("this is logout");
         utilityService.setAuth = null;
         accountService.logout()
          .success(function(){
            console.log("logout success");
            $window.location.reload();

          })
          .error(function(){
            console.log("errr");
          })
      }

      $scope.storeMc = function(index){
        console.log('index: ', index);
        utilityService.setMcDetail($scope.filteredTodos[index]);
      }
      $scope.changeClass = function(value){
        if(value == 'tag'){
            $scope.tag = "active";
            $scope.username = "";
            $scope.time = "";          
        }
          else if(value == 'modify'){
            $scope.tag = "";
            $scope.username = "";
            $scope.time = "active";            
          }
            else{
                $scope.tag = "";
                $scope.username = "active";
                $scope.time = "";              
            }
      }

      $scope.search = function(){
        console.log($scope.userSearch);
        if($scope.tag == 'active'){
          console.log("comeon");
          var tags = $scope.userSearch.split(" ");
          console.log('tags: ', tags);
          var data = {tags: tags, type: "tag"};
          accountService.search(data)
            .success(function(mcs){
                $scope.mcs = mcs;
                if($scope.mcs.length > 10)
                  $scope.filteredTodos = $scope.mcs.slice(0, 10);
                else 
                  $scope.filteredTodos = $scope.mcs.slice(0, $scope.mcs.length);          
            })
            .error(function(err){

            });         
        } else if($scope.username == 'active'){
          console.log('active');
          var data = {owner: $scope.userSearch, type: "name"};
          accountService.search(data)
            .success(function(mcs){
                $scope.mcs = mcs;
                if($scope.mcs.length > 10)
                  $scope.filteredTodos = $scope.mcs.slice(0, 10);
                else 
                  $scope.filteredTodos = $scope.mcs.slice(0, $scope.mcs.length);          
            })
            .error(function(err){

            });           
        }
      }

      $scope.$watch('currentPage + numPerPage', function() {
        reArrange();
      });     
      
      function reArrange(){
        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
        
        $scope.filteredTodos = $scope.mcs.slice(begin, end);
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