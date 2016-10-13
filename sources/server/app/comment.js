function loadCommentContent() {
    comment = {};
    comment.dapi = getDependency(stack_dapis_contents);
    comment.channel = "comment";

    comment.properties = {
        LIKES: 0,
        DISLIKES: 1,
    };

    comment.cfs = {
        create: function*(lightInstance) {
            lightInstance.channel = comment.channel;
            return yield* comment.dapi.cfs.create(lightInstance);
        },

        update: function*(id, lightInstance) {
            return yield* comment.dapi.cfs.update(id, lightInstance);
        },

        delete: function*(id) {
            return yield* comment.dapi.cfs.delete(id);
        },

        get: function*(id) {
            return yield* comment.dapi.cfs.get(id);
        },

        getPaged: function*(page, pageLength) {
            return yield* comment.dapi.cfs.getPaged(comment.channel, page, pageLength);
        },

        addChildren: function*(id, childrenListId){
            return yield* comment.dapi.cfs.setChildren(id, childrenListId)
        },
        makeLike: function*(commentId, peopleId){
            let comment = yield comment.dapi.cfs.get(commentId);

            for(let i = 0; i < comment.properties.DISLIKES; i++){
                if(comment.properties.DISLIKES[i] == peopleId){
                    comment.properties.DISLIKES.split(i, 1);
                }
            }
            comment.properties.LIKES.push(peopleId);
        },

        makeDislike: function*(commentId, peopleId){
            let comment = yield comment.dapi.cfs.get(commentId);

            for(let i = 0; i < comment.properties.LIKES; i++){
                if(comment.properties.LIKES[i] == peopleId){
                    comment.properties.LIKES.split(i, 1);
                }
            }
            comment.properties.DISLIKES.push(peopleId);
        },
    };

    comment.ehgs = {

        create(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* comment.cfs.create(id));
            }
        },
        update(idArg, lightInstanceArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                let lightInstance = stack.dapis.wizards.standards.ehgf13Arg(lightInstanceArg, request, false);
                response.send(yield* comment.cfs.update(id, lightInstance));
            }
        },
        delete(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* comment.cfs.delete(id));
            }
        },
        get(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* comment.cfs.get(id));
            }
        },
        getPaged(pageArg, pageLengthArg){
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* comment.cfs.getPaged(page, pageLength));
            }
        },
        addChildren(idArg, childrenListIdArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                let childrenListId = stack.dapis.wizards.standards.ehgf13Arg(childrenListIdArg, request, false);
                response.send(yield* comment.cfs.addChildren(id, childrenListId));
            }
        },
        makeLike(commentIdArg, peopleIdArg){
            return function*(request, response, next) {
                let commentId = stack.dapis.wizards.standards.ehgf13Arg(commentIdArg, request, false);
                let peopleId = stack.dapis.wizards.standards.ehgf13Arg(peopleIdArg, request, false);
                response.send(yield* comment.cfs.makeLike(commentId, peopleId));
            }
        },
        makeDislike(commentIdArg, peopleIdArg){
            return function*(request, response, next) {
                let commentId = stack.dapis.wizards.standards.ehgf13Arg(commentIdArg, request, false);
                let peopleId = stack.dapis.wizards.standards.ehgf13Arg(peopleIdArg, request, false);
                response.send(yield* comment.cfs.makeDislike(commentId, peopleId));
            }
        },
    };
}