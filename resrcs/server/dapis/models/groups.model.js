function stack_models_groups(){
    //var users = getDependency(model_users);
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var group = new Schema({
        name: {type: String, required: true},
        members: [{type: Schema.ObjectId, ref: "stack_users"}],
        admins: [{type: Schema.ObjectId, ref: "stack_users"}],
        groupAdmin: [{type: Schema.ObjectId, ref: "stack_users"}],
        rights: {type: Number},
        manageableBy: {type: Number}
    });

    return mongoose.model('stack_groups', group);

}