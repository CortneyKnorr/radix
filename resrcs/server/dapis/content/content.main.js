function stack_dapis_content() {
    let Contents = getDependency(stack_models_contents);
    let thisDapi = {
        cfs: {
            create: function*(leanInstance) {
                return yield (new Contents(leanInstance)).save();
            },
            delete: function*(id) {
                return yield Contents.findByIdAndRemove(id);
            },
            get: function*(id) {
                return yield Contents.findById(id).populate([
                    {path: 'children', select: ''},
                    {path: 'author', select: ''}
                ]);
            },
            getChildren: function*(id) {
                var content = yield Contents.findById(id, "children").populate('children');
                return content.children;
            },
            getPublic: function*(channel) {
                return yield Contents.find(channel ? {isPublic: true, channel: channel} : {isPublic: true}).populate([{
                    path: 'children',
                    select: ''
                }, {path: 'author', select: 'username'}]);
            }
        }
    };
    return thisDapi;
}