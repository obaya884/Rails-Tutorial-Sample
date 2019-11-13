var app = angular.module('App', ['ngResource']);

app.component('testComponent', {
    templateUrl: "button.html",
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
    templateUrl: "home_page.html",
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
    templateUrl: "user_page.html",
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
