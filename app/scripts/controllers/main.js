'use strict';

/**
 * @ngdoc function
 * @name 007SurvivalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 007SurvivalApp
 */
angular.module('007SurvivalApp')
  .controller('MainCtrl', function ($scope, $timeout, $rootScope, $interval, $http, resolvedWeapons, resolvedMaps, resolvedAmmo) {
    $scope.weapons = resolvedWeapons;
    $scope.ORIGINAL_LEVELS = angular.copy(resolvedMaps);
    $scope.ammo = resolvedAmmo;
    $scope.inGame = true; //setting true to simulate already in game
    $scope.map = null; //null is level select
    $scope.menu = 0;
    $scope.watchFuzz = false;
    var left = 37,
        up = 38,
      right = 39,
       down = 40,
       enter = 13,
       esc = 27,
        //lclick = 1,
        //rclick = 3,
        key;
      $scope.$watch('inGame', function(){
        if(!$scope.inGame && $scope.map !== null){
          setInterval(function() {
            $timeout(function() {
                angular.element('#status').fadeOut('slow');
              }, 1500);
              $timeout(function() {
                angular.element('#status').fadeIn('slow');
              }, 1500);
          }, 1000);
          $scope.fuzzInterval = $interval(function() {
            $timeout(function(){
              $scope.watchFuzz = !$scope.watchFuzz;
              var fuzzNoise = new Audio('../sounds/watchFuzz.wav');
              fuzzNoise.play();
            }, 15000);
          }, 8000);

          angular.element('.beep').prop('volume', 0.05);
          angular.element('.abort').css({
            opacity: 0.5
          });
        }
      });
      $scope.$watch('map', function(){
        if($scope.map === null){
          $interval.cancel($scope.fuzzInterval);
        }
      });
      $scope.currentWeapon = 0;
       /*
       ['dam', 'facility', 'runway', 'surface', 'bunker', 'silo', 'frigate', 'surface2', 'bunker2', 'statue', 'archives', 'streets', 'depot', 'train', 'jungle', 'control', 'caverns', 'cradle', 'aztec', 'egyptian'];*/
      $scope.levels = $scope.ORIGINAL_LEVELS;
      $scope.chunkedLevels = [];
      var size = 5;
      while ($scope.levels.length > 0){
          $scope.chunkedLevels.push($scope.levels.splice(0, size));
        }

      $rootScope.$on('keypress', function (e, a) {
          a.preventDefault();
          $scope.$apply(function () {
              $scope.touched(a);
          });
      });
      $scope.touched = function(e){
        key = e.keyCode;
        //on escape, go back to game
        e.preventDefault();
        angular.element('.abort').blur();
        angular.element('.abort').css({
          opacity: 0.5
        });
        if (key === up && $scope.menu === 1) {
          playSound();
          if ($scope.currentWeapon === 0){
            $scope.currentWeapon = $scope.weapons.length - 1;
          }
          else{
            $scope.currentWeapon--;
          }
        } else if (key === down && $scope.menu === 1) {
          playSound();
          if ($scope.currentWeapon === $scope.weapons.length - 1){
            $scope.currentWeapon = 0;
          }
          else{
            $scope.currentWeapon++;
          }
        }else if(key === enter && $scope.menu === 1){
          playSound();
        }

        else if (key === left && $scope.menu !== 0) {
          $scope.menu--;
          angular.element('.activebox').css('margin-left', parseInt(angular.element('.activebox').css('margin-left')) - 72 + 'px');
          playSound();
        } else if (key === right && $scope.menu !== 4) {
          playSound();
          $scope.menu++;
          angular.element('.activebox').css('margin-left', parseInt(angular.element('.activebox').css('margin-left')) + 72 + 'px');
        } else if (key === right && $scope.menu === 4) {
          playSound();
          $scope.menu = 0;
        } else if (key === left && $scope.menu === 0) {
          playSound();
          $scope.menu = 4;
          angular.element('.activebox').css('margin-left', '515px');
        } else if (key === down && $scope.menu === 0) {
          playSound();
          angular.element('.abort').css({
            opacity: 1
          });
          angular.element('.abort').attr('tabindex', -1).focus();
        } else if (key === up && $scope.menu === 0) {
          angular.element('.abort').css({
            opacity: 0.5
          });
          playSound();
          angular.element('.abort').focus();
        }
        else if(key === esc && $scope.map !== null){
          $scope.inGame = !$scope.inGame;
          if($scope.inGame){
            $scope.audio.pause();
            $scope.audio.currentTime = 0;
            $scope.mapMusic.play();
          }
          else{
            $scope.mapMusic.pause();
          }
        }
        if ($scope.menu === 0) {
          angular.element('.activebox').css('margin-left', '227px');
        }
      };

      function playSound() {
        angular.element('.beep')[0].play();
      }

      /*function closeWatch() {
        //show exit animation
        angular.element('.watch').hide();
        angular.element('.pausetheme')[0].pause();
        angular.element('.pausetheme')[0].currentTime = 0;
        $scope.inGame = false;
      }*/
      $scope.playAudio = function() {
          $scope.audio = new Audio('../sounds/pause.mp3');
          $scope.audio.play();
          $scope.audio.addEventListener('ended', function() {
              this.currentTime = 0;
              this.play();
          }, false);
      };
      $scope.go = function(map){
        $scope.inGame = true;
        for(var i in $scope.$resolve.resolvedMaps){
          if(map.name === $scope.$resolve.resolvedMaps[i].name){
            $scope.map = map;
          }
        }
        //parallax background of goldeneye maps
        //start audio
        $scope.mapMusic = new Audio(map.music);
        $scope.mapMusic.play().then(function(){
          $scope.mapMusic.addEventListener('ended', function() {
              this.currentTime = 0;
              this.play();
          }, false);
        });
        console.log(map);
      };
      $scope.abort = function(e){
        if(e.keyCode === 13){
          $scope.inGame = true;
          $scope.map = null;
          $scope.audio.pause();
          $scope.audio.currentTime = 0;
        }
      };
  });
