/**
 * Created by ressa on 3/10/2016.
 */
function dapi_model_file(){
    var mongoose = getDependency('mongoose'),
        Promise = getDependency('es6-promise').Promise,
        fs = getDependency('fs'),
        multer = getDependency('multer'),
        path = getDependency("path");

    var Schema = mongoose.Schema;

    var model = new Schema({
        name: {type: String, required: true},
        type: {type: String, required: true},
        rights: {type: Number, required: true},
        path: {type: String, required: true},
        filename: {type: String, required: true},
        userId: {type: Schema.ObjectId, ref: "dapi_user"},
        groupId: {type: Schema.ObjectId},
        birthdate: { type : Date, default: Date.now }
    });

    return mongoose.model('File', model);
}