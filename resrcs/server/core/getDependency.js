
var dependency = {};

function getDependency(dependencyArg) {
    dependency = dependency || {};
    if(typeof dependencyArg == "string"){
        if (!dependency[dependencyArg]) {
            dependency[dependencyArg] = require(dependencyArg);
        }
        return dependency[dependencyArg];
    }
    else if(typeof dependencyArg == "function"){
        if (!dependency[dependencyArg.name]) {
            dependency[dependencyArg.name] = dependencyArg();
        }
        return dependency[dependencyArg.name];
    }
    else {
        throw "Dependency injection not supported for type " + typeof dependencyArg ;
    }
}

var stack = stack || {};
stack.core = stack.core || {};
stack.core.getDependency = getDependency;

function updateDependency(dependencyArg){
    if (!dependency) {
        dependency = {};
    }
    if(typeof dependencyArg == "string"){
        dependency[dependencyArg] = require(dependencyArg);
        return dependency[dependencyArg];
    }
    else if(typeof dependencyArg == "function"){
        dependency[dependencyArg.name] = dependencyArg();
        return dependency[dependencyArg.name];
    }
    else {
        throw "Dependency injection not supported for type " + typeof dependencyArg ;
    }
}