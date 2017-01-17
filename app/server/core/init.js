var crashTimer = {};

var $project = {};
$project.models = {};
$project.env = {};
$project.middleware = {};
$project.mapis = {};
$project.mapisList = new Set();

var radix = {};
radix.globals = {};
radix.globals.server = {};
radix.globals.expressApp = {};
radix.globals.redirectServer = {};
radix.globals.environment = {};
radix.globals.mongoose = {};
radix.globals.version = "2.0.0@beta";

radix.dapis = {};
radix.models = {};
radix.classes = {};
radix.helpers = {};
radix.functions = {};
radix.project = {};

exports.init = function init() {
    //Classes
    radix.classes.RadixRouter = RadixRouter;
    radix.classes.Redirect = Redirect;

    //Dapis
    radix.dapis.wizards = stack_dapis_wizards();
    radix.dapis.access = stack_dapis_access();
    radix.dapis.users = stack_dapis_users();
    radix.dapis.groups = stack_dapis_groups();
    radix.dapis.files = stack_dapis_files();
    radix.dapis.mailer = stack_dapis_mailer();
    radix.dapis.useful = stack_dapis_useful();
    radix.dapis.settings = stack_dapis_settings();
    radix.dapis.contents = stack_dapis_contents();
    radix.dapis.e2e = stack_dapis_e2e();

    //Models
    radix.models.users = getDependency(stack_models_users);
    radix.models.groups = getDependency(stack_models_groups);
    radix.models.files = getDependency(stack_models_files);
    radix.models.contents = getDependency(stack_models_contents);
    radix.models.settings = getDependency(stack_models_settings);

    //functions
    radix.functions.controlFlowCall = controlFlowCall;
    radix.functions.mapPromises = mapPromises;
    radix.functions.loadMapi = loadMapi;
    radix.functions.getDependency = getDependency;
    radix.functions.updateDependency = updateDependency;
    radix.functions.isPromise = isPromise;
    radix.functions.loadRoutersOnto = stack_loadRoutersOnto;

    //Libraries
    stack_logging(radix.helpers);

    //Project
    radix.project = $project;

    //Routers: THe object containing them is initialized here but populated later
    radix.routers = {};

    //Project configuration
    $project.config = {
        mongo: getDependency(require('path').join(__dirname, './config/mongo.json'))
    };

    stack_core_environment();
};

