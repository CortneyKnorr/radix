function stack_logging(helpers){
    helpers.lastLogLevel = 0;

    helpers.iLog = function () {
        helpers.lastLogLevel += 1;
        return helpers;
    };

    helpers.dLog = function () {
        helpers.lastLogLevel -= 1;
        return helpers;
    };

    helpers.cLog = function (toBeLogged) {
        helpers.lastLogLevel -= 1;
        helpers.log(toBeLogged, -helpers.lastLogLevel);
        helpers.lastLogLevel = -helpers.lastLogLevel;
        helpers.log();
        return helpers;
    };

    helpers.aLog = function (toBeLogged) {
        var prefix = stack.globals.WORKER ? (stack.globals.WORKER.id || "") : "";
        console.log(prefix+"\033[96m | ASYNC|-> \033[0m" + toBeLogged);
        return helpers;
    };

    helpers.log = function (toBeLogged, level) {
        if (level) {
            helpers.lastLogLevel = level;
        }
        var prefix = stack.globals.WORKER ? (stack.globals.WORKER.id || "") : "";
        if (helpers.lastLogLevel > 0) {
            for (let i = 0; i < helpers.lastLogLevel; i++) {
                prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | \033[0m"
            }
        } else {
            for (let i = 0; i < -helpers.lastLogLevel - 1; i++) {
                prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | "
            }
            prefix += "\033[3" + (2-helpers.lastLogLevel < 6 ? 2-helpers.lastLogLevel : 2).toString() + "m |<- ";
            prefix += "\033[3" + (1-helpers.lastLogLevel < 6 ? 1-helpers.lastLogLevel : 2).toString() + "m";
        }
        console.log(prefix + (toBeLogged || "") +"\033[0m");
        return helpers;
    };
}