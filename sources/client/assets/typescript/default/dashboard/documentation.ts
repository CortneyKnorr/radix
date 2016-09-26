///<reference path="../javascript/angularjs/Typings/angular.d.ts"/>
///<reference path="../remoteData.ts"/>

var app = angular.module('myApp', []);

class angDocumentation {

    private _httpService:ng.IHttpService = $http;
    private _scope;

    private elem:HTMLDivElement;
    public docContainer:HTMLDivElement;

    public fabDisplayed:Boolean;
    public currentElement;
    public confirm;

    public view;
    public tool;
    public data;

    public remoteDocs:RemoteData;

    public mark;
    public console;


    $inject = ["$http", "$scope"];
    private remoteUser;
    public admin;

    constructor($http:ng.IHttpService, $scope) {
        //injections
        this._httpService = $http;
        this._scope = $scope;
        this.console = console;
        this.confirm = confirm;

        this.tool = "Edit";

        this.elem = document.getElementById("output") as HTMLDivElement;
        this.docContainer = document.getElementById("docContainer") as HTMLDivElement;

        //libraries
        //noinspection TypeScriptUnresolvedFunction
        this.mark = new Remarkable({
            html: true,
            linkify: true,
            typographer: true
        });

        this.fabDisplayed = false;
        //data related
        this.view = "Home";
        this._scope.$watch("$.remoteDocs.localData.content", () => {
            this.elem.innerHTML = this.mark.render(this.remoteDocs.localData.content);
        });

        this.remoteDocs = new RemoteData(
            "/dashboard/docs",
            "/dashboard/docs",
            "/dashboard/docs",
            "/dashboard/docs",
            {
                title: "",
                content: "Text here",
                tags: [],
                author: "Documentation",
            },
            this._httpService
        );

        this.remoteUser = new RemoteData(
            "/me",
            "/me",
            "/me",
            "/me",
            {
                title: "",
                content: "Text here",
                tags: []
            },
            this._httpService
        );
        this.remoteDocs.getAllData()
            .then(data => {
                this._scope.$apply();
            })
        ;
        this.admin = false;
        this.remoteUser.getAllData()
            .then(data => {
                if (data.admin){
                    this.admin = true;
                }
            })
        ;
        this.remoteDocs.clearLocal();
    }

    output(element) {
        this.docContainer.innerHTML = this.mark.render(element.content);
        this.fabDisplayed = true;
        this.currentElement = element;
    }

    save() {
        this.remoteDocs.localData.author = "Documentation";
        this.remoteDocs.postToRemote().then(data => {
            this.remoteDocs.clearLocal();
            this.view = "Home";
            this.tool = "Create";
            this._scope.$apply();
        })
    }

    delete() {
        this.remoteDocs.deleteRemote(this.currentElement._id)
            .then(data => {
                this._scope.$apply();
            })
        ;
        this.docContainer.innerHTML = "";
    }

    update() {
        if (confirm('Are you sure you want to update this document?')) {
            var content = this.currentElement.content;
            this.remoteDocs.updateRemote(this.currentElement._id)
                .then(data => {
                    console.log(this.currentElement);
                    this.remoteDocs.clearLocal();
                    this.view = "Home";
                    this.tool = "Create";
                    this.docContainer.innerHTML = this.mark.render(content);
                    this._scope.$apply();
                })
            ;
        } else {
            // Do nothing!
        }
    }

    edit() {
        console.log("asdasdasdasdads");
        this.view = "Edit";
        this.remoteDocs.localData = this.currentElement;
        this.tool = "Edit";
    }
}


app.controller('angDocumentationController', angDocumentation);