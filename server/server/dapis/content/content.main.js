function stack_dapis_contents() {
    let Contents = getDependency(stack_models_contents);

    let thisDapi = {
        cfs: {
            get: function*(id, populated) {
                return yield (
                    (populated || typeof populated == "undefined") ?
                        Contents.findById(id)
                            .populate("children")
                            .populate("tags")
                            .populate("author") : //true
                        Contents.findById(id)//false
                );
            },
            getPaged: function*(channelArg, page, pageLength) {
                let offset = page * pageLength;
                return yield Contents.find({channel: channelArg}).sort({birthDate: -1}).skip(offset).limit(pageLength)
                    .populate("children")
                    .populate("tags")
                    .populate("author");
            },
            getElement: function*(channelArg, elementArg) {
                return yield Contents.find({channel: channelArg}, elementArg);
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
            getTrashed: function*(channelArg, page, pageLength) {
                return yield (
                    (typeof page == 'number' && pageLength) ?
                        Contents.find({
                            channel: channelArg,
                            obitDate: {$ne: null}
                        }).sort({birthDate: -1}).skip(page * pageLength).limit(pageLength)
                            .populate("children")
                            .populate("tags")
                            .populate("author") : //true
                        Contents.find({channel: channelArg, obitDate: {$ne: null}}).sort({birthDate: -1}) //false
                );
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
                let content = yield Contents.findById(id);
                content.publishDate = Date.now();
                return content.save();
            },
            unpublish: function*(id) {
                let content = yield Contents.findById(id);
                content.publishDate = null;
                return content.save();
            },
            makeIndependent: function*(id) {
                let content = yield Contents.findById(id);
                if (content.hasParent) {
                    let parents = [];
                    for (let parent of yield Contents.find({children: {$ne: null}})) {
                        for (let children of parent.children) {
                            if (children == id) {
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
                let child = new Contents(lightInstance);
                yield child.save();

                let fy = yield mapPromises({
                    child: Contents.findById(child._id).exec(),
                    parent: Contents.findById(parentId).exec()
                });

                fy.child.hasParent = true;
                fy.parent.children.push(fy.child._id);

                fy.child.save();
                fy.parent.save();

                return fy.child;

            },
            bind: function*(parentId, childId) {

                let fy = yield mapPromises({
                    child: Contents.findById(childId).exec(),
                    parent: Contents.findById(parentId).exec()
                });

                fy.child.hasParent = true;
                fy.parent.children.push(fy.child._id);

                fy.child.save();
                fy.parent.save();

                return yield fy.child;
            },

            getInChannel: function*(channel) {
                return yield Contents.find({channel: channel})
                    .populate("children")
                    .populate("tags")
                    .populate("author");
            },

            getIndependentInChannel: function*(channel) {
                return yield Contents.find({channel: channel, hasParent: false})
                    .populate("children")
                    .populate("tags")
                    .populate("author");
            },

            renameChannel: function*(channelArg, newChannel) {
                let elemsInChannel = yield Contents.find({channel: channelArg});
                for (elem of elemsInChannel) {
                    elem.channel = newChannel;
                    elem.save();
                }
                return true;
            },

            updateProperties: function*(id, leanInstance) {
                let content = yield Contents.findById(id);
                if (content) {
                    if (leanInstance) {
                        for (let key in leanInstance) {
                            content.properties.set(parseInt(key), leanInstance[parseInt(key)]);
                        }
                    }
                }
                content.updateDate = Date.now();
                return yield content.save();
            },

            updateProperty: function*(id, propertyArg, stringArg) {
                let element = yield Contents.findById(id);
                element.properties.set([parseInt(propertyArg)], stringArg);
                return yield element.save();
            },

            setChildren: function*(id, childrenId) {
                let parent = yield Contents.findById(id);
                parent.children = parent.children.concat(childrenId);
                parent.save();
                for (let children of childrenId) {
                    let child = yield Contents.findById(children);
                    child.hasParent = true;
                    child.save();
                }
                return parent;
            }
        },
        ehgs: {
            get(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                }
            },
            getPaged(channelArg, pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getPaged(channel, page, pageLength));
                }
            },
            getElement(channelArg, elementArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    let element = stack.dapis.wizards.standards.ehgf13Arg(elementArg, request, false);
                    response.send(yield* thisDapi.cfs.getElement(channel, element));
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
            getTrashed(channelArg, pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let channel = stack.dapis.wizards.standards.ehgf13Arg(channelArg, request, false);
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getTrashed(channel, page, pageLength));
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
            bind(parentIdArg, childIdArg){
                return function*(request, response, next) {
                    let childId = stack.dapis.wizards.standards.ehgf13Arg(childIdArg, request, false);
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    response.send(yield* thisDapi.cfs.bind(parentId, childId));
                }
            },

        }
    };
    return thisDapi;
}