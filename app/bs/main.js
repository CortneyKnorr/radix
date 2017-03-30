var gulp = require('gulp');

let basicLex = {
    module: {
        length: 1,
        handler: (mod, ...args) => {
            mod.module = args[0];
        }
    },
    task: {
        length: 1,
        handler: (mod, ...args) => {
            mod.task = args[0];
        }
    },
};

exports.parse = function (arguments) {
    const def = require("./default.bsem.js");
    const bsemsInformation = require("../../config/bsem.json");

    let bsems = {default: def};
    for (let bsem in bsemsInformation) {
        bsems[bsem] = require(bsemsInformation[bsem]);
    }

    // Initialising chain of handlers
    let chain = [];

    //Initialising common variable to all handlers
    let mod = {};

    //Creating function to create links per bsem
    let adaptBsem = function (bsemIn, arguments) {
        let bsem = bsems[bsemIn];
        if (bsem.before) chain.push({length: 0, handler: bsem.before, args: []});
        chain = chain.concat(
            extract(arguments, bsem.lex)
        );
        if (bsem.after) chain.push({length: 0, handler: bsem.after, args: []});
    };

    //Extracting and executing basic lex
    let local = extract(arguments, basicLex);
    local.forEach(link => link.handler(mod, ...link.args));

    //Now we have an initial mod variable configure we check if user has limited scope to a specific bsem
    if (mod.module && bsems[mod.module]) {
        adaptBsem(mod.module, arguments);
    } else {
        //Scope not limited so foreach on all possible scopes/modules/bsems
        for (let bsemIn in bsems) {
            adaptBsem(bsemIn, arguments);
        }
    }

    //Execute full chain
    chain.forEach(link => link.handler(mod, ...link.args));

    //Taks management
    let tasks = {};
    if (mod.module && bsems[mod.module]) {
        for (let taskName in bsems[mod.module].tasks) {
            tasks[taskName] = bsems[mod.module].tasks[taskName];
        }
    } else {
        for (let bsemIn in bsems) {
            let bsem = bsems[bsemIn];
            for (let taskName in bsem.tasks) {
                tasks[taskName] = bsem.tasks[taskName];
            }
        }
    }

    tasks.build = [];
    tasks.watch = [];
    tasks.serve = [];
    for (let bsemIn in bsems) {
        let bsem = bsems[bsemIn];
        tasks.build = tasks.build.concat(bsem.build || []);
        tasks.watch = tasks.watch.concat(bsem.watch || []);
        tasks.serve = tasks.serve.concat(bsem.serve || []);
    }

    let taskManagement = function (taskName) {
        if (tasks[taskName]) {
            let task = tasks[taskName];
            if (typeof task == "function") {
                return task(mod)
                    .then(_ => {
                        console.log(taskName + " finished!");
                        console.log();
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("Error " + taskName);
                    })
                    ;
            } else {
                if (task.tasks && task.files) {
                    return new Promise((res, rej) => {
                        gulp.watch(task.files, function () {
                            taskManagement(task.tasks);
                            res();
                        });
                    });
                } else if (task.sequence && task.tasks) {
                    let tsks = task.tasks.map(t => _ => taskManagement(t));
                    let rec = function (prom, index) {
                        index++;
                        if (index < tsks.length) {
                            return prom.then(_ => {
                                rec(tsks[index](), index);
                            }).catch(console.log);
                        }
                    }
                    return rec(tsks[0](), 0);
                } else {
                    return Promise.all(task.map(dtask => taskManagement(dtask)));
                }
            }
        } else {
            console.log("Task " + taskName + " not found!!! Tasks available: ");
            console.log(...Object.keys(tasks));
        }
    };

    if (mod.task) {
        console.log("Start point: " + mod.task);
        let upper = function () {
            try {
                taskManagement(mod.task);
            } catch (e) {
                console.log(e);
                upper();
            }
        };
        upper();
    }
}

var extract = exports.extract = function (arguments, structure) {
    let chain = [];
    for (let key in structure) {
        let index = arguments.indexOf(key);
        let length = structure[key].length;
        if (index < arguments.length - length && index > -1) {
            structure[key].args = arguments.splice(index + 1, length);
            arguments.splice(index, 1);
            chain.push(structure[key]);
        }
    }
    return chain;
};
