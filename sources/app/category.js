function loadCategoryContent() {
    category = {};
    category.dapi = getDependency(stack_dapis_contents);
    category.channel = "category";


    category.cfs = {
        create: function*(lightInstance) {
            lightInstance.channel = category.channel;
            return yield* category.dapi.cfs.create(lightInstance);
        },

        update: function*(id, lightInstance) {
            return yield* category.dapi.cfs.update(id, lightInstance);
        },

        delete: function*(id) {
            return yield* category.dapi.cfs.delete(id);
        },

        get: function*(id) {
            return yield* category.dapi.cfs.get(id);
        },

        getPaged: function*(page, pageLength) {
            return yield* category.dapi.cfs.getPaged(category.channel, page, pageLength);
        },
    }
    ;

    category.ehgs = {

        create(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* category.cfs.create(id));
            }
        },
        update(idArg, lightInstanceArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                let lightInstance = stack.dapis.wizards.standards.ehgf13Arg(lightInstanceArg, request, false);
                response.send(yield* category.cfs.update(id, lightInstance));
            }
        },
        delete(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* category.cfs.delete(id));
            }
        },
        get(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* category.cfs.get(id));
            }
        },
        getPaged(pageArg, pageLengthArg){
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* category.cfs.getPaged(page, pageLength));
            }
        },
    };


}