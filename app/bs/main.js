var gulp = require('gulp');


exports.parse = function(arguments){
    const def = require("./default.bsem.js");
    const bsemsInformation = require("../../config/bsem.json");

    let bsems = {def};
    for(let bsem in bsemsInformation){
        bsems[bsem] = require(bsemsInformation[bsem]);
    }
    let mod = {};
    let chain = [];
    for(let bsemIn in bsems){
        let bsem = bsems[bsemIn];
        if(bsem.before) chain.push({length:0, handler: bsem.before, args: []});
        chain = chain.concat(
            extract(arguments, bsem.lex)
        );
        if(bsem.after) chain.push({length:0, handler: bsem.after, args: []});
    }
    chain.forEach(link => link.handler(mod, ...link.args));

    //Taks management
    let tasks = {};
    if(mod.settings.module && bsems[mod.settings.module]){
        for(let taskName in bsems[mod.settings.module].tasks ){
            tasks[taskName] = bsems[mod.settings.module].tasks[taskName];
        }
    } else {
        for(let bsemIn in bsems){
            let bsem = bsems[bsemIn];
            for(let taskName in bsem.tasks ){
                tasks[taskName] = bsem.tasks[taskName];
            }
        }
    }

    tasks.build = [];
    tasks.watch = [];
    tasks.serve = [];
    for(let bsemIn in bsems){
        let bsem = bsems[bsemIn];
        tasks.build = tasks.build.concat(bsem.build || []);
        tasks.watch = tasks.watch.concat(bsem.watch || []);
        tasks.serve = tasks.serve.concat(bsem.serve || []);
    }

    let taskManagement = function(taskName){
        if(tasks[taskName]){
            let task = tasks[taskName];
            if(typeof task == "function"){
                task(mod);
            } else {
                if(task.tasks && task.files){
                    gulp.watch(task.files, function(){
                        taskManagement(task.tasks);
                    });
                } else {
                    for(let dtask of task){
                        taskManagement(dtask);
                    }
                }
            }
        } else {
            console.log("Task "+taskName+" not found!!! Tasks available: ");
            console.log(...Object.keys(tasks));
        }
    }

    console.log("Start point: " + mod.task);
    taskManagement(mod.task);
}

var extract = exports.extract = function(arguments, structure){
    let chain = [];
    for(let key in structure){
        let index = arguments.indexOf(key);
        let length = structure[key].length;
        if(index < arguments.length - length && index > -1){
            structure[key].args = arguments.splice(index+1, length);
            arguments.splice(index,1);
            chain.push(structure[key]);
        }
    }
    return chain;
}
