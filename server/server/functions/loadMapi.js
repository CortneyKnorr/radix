function loadMapi(mapiArg) {
    if (!dependencies) {
        dependencies = {};
    }
    if (typeof mapiArg == "string") {
        if (!dependencies[mapiArg]) {
            dependencies[mapiArg] = require(mapiArg);
            var myDependency = dependencies[mapiArg];
            if (myDependency.__NAME && myDependency.__VERSION && myDependency.__AUTHOR && myDependency.__STACKVERSIONS && myDependency.load) {
                if (myDependency.__STACKVERSIONS.indexOf(stack.globals.version) > -1){
                    $project.mapis[myDependency.__NAME] = myDependency;
                    $project.mapisList.add(myDependency.__NAME);
                    myDependency.load(stack);
                } else {
                    throw "Dependency is not compatible with this server version";
                }
            } else {
                console.log(myDependency.__NAME + " " + myDependency.__VERSION + " " + myDependency.__AUTHOR + " " + myDependency.load);
                delete dependencies[mapiArg];
                throw "Dependency is not compatible";
            }
        }
        return dependencies[mapiArg];
    }
    else {
        throw "Dependency injection not supported for type " + typeof mapiArg;
    }
}
