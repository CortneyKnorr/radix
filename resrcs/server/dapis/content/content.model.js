function stack_models_contents(){
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var contents = new Schema({
        title: {type: String, required: true},
        content: {type:String},
        channel: {type:String},
        identifier: {type:String},
        tags: [{type: String}],
        properties: [{type: String}],
        rights: {type: Number},
        author: {type: Schema.ObjectId, ref: "stack_users", required: false},
        children: [{type: Schema.ObjectId, ref: "stack_contents"}],
        timestamp: {type: Date, default: Date.now},
        isPublic : {type: Boolean},
        hasParent : {type: Boolean, default: false}
    });

    return mongoose.model('stack_contents', contents);
}