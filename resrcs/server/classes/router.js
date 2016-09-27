class StackRouter extends getDependency("express").Router {
    constructor(){
        super();
    }

    onGet(path, ...args){
        super.get(path, ...args.map(arg => controlFlowCall(arg)));
        return this;
    }

    onPost(path, ...args){
        super.post(path, ...args.map(arg => controlFlowCall(arg)));
        return this;
    }

    onPut(path, ...args){
        super.put(path, ...args.map(arg => controlFlowCall(arg)));
        return this;
    }

    onDelete(path, ...args){
        super.delete(path, ...args.map(arg => controlFlowCall(arg)));
        return this;
    }

    onRoute(path){
        var route = super.route(path);

        route.onGet = function (...args) {
            route.get(...args.map(arg => controlFlowCall(arg)));
            return route;
        };
        route.onPost = function (...args) {
            route.post(...args.map(arg => controlFlowCall(arg)));
            return route;
        };
        route.onPut = function (...args) {
            route.put(...args.map(arg => controlFlowCall(arg)));
            return route;
        };
        route.onDelete = function (...args) {
            route.delete(...args.map(arg => controlFlowCall(arg)));
            return route;
        };

        return route;
    }
}