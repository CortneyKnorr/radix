function* stack_authentication() {

    var passport = getDependency('passport');

    stack.helpers.log("Loading strategy");
    var authStrategy = yield* hooks_strategy();

    passport.use(authStrategy);
    passport.serializeUser(controlFlowCall(hooks_serializer));
    passport.deserializeUser(controlFlowCall(hooks_deserializer));
    var app = stack.globals.expressApp;
    app.use(getDependency('connect-flash')());
    app.use(passport.initialize());
    app.use(passport.session());
}