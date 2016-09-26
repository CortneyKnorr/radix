
function dapi_model_users(){
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;
    var Hash = require('password-hash');

    var users = new Schema({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, set: function(newValue) {
            return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
        }},
        groups: [{type: Schema.ObjectId, ref: 'dapi_group'}],
        rights: {type: Number, default: 5}
    });

    users.statics.authenticate = function(username, password, callback) {
        if (username == dapi.access.conf.adminUser.login.value &&
            getDependency('sha256')(password) == dapi.access.conf.adminUser.password.value
        ) {
            callback(null, {admin : "true", id: "admin"});
        } else {
            this.findOne({ username: username }).then(user => {
                if (user && Hash.verify(password, user.password)) {
                    callback(null, user);
                } else {
                    callback(null, null);
                }
            }).catch(err => {
                callback(null, null);
            })
        }
    };

    return mongoose.model('dapi_user', users);
}