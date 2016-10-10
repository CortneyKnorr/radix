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
                return yield content.save();
            },
            delete: function*(contentId) {
                return yield Contents.findByIdAndRemove(contentId);
            },
            update: function*(contentId, leanInstance) {
                let content = yield Contents.findById(contentId);
                if (content) {
                    if (leanInstance.title) content.title = leanInstance.title;
                    if (leanInstance.content) content.content = leanInstance.content;
                    if (leanInstance.channel) content.channel = leanInstance.channel;
                    if (leanInstance.identifier) content.identifier = leanInstance.identifier;
                    if (leanInstance.rights) content.rights = leanInstance.rights;
                    if (leanInstance.tags) content.tags = leanInstance.tags;
                    if (leanInstance.children) content.children = leanInstance.children;
                    if (leanInstance.author) content.author = leanInstance.author;
                    if (leanInstance.birthDate) content.birthDate = leanInstance.birthDate;
                    if (leanInstance.publishDate) content.publishDate = leanInstance.publishDate;
                    if (leanInstance.obitDate) content.obitDate = leanInstance.obitDate;
                    if (leanInstance.hasParent) content.hasParent = leanInstance.hasParent;
                    if (leanInstance.properties) {
                        for (let key in leanInstance.properties) {
                            content.properties[key] = leanInstance.properties[key];
                        }
                    }

                    content.updateDate = Date.now();
                    return yield content.save();
                } else {
                    return {};
                }
            },
            getTrashed: function*() {
                return yield Contents.find({obitDate: {$ne: null}});
            },

            trash: function*(id) {
                let content = yield Contents.findById(id);
                content.obitDate = Date.now();
                return yield content.save();
            },
            untrash: function*(id) {
                let content = yield Contents.findById(id);
                content.obitDate = null;
                return yield content.save();
            },
            publish: function*(id) {
                return yield thisDapi.cfs.update(id, {publishDate: Date.now()})
            },
            unpublish: function*(id) {
                return yield thisDapi.cfs.update(id, {publishDate: null})
            },
            makeIndependent: function*(id) {
                let content = yield Contents.findById(id);
                if (content.hasParent) {
                    let parents = [];
                    for(let parent of yield Contents.find({children: {$ne: null}})){
                        for(let children of parent.children){
                            if(children == id){
                                parents.push(parent)
                            }
                        }
                    }

                    for (let index in parents) {
                        let i = parents[index].children.indexOf(content._id);
                        if (i != -1) {
                            parents[index].children.splice(i, 1);
                            yield parents[index].save();
                        }
                    }
                    content.hasParent = false;
                }
                return yield content.save();

            },
            createAndBind: function*(lightInstance, parentId) {
                let child = yield thisDapi.cfs.create(lightInstance);
                return yield thisDapi.cfs.bind(child_id, parentId);

            },
            bind: function*(childId, parentId) {

                let fy = yield mapPromises({
                    child: Contents.findById(childId).exec(),
                    parent: Contents.findById(parentId).exec()
                });

                fy.child.hasParent = true;
                fy.parent.children.push(fy.child._id);

                fy.child.save();
                fy.parent.save();

                return true;
            },
            getInChannel: function*(channel) {
                return yield Contents.find({channel: channel});
            },
            getIndependentInChannel: function*(channel) {
                return yield Contents.find({channel: channel, hasParent: false});
            },
            renameChannel: function*(channelArg, newChannel) {
                let elemsInChannel = yield Contents.find({channel: channelArg});
                for(elem of elemsInChannel){
                    elem.channel = newChannel;
                    elem.save();
                }
                return true;
            },
            updateProperties: function*(id, leanInstance) {
                return yield thisDapi.cfs.findByIdAndUpdate(id, {properties: leanInstance}, {new: true});
            },
            updateProperty: function*(id, propertyArg, stringArg) {
                let element = yield Contents.findById(id);
                element.properties[propertyArg] = stringArg;
                return yield element.save();
            },
            setChildren: function*(id, childrenId) {
                let parent = yield Contents.findById(id);
                parent.children = parent.children.concat(childrenId);
                parent.save();
                for(children of childrenId){
                    let child = yield Contents.findById(children);
                    child.hasParent = true;
                    child.save();
                }
            }
        },
        ehgs: {
            get(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                }
            },
            getPaged(pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getPaged(page, pageLength));
                }
            },
            create(leanInstanceArg){
                return function*(request, response, next) {
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
            getTrashed(){
                return function*(request, response, next) {
                    response.send(yield* thisDapi.cfs.getTrashed());
                }
            },
            trash(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.trash(id));
                }
            },
            untrash(idArg){
                return function*(request, response, next) {
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
            getInChannel(channelArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    response.send(yield* thisDapi.cfs.getInChannel(channel));
                }
            },
            makeIndependent(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.makeIndependent(id));
                }
            },
            getIndependentInChannel(channelArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    response.send(yield* thisDapi.cfs.getIndependentInChannel(channel));
                }
            },
            renameChannel(channelArg, newChannelArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    let newChannel = stack.dapis.wizards.standards.ehgf13Arg(newChannelArg, request, false);
                    response.send(yield* thisDapi.cfs.renameChannel(channel, newChannel));
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
            updateProperty(idArg, propertyIdArg, stringArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let propertyId = stack.dapis.wizards.standards.ehgf13Arg(propertyIdArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(stringArg, request, false);
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