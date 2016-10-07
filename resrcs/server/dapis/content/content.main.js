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
            getTrashs: function*(){
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
                let content = Contents.findById(id);
            },
            createAndBind: function*(parentId) {

            },
            bind: function*(parentId) {

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
            setChildren: function*() {

            }

        },
        ehgs: {}
    };
    return thisDapi;
}