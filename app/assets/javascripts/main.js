var app = angular.module('App', ['ngResource', 'templates']);

app.component('testButton', {
    templateUrl: 'testButton.html',
    bindings: {
        valueTest: '@'
    },
    controller: ['$timeout', function (a) {
        var ctrl = this;

        // Constructor
        ctrl.$onInit = function () {
            ctrl.value = 'abc';
        };

        // Event
        ctrl.click = function () {
            a(function () {
                ctrl.value = ctrl.valueTest;
            }, 1000);
        };
  }],
    controllerAs: '$ctrl'
});

app.component('homePage', {
    templateUrl: 'homePage.html',
    bindings: {},
    controller: [
    '$scope',
    'PageService',
    function ($scope, PageService) {
            var ctrl = this;

            // Constructor
            ctrl.$onInit = function () {
                ctrl.shown = (PageService.status === 'home-page');
            };

            // Event
            ctrl.jumpToUserPage = function () {
                PageService.status = 'user-page';
            };

            // Watcher
            $scope.$watch(
                function () {
                    return PageService.status;
                },
                function () {
                    ctrl.shown = (PageService.status === 'home-page');
                }
            );
    }
  ],
    controllerAs: '$ctrl'
});

app.component('userPage', {
    templateUrl: 'userPage.html',
    bindings: {},
    controller: [
    '$scope',
    'PageService',
    'QiitaResource',
    function ($scope, PageService, QiitaResource) {
            var ctrl = this;

            // Constructor
            ctrl.$onInit = function () {
                ctrl.shown = (PageService.status === 'user-page');
            };

            // Event
            ctrl.jumpToHomePage = function() {
              PageService.status = 'home-page';
            };

            ctrl.getQiita = function () {
                var resource = QiitaResource.get();

                resource.$promise.then(function () {
                    ctrl.title = resource[0].title;
                    ctrl.body = resource[0].body;
                });
                resource.$resolved;
            };

            // Watcher
            $scope.$watch(
                function () {
                    return PageService.status;
                },
                function () {
                    ctrl.shown = (PageService.status === 'user-page');
                }
            );
    }
  ],
    controllerAs: '$ctrl',
});

app.service('PageService', function () {
    var service = this;
    service.status = 'home-page';
});

app.service('QiitaResource', [
  '$resource',
  function ($resource) {
        return $resource(
            'https://qiita.com/api/v2/items', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            }
        );
  }]);
