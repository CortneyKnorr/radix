/**
 * Created by Kiran on 3/9/2016.
 */

function dapi_model_groups(){
    //var users = getDependency(model_users);
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var group = new Schema({
        name: {type: String, required: true},
        members: [{type: Schema.ObjectId, ref: "dapi_user"}],
        admins: [{type: Schema.ObjectId, ref: "dapi_user"}],
        groupAdmin: [{type: Schema.ObjectId, ref: "dapi_user"}],
        rights: {type: Number},
        manageableBy: {type: Number}
    });

    return mongoose.model('dapi_group', group);

}