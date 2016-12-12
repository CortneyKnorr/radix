function* stack_core_express() {
    console.log();
    console.log("|-| Initializing express...");
    console.log(" | ");
    console.time("|-| Express init");
    stack.helpers.log("Importing dependencies", 1).iLog();

    var express = getDependency('express'),
        session = getDependency('express-session'),
        path = getDependency('path'),
        favicon = getDependency('serve-favicon'),
        logger = getDependency('morgan'),
        cookieParser = getDependency('cookie-parser'),
        bodyParser = getDependency('body-parser'),
        MongoStore = getDependency('connect-mongo')(session),
        mongoose = getDependency('mongoose');

    stack.helpers.cLog("Dependencies imported");

    stack.helpers.log("Setting up mongoDB and mongoose").iLog();
    stack.helpers.log("Connection to mongoDB initialized").iLog();
    stack.helpers.log($project.config.mongo.url);
    // Connect to mongoDB
    yield new Promise((res, rej) => {
        mongoose.connect($project.config.mongo.url, {user: $project.config.mongo.user, pass: $project.config.mongo.password}, function (err) {
            if (err) {
                stack.helpers.cLog("Failed to connect MongoDB: " + err);
                rej("Failed to connect MongoDB: " + err);
            } else {
                stack.helpers.cLog("Connected to MongoDB");
                res();
            }
        });
    });
    stack.helpers.log("Injecting ES6 Promises into Mongoose");
    mongoose.Promise = Promise;
    stack.helpers.cLog("MongoDB set up");


    stack.helpers.log("Setting up Express app").iLog();

    stack.helpers.log("Extracting app from global");
    //create app
    var app = stack.globals.expressApp;

    stack.helpers.log("Setting up view Engine");
    // view engine setup
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'pug');


    stack.helpers.log("Setting up default Middleware");
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    if ($project.env.name === 'development' || $project.env.name === 'tests') {
        var prefix = stack.globals.WORKER ? (stack.globals.WORKER.id || "") : "";
        logger.format('stack', prefix + '\033[96m | ASYNC|->\033[0m :remote-addr - :remote-user [:date[clf]] \033[95m":method :url HTTP/:http-version" :status :res[content-length]\033[0m');
        app.use(logger("stack"));
    }

    stack.helpers.log("Setting up redirections");
    $project.redirects = yield* hooks_redirects();
    app.use(function (request, response, next) {
        var keys = Object.keys($project.redirects)
            .filter(element => (new RegExp(element)).test(request.headers.host));
        if(keys.length){
            controlFlowCall($project.redirects[keys[0]].ehg())(request, response, next)
        } else {
            next();
        }
    });


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    stack.helpers.log("Setting up Public Folders");
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));
    app.use('/assets', express.static(path.join(__dirname, './assets')));
    app.use('/uploads', express.static(path.join(__dirname, './uploads')));


    stack.helpers.log("Setting up Express session");
    app.use(session({
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        secret: 'a4f8071f-c873-4447-8ee2',
        proxy: true,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: stack.globals.environment.https}
    }));

    //app and app dependencies
    stack.helpers.log("Setting up Stacks other core Hooks").iLog();
    stack.helpers.log("Loading custom middleware", 3).iLog();

    $project.middleware = hooks_middleware.map(eh => controlFlowCall(eh));
    for (let middleware of $project.middleware) {
        app.use(middleware);
        stack.helpers.log("Added [" + middleware.name + "] to app.");
    }
    stack.helpers.cLog("Middleware loaded");
    stack.globals.mongoose = mongoose;
    stack.helpers.log("Loading authentication", 3);
    yield* stack_core_authentication();
    stack.helpers.log("Adding app models", 3).iLog();
    for (let modelName in hooks_models){
        stack.helpers.log(`Model ${modelName} added`);
        $project.models[modelName] = hooks_models[modelName]();
    }
    stack.helpers.cLog("Models added");
    stack.helpers.log("Loading Stack DAPIs", 3);
    stack.helpers.log("Loading Stack MAPIs", 3);
    stack.helpers.iLog();
    yield* hooks_mapis();
    stack.helpers.lastLogLevel = 4;
    stack.helpers.cLog("Stack MAPIs Loaded");

    //Adding app routers onto app
    stack.helpers.log("Loading app routers", 3).iLog();
    stack.globals.controllers = yield* stack_internal_routers();
    stack_loadRoutersOnto(app, stack.globals.controllers);
    stack.helpers.cLog("Stack routers loaded");

    //Adding projects routers onto app
    stack.helpers.log("Loading app's routers", 3).iLog();
    $project.controllers = yield* hooks_routers();
    stack_loadRoutersOnto(app, $project.controllers);
    stack.helpers.cLog("App routers loaded");

    stack.helpers.log("", 3);

    stack.helpers.log("Loading Stack 404 and error handlers");
    // catch 404 and forward to error handler
    app.use(function (request, response, next) {
        response.statusCode = 404;
        throw "404";
    });
    app.use(
        function (err, request, response, next) {
            request.errors = err;
            if (response.statusCode) {
                if (hooks_catch[response.statusCode.toString()]) {
                    controlFlowCall(hooks_catch[response.statusCode.toString()])(request, response, () => response.send(err))
                } else if (hooks_catch.default) {
                    controlFlowCall(hooks_catch.default)(request, response, () => response.send(err.toString()));
                } else {
                    response.status(500).send(err.toString());
                }
            } else {
                response.statusCode = 500;
                if (hooks_catch.default) {
                    controlFlowCall(hooks_catch.default)(request, response, () => response.send(err.toString()));
                } else {
                    response.send(err.toString());
                }
            }
        }
    );

    stack.helpers.cLog("Stacks Core Hooks called");
    stack.helpers.cLog("Express app configured");

    console.timeEnd("|-| Express init");
    console.log();
    return app;
}