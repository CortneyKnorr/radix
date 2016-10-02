var authSerializer = function (user, done) {
    done(null, user.id);
};

var authDeserializer = function (id, done) {
    var User = getDependency(stack_models_users);
    if(id == "admin"){
        done(null, {admin : "true", id: "admin"})
    } else {
        User.findById(id, function (error, user) {
            done(error, user);
        });
    }
};

function authentication() {
    var User = getDependency(stack_models_users);

    var passport = getDependency('passport');
    var PassportLocalStrategy = getDependency('passport-local');

    var authStrategy = new PassportLocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        User.authenticate(username, password, function(error, user){
            // You can write any kind of message you'd like.
            // The message will be displayed on the next page the user visits.
            // We're currently not displaying any success message for logging in.
            console.log(error);
            done(error, user, error ? { message: error.message } : null);
        });
    });

    passport.use(authStrategy);
    passport.serializeUser(authSerializer);
    passport.deserializeUser(authDeserializer);
    var app = stack.globals.expressApp;
    app.use(getDependency('connect-flash')());
    app.use(passport.initialize());
    app.use(passport.session());
}