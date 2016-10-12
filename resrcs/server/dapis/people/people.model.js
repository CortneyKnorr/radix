function stack_models_peoples() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var peoples = new Schema({
        user: {type: Schema.ObjectId, ref: "dapi_user", required: false},
        surname: {type: String},
        firstnames: [{type: String}],
        phone: {type: String},
        mail: {type: String},
        gender: {type: String},
        nationality: {type: String},
        sites: {type: String},
        address: {type: String},
        address2: {type: String},
        postal: {type: String},
        birthDate: {type: Date, default: Date.now},
        obitDate: {type: Date},
        creationDate: {type: Date},
        profilPict: {type: String},
        country: {type: String},
        hobbies: {type: String},
        activity: {type: String},
        friends: [{type: Schema.ObjectId, ref: "dapi_people"}],
        siblings: [{type: Schema.ObjectId, ref: "dapi_people"}],
        spouse: [{type: Schema.ObjectId, ref: "dapi_people"}],
        parents: [{type: Schema.ObjectId, ref: "dapi_people"}],
        children: [{type: Schema.ObjectId, ref: "dapi_people"}]
    });

    return mongoose.model('dapi_people', peoples);
}