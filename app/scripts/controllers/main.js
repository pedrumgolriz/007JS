'use strict';

/**
 * @ngdoc function
 * @name 007SurvivalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 007SurvivalApp
 */
angular.module('007SurvivalApp')
  .controller('MainCtrl', function ($scope, $timeout, $rootScope) {
    $scope.inGame = true; //setting true to simulate already in game
    $scope.map = null; //null is level select
    $scope.menu = 0;
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
        if(!$scope.inGame){
          setInterval(function() {
            $timeout(function() {
                angular.element('#status').fadeOut('slow');
              }, 1500);
              $timeout(function() {
                angular.element('#status').fadeIn('slow');
              }, 1500);
          }, 1000);
          angular.element('.beep').prop('volume', 0.1);
          angular.element('.abort').css({
            opacity: 0.5
          });
        }
      });
      $scope.currentWeapon = 0;
      var ORIGINAL_LEVELS = ['dam', 'facility', 'runway', 'surface', 'bunker', 'silo', 'frigate', 'surface2', 'bunker2', 'statue', 'archives', 'streets', 'depot', 'train', 'jungle', 'control', 'caverns', 'cradle', 'aztec', 'egyptian'];
      $scope.levels = ['dam', 'facility', 'runway', 'surface', 'bunker', 'silo', 'frigate', 'surface2', 'bunker2', 'statue', 'archives', 'streets', 'depot', 'train', 'jungle', 'control', 'caverns', 'cradle', 'aztec', 'egyptian'];
      $scope.chunkedLevels = [];
      var size = 5;
      while ($scope.levels.length > 0){
          $scope.chunkedLevels.push($scope.levels.splice(0, size));
        }

      $scope.weapons = [{
        'name': 'PP7 (silenced)',
        'ammoType': '9mm',
        'ammo': '&#8734;',
        'loaded': '7',
        'image': 'http://i.imgur.com/Q0eAPwd.gif'
      }, {
        'name': 'Klobb',
        'ammoType': '9mm',
        'ammo': '16',
        'loaded': '9',
        'image': 'http://i.imgur.com/JCi23op.gif'
      }, {
        'name': 'Sniper Rifle',
        'ammoType': 'rifle',
        'ammo': '8',
        'loaded': '4',
        'image': 'http://i.imgur.com/xjQW3o6.gif'
      }, {
        'name': 'Cougar Magnum',
        'ammoType': 'magnum',
        'ammo': '6',
        'loaded': '3',
        'image': 'http://i.imgur.com/VcuVVo7.gif'
      }, {
        'name': 'Throwing Knife',
        'ammoType': 'tknife',
        'loaded': '2',
        'ammo': '',
        'image': 'http://i.imgur.com/hwsMZj7.gif'
      }];
      $scope.ammo = {
        '9mm': {
          'image': 'http://i.imgur.com/9vKZbX5.gif?1'
        },
        'rifle': {
          'image': 'http://i.imgur.com/Z4bVnf7.gif?1'
        },
        'magnum': {
          'image': 'http://i.imgur.com/f9GnwXP.gif'
        },
        'unarmed': {
          'image': 'http://i.imgur.com/aZXVoWv.png'
        },
        'tknife': {
          'image': 'http://i.imgur.com/aZXVoWv.png'
        }
      };
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
        else if(key === esc){
          $scope.inGame = !$scope.inGame;
          if($scope.inGame){
            $scope.audio.pause();
            $scope.audio.currentTime = 0;
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
        for(var i in ORIGINAL_LEVELS){
          if(map === ORIGINAL_LEVELS[i]){
            $scope.map = i;
          }
        }
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
