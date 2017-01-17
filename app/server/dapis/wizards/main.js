function stack_dapis_wizards() {
    let wizards = {};
    let standards = wizards.standards = {};
    let objects = wizards.objects = {};
    let cruds = wizards.cruds = {};

    /*
     Standards
     Wizards for standards will often be used to simplify the implementation
     of a norm
     */
    standards.ehgf13Arg = function ehgf13Arg(arg, request, defaultValue) {
        var value;
        if (typeof arg == "function") {
            value = arg(request);
        } else if (typeof arg == "undefined") {
            value = defaultValue;
        } else {
            value = arg;
        }
        return value;
    };

    standards.ehgf14Arg = function ehgf13Arg(arg, request, defaultValue) {
        if (Object.getPrototypeOf(arg) == Object.getPrototypeOf(function*(){})) {
            return controlFlowCall(arg)(request);
        } else {
            return new Promise((resolve, reject) => {
                if (typeof arg == "function") {
                    resolve(arg(request));
                } else if (typeof arg == "undefined") {
                    resolve(defaultValue);
                } else {
                    resolve(arg);
                }
            });
        }
    };
    /*
     Objects
     Wizards for objects are a set of awesome function that can be used on
     js objects
     */
    objects.update = function update(instance, leanInstance) {
        for (let key in leanInstance) {
            if (!instance.hasOwnProperty(key)) {

            }
            instance[key] = leanInstance[key];
        }
        return instance;
    };

    /*
     Cruds
     Wizards for simplifying crud creation;
     */
    cruds.ehgs = {
        update(idArg, modelArg, leanInstanceArg) {
            return function*(request, response, next) {
                let model = wizards.standards.ehgf13Arg(modelArg, request, false);
                let id = wizards.standards.ehgf13Arg(idArg, request, false);
                let leanInstance = wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                if (model && id && typeof leanInstance == "object") {
                    let myInstance = yield model.findById(id);
                    wizards.objects.update(myInstance, leanInstance);
                    response.send(yield myInstance.save())
                } else {
                    throw "Express generator arguments are invalid";
                }
            }
        },
        get(idArg, modelArg) {
            return function*(request, response, next) {
                let model = wizards.standards.ehgf13Arg(modelArg, request, false);
                let id = wizards.standards.ehgf13Arg(idArg, request, false);
                if (model && id) {
                    response.send(yield model.findById(id));
                } else {
                    throw "Express generator arguments are invalid";
                }
            }
        },
        getAll(modelArg) {
            return function*(request, response, next) {
                let model = wizards.standards.ehgf13Arg(modelArg, request, false);
                if (model) {
                    response.send(yield model.find(id));
                } else {
                    throw "Express generator arguments are invalid";
                }
            }
        },
        delete(idArg, modelArg) {
            return function*(request, response, next) {
                let model = wizards.standards.ehgf13Arg(modelArg, request, false);
                let id = wizards.standards.ehgf13Arg(idArg, request, false);
                if (model && id) {
                    response.send(yield model.findByIdAndRemove(id));
                } else {
                    throw "Express generator arguments are invalid";
                }
            }
        },
        create(modelArg, leanInstanceArg) {
            return function*(request, response, next) {
                let model = wizards.standards.ehgf13Arg(modelArg, request, false);
                let leanInstance = wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                if (model && typeof leanInstance == "object") {
                    let myInstance = new model(leanInstance);
                    response.send(yield myInstance.save())
                } else {
                    throw "Express generator arguments are invalid";
                }
            }
        },
    };
    cruds.simpleEhg = function (func, param1, param2) {
        return function*(request, response, next) {
            var thePromise;
            if (param1 && param2) {
                thePromise = func(
                    standards.ehgf13Arg(param1, request, false),
                    standards.ehgf13Arg(param2, request, false)
                );
            } else if (param1) {
                thePromise = func(
                    standards.ehgf13Arg(param1, request, false)
                );
            } else {
                thePromise = func();
            }
            response.send(yield* thePromise);
        };
    };

    return wizards;

}