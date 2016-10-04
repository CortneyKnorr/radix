function stack_dapis_settings() {
    let Settings = getDependency(stack_models_settings);
    let thisDapi = {
        cfs: {
            create: function*(leanInstance) {
                let numberOfKeys = yield Settings.count({key: leanInstance.key});
                if (numberOfKeys) {
                    throw "Key exists";
                } else {
                    return yield (new Settings(leanInstance)).save();
                }
            },
            set: function*(key, value) {
                let settings = yield Settings.findOne({key});
                settings.value = value;
                return yield settings.save();
            },
            reset: function*(key) {
                let settings = yield Settings.findOne({key});
                settings.value = settings.default;
                return yield settings.save();
            },
            getUsingKey: function*(key) {
                return yield Settings.findOne({key});
            },
            get: function*(id) {
                return yield Settings.findById(id);
            },
            update: function*(id, leanInstance) {
                let settings = yield Settings.findById(id);
                stack.dapis.wizards.objects.update(settings, leanInstance);
                return yield settings.save();
            },
            delete: function*(id) {
                return yield Settings.findByIdAndRemove(id);
            },
        },
        ehgs: {
            create: function (leanInstanceArg) {
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, {});
                    response.send(yield* thisDapi.cfs.create(leanInstance));
                }
            },
            set: function (keyArg, valueArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    let value = stack.dapis.wizards.standards.ehgf13Arg(valueArg, request, false);
                    response.send(yield* thisDapi.cfs.set(key, value));
                }
            },
            reset: function (keyArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    response.send(yield* thisDapi.cfs.reset(key));
                }
            },
            getUsingKey: function (keyArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    response.send(yield* thisDapi.cfs.getUsingKey(key));
                }
            },
            get: function (idArg) {
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                }
            },
            update: function (id, leanInstanceArg) {
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.update(id, leanInstance));
                }
            },
            delete: function (idArg) {
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.delete(id));
                }
            },
        }
    };
    return thisDapi;
}