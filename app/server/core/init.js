var $project = {};
$project.models = {};
$project.env = {};
$project.middleware = {};
$project.mapis = {};
$project.mapisList = new Set();

var stack = {};
stack.globals = {};
stack.globals.server = {};
stack.globals.expressApp = {};
stack.globals.redirectServer = {};
stack.globals.environment = {};
stack.globals.mongoose = {};
stack.globals.version = "2.0.0@beta";

stack.dapis = {};
stack.models = {};
stack.classes = {};
stack.helpers = {};
stack.functions = {};
stack.project = {};

exports.init = function init() {
    //Classes
    stack.classes.StackRouter = StackRouter;
    stack.classes.Redirect = Redirect;

    //Dapis
    stack.dapis.wizards = stack_dapis_wizards();
    stack.dapis.access = stack_dapis_access();
    stack.dapis.users = stack_dapis_users();
    stack.dapis.groups = stack_dapis_groups();
    stack.dapis.files = stack_dapis_files();
    stack.dapis.mailer = stack_dapis_mailer();
    stack.dapis.useful = stack_dapis_useful();
    stack.dapis.settings = stack_dapis_settings();
    stack.dapis.contents = stack_dapis_contents();
    stack.dapis.e2e = stack_dapis_e2e();

    //Models
    stack.models.users = getDependency(stack_models_users);
    stack.models.groups = getDependency(stack_models_groups);
    stack.models.files = getDependency(stack_models_files);
    stack.models.contents = getDependency(stack_models_contents);
    stack.models.settings = getDependency(stack_models_settings);

    //functions
    stack.functions.controlFlowCall = controlFlowCall;
    stack.functions.mapPromises = mapPromises;
    stack.functions.loadMapi = loadMapi;
    stack.functions.getDependency = getDependency;
    stack.functions.updateDependency = updateDependency;
    stack.functions.isPromise = isPromise;
    stack.functions.loadRoutersOnto = stack_loadRoutersOnto;

    //Libraries
    stack_logging(stack.helpers);

    //Project
    stack.project = $project;

    //Routers: THe object containing them is initialized here but populated later
    stack.routers = {};

    //Project configuration
    $project.config = {
        mongo: getDependency(require('path').join(__dirname, './config/mongo.json'))
    };

    stack_core_environment();
};

