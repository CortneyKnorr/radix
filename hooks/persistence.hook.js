function* hooks_serializer(user, done) {
    done(null, user.id);
}

function* hooks_deserializer(id, done) {
    let User = $libraries.models.users;
    if(id === "admin"){
        done(null, {admin : "true", id: "admin"})
    } else {
        yield User.findById(id, function (error, user) {
            done(error, user);
        });
    }
}
