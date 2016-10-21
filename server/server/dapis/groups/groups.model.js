function stack_models_groups() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;
    var id = Schema.ObjectId;

    var myShema = new Schema({
        //Strings
        name: {type: String},

        //Numbers
        rights: {type: Number},

        //booleans
        enabled: {type: Boolean},
        power: {type: Boolean},

        //arrays
        users: [{type: id, ref: "stack_users"}],
        admins: [{type: id, ref: "stack_users"}],

    });

    return mongoose.model('stack_groups', myShema);
}