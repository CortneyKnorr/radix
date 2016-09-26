function model_dummy() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var myShema = new Schema({
        title: {type: String, required: true}
    });

    return mongoose.model('dummy', myShema);
}