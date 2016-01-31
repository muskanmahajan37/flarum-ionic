angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('CommunityCtrl', function ($scope, Discussions, $http, $state, $rootScope) {
    $scope.$on('$ionicView.beforeEnter', function () {
      if ($rootScope.userId) {
        $scope.isLogin = true;
      }
    });

    Discussions.all().$promise.then(function (response) {
      $scope.topics = response.data;
      $scope.included = response.included;
    });
    $scope.doRefresh = function () {
      Discussions.all().$promise.then(function (response) {
        $scope.topics = response.data;
        $scope.included = response.included;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      })
    };
  })

  .controller('LoginCtrl', function ($scope, $http, $rootScope, $ionicHistory) {
    $scope.user = {};
    $scope.isLogin = $rootScope.userId;

    $scope.doLogin = function (user) {
      var payload = {
        identification: user.username,
        password: user.password
      };

      $http.post('http://forum.growth.ren/' + 'api/token', payload)
        .success(function (data) {
          $scope.isLogin = true;
          $rootScope.userId = data.userId;
          $ionicHistory.goBack(-1);
        })
        .error(function (data, status) {
          if (status === 401) {
            $scope.error = '用户名或密码错误'
          }
        });
    };
  })
  .controller('SigninCtrl', function ($scope, $http, $state, $ionicPopup) {
    $scope.user = {
      username: '',
      password : '',
      email: ''
    };

    $scope.signIn = function() {
      var payload = {
        username: $scope.user.username,
        email: $scope.user.email,
        password: $scope.user.password
      };

      $http.post('http://forum.growth.ren/register', payload)
        .success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '注册成功',
            template: '欢迎你，' + $scope.user.username + '。我们已经发送了一封邮件至 ' + $scope.user.email + '，请打开它并完成账号激活。'
          });

          alertPopup.then(function(res) {
            $state.go('app.community');
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        })
        .error(function (data, status) {
          console.log(data.errors);
          $scope.errors = data.errors
        });

    };

  });

