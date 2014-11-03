(function(){
  'use strict';

  angular.module('meanr')
  .factory('User', ['$rootScope', '$http', '$localForage', function($rootScope, $http, $localForage){
    var _email;

    $localForage.getItem('email').then(function(email){
      broadcast(email);
    });

    $rootScope.$on('unauthorized', function(){
      setEmail(null);
    });

    function broadcast(email){
      _email = email;
      $rootScope.$broadcast('email', _email);
    }

    function getEmail(){
      return _email;
    }

    function setEmail(email){
      broadcast(email);
      return $localForage.setItem('email', email);
    }

    function register(user){
      return $http.post('/register', user);
    }

    function login(user){
      return $http.post('/login', user).then(function(response){
        return setEmail(response.data.email);
      });
    }

    function logout(){
      return $http.delete('/logout').then(function(){
        return setEmail(null);
      });
    }

    return {getEmail:getEmail, setEmail:setEmail, register:register, login:login, logout:logout};
  }]);
})();
