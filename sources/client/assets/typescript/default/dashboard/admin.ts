///<reference path="../javascript/angularjs/Typings/angular.d.ts"/>
///<reference path="../remoteData.ts"/>

var app = angular.module('myApp', []);

class angAdministration {

    private _httpService:ng.IHttpService = $http;
    private _scope;

    public view;

    public console;


    $inject = ["$http", "$scope"];

    constructor($http:ng.IHttpService, $scope) {
        //injections
        this._httpService = $http;
        this._scope = $scope;
        this.console = console;

        //data related
        this.view = "Home";
    }
}


app.controller('angAdministrationController', angAdministration);