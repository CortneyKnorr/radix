function stack_models_settings() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var myShema = new Schema({
        category: {type: String},
        key: {type: String},
        value: {type: String},
        default: {type: String},
    });

    return mongoose.model('stack_settings', myShema);
}