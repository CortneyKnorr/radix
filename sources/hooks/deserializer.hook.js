function* hooks_deserializer(id, done) {
    var User = radix.models.users;
    if(id == "admin"){
        done(null, {admin : "true", id: "admin"})
    } else {
        User.findById(id, function (error, user) {
            done(error, user);
        });
    }
};
