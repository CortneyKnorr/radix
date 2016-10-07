function stack_dapis_contents() {
    let Contents = getDependency(stack_models_contents);

    let thisDapi = {
        cfs: {
            get: function*(id) {
                return yield Contents.findById(id);
            },
            getPaged: function*(page, pageLength) {
                let offset = page * pageLength;
                return yield Contents.find().skip(offset).limit(pageLength);
            },
            create: function*(lightInstance) {
                let content = new Contents(lightInstance);
                return content.save();
            },
            delete: function*(contentId) {
                return yield Contents.findByIdAndRemove(contentId);
            },
            update: function*(contentId, leanInstance) {
                let content = yield Contents.findById(contentId);
                if (content) {
                    content.updateDate = Date.now;
                    return yield content.save();
                } else {
                    return {};
                }
            },
            getTrashs: function*() {
                return yield Contents.find({obitDate: {$ne: null}});
            },

            trash: function*(id) {
                return yield thisDapi.cfs.update(id, {obitDate: Date.now})
            },
            untrash: function*(id) {
                return yield thisDapi.cfs.update(id, {obitDate: null})
            },
            publish: function*(id) {
                return yield thisDapi.cfs.update(id, {publishDate: Date.now})
            },
            unpublish: function*(id) {
                return yield thisDapi.cfs.update(id, {publishDate: null})
            },
            makeIndependent: function*(id) {
                let content = yield Contents.findById(id);
                if (content.hasParent) {

                    let parents = yield Contents.find({children: {$in: content._id}});
                    for (let index in parents) {
                        let i = parents[index].children.indexOf(content._id);
                        if (i != -1) {
                            parents[index].children.splice(i, 1);
                            yield parents[index].save();
                        }
                    }
                    content.hasParent = false;
                }
                ;
                return yield content.save();

            },
            createAndBind: function*(lightInstance, parentId) {
                let child = yield thisDapi.cfs.create(lightInstance);
                return yield thisDapi.cfs.bind(child_id, parentId);

            },
            bind: function*(childId, parentId) {

                let fy = yield mapPromises({
                    child: thisDapi.cfs.get(childId).exec(),
                    parent: thisDapi.cfs.get(parentId).exec()
                });

                fy.child.hasParent = true;
                fy.parent.children.push(fy.child._id);

                return yield mapPromises({
                    child: fy.child.save().exec(),
                    parent: fy.parent.save().exec()
                })
            },
            getInChannel: function*(channel) {
                return yield Contents.find({channel: channel});
            },
            getIndependentInChannel: function*(channel) {
                return yield Contents.find({channel: channel, hasParent: false});
            },
            renameChannel: function*(channelArg, newChannel) {
                let channel = yield Contents.find({channel: channelArg});
                if (channel) {
                    channel.channel = newChannel;
                    return yield channel.save();
                } else {
                    return {};
                }
            },
            updateProperties: function*(id, leanInstance) {
                return yield thisDapi.cfs.update(id, {properties: leanInstance});
            },
            updateProperty: function*(id, propertyArg, leanInstance) {
                let element = yield Contents.find(id);
                element.properties = leanInstance;


            },
            setChildren: function*(id, childrenId) {
                let fy = yield mapPromises({
                    children: Contents.find({_id: {$all: childrenId}}).exec(),
                    parent: thisDapi.cfs.get(id).exec()
                });

                for (let index in fy.children) {
                    parent.children.push(children[index]._id);
                    fy.children[index].hasParent = true;
                }
                yield parent.save();

                return yield fy.children.map(child => {
                    child.save();
                });

            }

        },
        ehgs: {
            get(idArg){
                return function*(request, response, next){
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                }
            },
            getPaged(pageArg, pageLengthArg){
                return function*(request, response, next){
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getPaged(page, pageLength));
                }
            },
            create(leanInstanceArg){
                return function*(request, response, next){
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.create(leanInstance));
                }
            },
            delete(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let deletedFile = yield* thisDapi.cfs.delete(id);
                    response.send(deletedFile);
                }
            },
            update(idArg, leanInstanceArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.update(id, leanInstance));
                }
            },
            getTrashs(){
                return function*(request, response, next) {
                    response.send(yield* thisDapi.cfs.getTrashs());
                }
            },
            trash(idArg){
                return function*(request, response, next){
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.trash(id));
                }
            },
            untrash(idArg){
                return function*(request, response, next){
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.untrash(id));
                }
            },
            createAndBind(leanInstanceArg, parentIdArg){
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    response.send(yield* thisDapi.cfs.createAndBind(leanInstance, parentId));
                }
            },
            getInChannel(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.getInChannel(id));
                }
            },
            makeIndependent(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.makeIndependent(id));
                }
            },
            getIndependentInChannel(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.getIndependentInChannel(id));
                }
            },
            renameChannel(idArg, newIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let newId = stack.dapis.wizards.standards.ehgf13Arg(newIdArg, request, false);
                    response.send(yield* thisDapi.cfs.renameChannel(id, newId));
                }
            },
            publish(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.publish(id));
                }
            },
            unpublish(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.unpublish(id));
                }
            },
            updateProperties(idArg, leanInstanceArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.updateProperties(id, leanInstance));
                }
            },
            updateProperty(idArg, propertyIdArg, leanInstanceArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let propertyId = stack.dapis.wizards.standards.ehgf13Arg(propertyIdArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.updateProperty(id, propertyId, leanInstance));
                }
            },
            setChildren(idArg, childrenIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let childrenId = stack.dapis.wizards.standards.ehgf13Arg(childrenIdArg, request, false);
                    response.send(yield* thisDapi.cfs.setChildren(id, childrenId));
                }
            },
            bind(childIdArg, parentIdArg){
                return function*(request, response, next) {
                    let childId = stack.dapis.wizards.standards.ehgf13Arg(childIdArg, request, false);
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    response.send(yield* thisDapi.cfs.bind(childId, parentId));
                }
            },

        }
    };
    return thisDapi;
}