function stack_dapis_settings() {
    let Settings = getDependency(stack_models_settings);

    let thisDapi = {
        fcs: {
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
            getUsingCategory: function*(category) {
                return yield Settings.find({category});
            },
            getPaged: function* (page, pageLength) {
                let offset = page*pageLength;
                return yield Settings.find().skip(offset).limit(pageLength);
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
            create(leanInstanceArg) {
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, {});
                    try {
                        let createdSetting = yield* thisDapi.fcs.create(leanInstance);
                        response.send(createdSetting);
                    } catch(e) {
                        response.send(e);
                    }
                }
            },
            set(keyArg, valueArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    let value = stack.dapis.wizards.standards.ehgf13Arg(valueArg, request, false);
                    response.send(yield* thisDapi.fcs.set(key, value));
                }
            },
            reset(keyArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    response.send(yield* thisDapi.fcs.reset(key));
                }
            },
            getUsingCategory(categoryArg) {
                return function*(request, response, next) {
                    let category = stack.dapis.wizards.standards.ehgf13Arg(categoryArg, request, false);
                    response.send(yield* thisDapi.fcs.getUsingKey(category));
                }
            },
            getUsingKey(keyArg) {
                return function*(request, response, next) {
                    let key = stack.dapis.wizards.standards.ehgf13Arg(keyArg, request, false);
                    response.send(yield* thisDapi.fcs.getUsingKey(key));
                }
            },
            getPaged(pageArg, pageLengthArg) {
                return function*(request, response){
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    let results = yield* thisDapi.fcs.getPaged(page, pageLength);
                    response.send(results);
                };
            },
            get(idArg) {
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.fcs.get(id));
                }
            },
            update(id, leanInstanceArg) {
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.fcs.update(id, leanInstance));
                }
            },
            delete(idArg) {
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.fcs.delete(id));
                }
            },
        }
    };
    return thisDapi;
}