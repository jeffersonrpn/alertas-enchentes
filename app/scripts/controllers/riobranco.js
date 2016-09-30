(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('RioBrancoCtrl', RioBrancoCtrl);

  RioBrancoCtrl.$inject = ['$http', '$templateCache'];

  /*jshint latedef: nofunc */
  function RioBrancoCtrl($http, $templateCache) {
    var vm = this;
    vm.river = {};

    $http(
      {
        method: 'GET',
        url: 'http://enchentes.infoamazonia.org:8080/station/13600002/history',
        cache: $templateCache
      }).then(function(response) {
        vm.river = response.data;
      }, function(response) {
        console.log("Erro");
      });
  }
})();
