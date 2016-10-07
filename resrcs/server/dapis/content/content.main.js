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
            getInChanel: function*(channel) {

            },
            getIndependentChanel: function*() {

            },
            renameChanel: function*() {

            },
            updateProperties: function*() {

            },
            updateProperty: function*() {

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
        ehgs: {}
    };
    return thisDapi;
}