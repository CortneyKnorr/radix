///<reference path="../javascript/angularjs/Typings/angular.d.ts"/>
///<reference path="../remoteData.ts"/>

var app = angular.module('myApp', []);

class angDeveloper {

    private _httpService:ng.IHttpService = $http;
    private _scope;

    public view;

    public console;

    public clientRemote:RemoteData;
    public cssStructRemote:RemoteData;
    public clients;

    public modelsRemote:RemoteData;
    public modelDetails;
    public modelPropertyNew;

    public userDialog;


    $inject = ["$http", "$scope"];

    constructor($http:ng.IHttpService, $scope) {
        //injections
        this._httpService = $http;
        this._scope = $scope;
        this.console = console;

        //dom related
        this.userDialog = document.querySelector('#modal-example');
        if (!this.userDialog.showModal) {
            dialogPolyfill.registerDialog(this.userDialog);
        }


        //data related
        this.view = "Home";
        this.clientRemote = new RemoteData(
            "/dashboard/users",
            "/dashboard/users",
            "/dashboard/users",
            "/dashboard/users",
            {
                username: "",
                password: "",
                groups: [],
                rights: 5
            },
            this._httpService
        );
        this.cssStructRemote = new RemoteData(
            "/dashboard/cssstruct",
            "/dashboard/cssstruct",
            "/dashboard/cssstruct",
            "/dashboard/cssstruct",
            {
                data: {},
            },
            this._httpService
        );
        this.cssStructRemote.getAllData()
            .then(_ => {
                console.log(this.cssStructRemote.fetchedData);
                this.cssStructRemote.localData.data = this.cssStructRemote.fetchedData;
            })
        ;
        this.modelsRemote = new RemoteData(
            "/dashboard/models",
            "/dashboard/models",
            "/dashboard/models",
            "/dashboard/models",
            {
                name: "",
                fields: []
            },
            this._httpService
        );
        this.clientRemote.getAllData();
        this.modelsRemote.getAllData()
            .then(data => {
                console.log(data);
            })
        ;
        this.modelDetails = {};
        this.modelPropertyNew = {
            name: "",
            type: "String",
            ref: "",
            unique: false,
            required: false,
            auto: false,
        };
    }

    showModelDialog(index) {
        this.modelDetails = this.modelsRemote.fetchedData[index];
        this.userDialog.showModal();
    }

    closeModelDialog() {
        this.userDialog.close();
    }

    modelAddProperty() {
        this.modelsRemote.localData.fields.push({
            auto: this.modelPropertyNew.auto,
            unique: this.modelPropertyNew.unique,
            required: this.modelPropertyNew.required,
            name: this.modelPropertyNew.name,
            type: this.modelPropertyNew.type,
            ref: this.modelPropertyNew.ref,
        });
        this.modelClearProperty();
    }

    removeModelProperty(index){
        this.modelsRemote.localData.fields.splice(index, 1);
    }

    modelClearProperty(){
        this.modelPropertyNew.auto = false;
        this.modelPropertyNew.unique = false;
        this.modelPropertyNew.required = false;
        this.modelPropertyNew.name = "";
        this.modelPropertyNew.type = "String";
        this.modelPropertyNew.ref = "";
    }

    modelUpdate(){
        this.modelsRemote.localData.name = this.modelDetails.name;
        for(var propertyIndex in this.modelDetails.schema.paths){
            var property = this.modelDetails.schema.paths[propertyIndex];
            console.log(property);
            var field:{name: String, unique: boolean, required: boolean, auto: boolean, ref: string, type: string} = {};
            field.name = property.path;
            field.unique = property.options.unique;
            field.required = property.options.required;
            field.auto = property.options.auto;
            field.ref = property.options.ref;
            field.type = property.instance == "ObjectID" ? "Schema.ObjectId" : property.instance;
            this.modelsRemote.localData.fields.push(field);
        }
        this.modelsRemote.updateRemote(this.modelDetails.name);
        alert("This page will reload in 5s");
        setTimeout(function () {
            location.reload();
        }, 5000);
    }

    postModelToRemote(){
        this.clientRemote.postToRemote();
        this.modelsRemote.localData.fields = [];
    }
}


app.controller('angDeveloperController', angDeveloper);