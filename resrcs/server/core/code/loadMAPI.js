function loadMAPI(mapiArg) {
    dependency = dependency || {};
    if (typeof mapiArg == "string") {
        if (!dependency[mapiArg]) {
            dependency[mapiArg] = require(mapiArg);
            var myDependency = dependency[mapiArg];
            if (myDependency.__NAME && myDependency.__VERSION && myDependency.__AUTHOR && myDependency.__STACKVERSIONS && myDependency.load) {
                if (myDependency.__STACKVERSIONS.indexOf(stack.globals.version) > -1){
                    stack.mapis[myDependency.__NAME] = myDependency;
                    myDependency.load(stack);
                } else {
                    throw "Dependency is not compatible with this stack version";
                }
            } else {
                console.log(myDependency.__NAME + " " + myDependency.__VERSION + " " + myDependency.__AUTHOR + " " + myDependency.load);
                delete dependency[mapiArg];
                throw "Dependency is not compatible";
            }
        }
        return dependency[mapiArg];
    }
    else {
        throw "Dependency injection not supported for type " + typeof mapiArg;
    }
}

stack.core.loadMAPI = loadMAPI;
