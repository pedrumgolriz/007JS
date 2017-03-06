'use strict';

/**
 * @ngdoc overview
 * @name 007SurvivalApp
 * @description
 * # 007SurvivalApp
 *
 * Main module of the application.
 */
angular
  .module('007SurvivalApp', [
    'ngAnimate',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve:{
          resolvedWeapons: ['$http', function($http){
            return $http.get('../data/weapons.json').then(function(res){
             return res.data;
            });
          }],
          resolvedMaps: ['$http', function($http){
            return $http.get('../data/maps.json').then(function(res){
             return res.data;
            });
          }],
          resolvedAmmo: ['$http', function($http){
            return $http.get('../data/ammo.json').then(function(res){
             return res.data;
            });
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/map/:', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .filter('trust', ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    };
  }])
  .directive('onEnter', function () {
      return function (scope, element, attrs) {
          element.bind('keydown keypress', function (event) {
              if(event.which === 13) {
                  scope.$apply(function (){
                      scope.$eval(attrs.myEnter);
                  });

                  event.preventDefault();
              }
          });
      };
  })
    .directive('keypressEvents', function ($document, $rootScope) {
      return {
          restrict: 'A',
          link: function () {
              console.log('linked');
              $document.bind('keydown', function (e) {
                  $rootScope.$broadcast('keypress', e, String.fromCharCode(e.which));
              });
          }
      };
  });
