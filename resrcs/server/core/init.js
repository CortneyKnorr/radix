var project = {};
project.models = {};
project.env = {};
project.middleware = {};

var stack = {};
stack.globals = {};
stack.globals.server = {};
stack.globals.expressApp = {};
stack.globals.redirectServer = {};
stack.globals.environment = {};
stack.globals.mongoose = {};
stack.globals.version = "1.0.0";
stack.mapis = {};
stack.dapis = {};
stack.models = {};
stack.core = {};

exports.init = function init(envData) {
    console.log();

    console.time('|-| Prepared');

    console.log("|-| Preparing project environment...");
    console.log(" | ");

    console.log(" | Fetching configuration data for [" + process.env.NODE_ENV + "] environment...");
    let env = require('../config/env.json');
    let node_env = process.env.NODE_ENV || 'development';

    if (env[node_env]) {
        project.env.data = env[node_env];
        project.env.name = node_env;
    } else {
        project.env.data = env['development'];
        project.env.name = 'development';
    }

    console.log(" |  | Data for [" + project.env.name + "] environment fetched.");
    console.log(" |  | Description: " + project.env.data.description);
    console.log(" |<- Fetched");
    console.log(" |");

    console.timeEnd('|-| Prepared');
    console.log();
    stack_requirements();
};

