function* hooks_serializer(user, done) {
    done(null, user.id);
};