function loadTagContent() {
    tag = {};
    tag.dapi = getDependency(stack_dapis_contents);
    tag.channel = "tag";


    tag.cfs = {
        create: function*(lightInstance) {
            lightInstance.channel = tag.channel;
            return yield* tag.dapi.cfs.create(lightInstance);
        },

        update: function*(id, lightInstance) {
            return yield* tag.dapi.cfs.update(id, lightInstance);
        },

        delete: function*(id) {
            return yield* tag.dapi.cfs.delete(id);
        },

        get: function*(id) {
            return yield* tag.dapi.cfs.get(id);
        },

        getPaged: function*(page, pageLength) {
            return yield* tag.dapi.cfs.getPaged(tag.channel, page, pageLength);
        },
    }
    ;

    tag.ehgs = {

        create(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* tag.cfs.create(id));
            }
        },
        update(idArg, lightInstanceArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                let lightInstance = stack.dapis.wizards.standards.ehgf13Arg(lightInstanceArg, request, false);
                response.send(yield* tag.cfs.update(id, lightInstance));
            }
        },
        delete(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* tag.cfs.delete(id));
            }
        },
        get(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* tag.cfs.get(id));
            }
        },
        getPaged(pageArg, pageLengthArg){
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* tag.cfs.getPaged(page, pageLength));
            }
        },
    };

}