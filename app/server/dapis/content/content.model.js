function stack_models_contents() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var contents = new Schema({
        title: {type: String},
        content: {type: String},
        channel: {type: String},
        identifier: {type: String},
        tags: [{type: String, ref:"dapi_content"}],
        properties: [{type: Schema.Types.Mixed}],
        rights: {type: Number},
        author: {type: Schema.ObjectId, ref: "dapi_people", required: false},
        children: [{type: Schema.ObjectId, ref: "dapi_content"}],
        birthDate: {type: Date, default: Date.now},
        publishDate: {type: Date},
        obitDate: {type: Date},
        updateDate: {type: Date},
        hasParent: {type: Boolean, default: false}
    });

    return mongoose.model('dapi_content', contents);
}