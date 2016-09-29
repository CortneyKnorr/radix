var stack = stack || {};
stack.helpers = stack.helpers || {};
stack.helpers.lastLogLevel = 0;



stack.helpers.iLog = function () {
    stack.helpers.lastLogLevel += 1;
    return stack.helpers;
};

stack.helpers.dLog = function () {
    stack.helpers.lastLogLevel -= 1;
    return stack.helpers;
};

stack.helpers.cLog = function (toBeLogged) {
    stack.helpers.lastLogLevel -= 1;
    stack.helpers.log(toBeLogged, -stack.helpers.lastLogLevel);
    stack.helpers.lastLogLevel = -stack.helpers.lastLogLevel;
    stack.helpers.log();
    return stack.helpers;
};

stack.helpers.aLog = function (toBeLogged) {
    var prefix = stack.globals.WORKER ? (stack.globals.WORKER.id || "") : "";
    console.log(prefix+"\033[96m | ASYNC|-> \033[0m" + toBeLogged);
    return stack.helpers;
};

stack.helpers.log = function (toBeLogged, level) {
    if (level) {
        stack.helpers.lastLogLevel = level;
    }
    var prefix = stack.globals.WORKER ? (stack.globals.WORKER.id || "") : "";
    if (stack.helpers.lastLogLevel > 0) {
        for (let i = 0; i < stack.helpers.lastLogLevel; i++) {
            prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | \033[0m"
        }
    } else {
        for (let i = 0; i < -stack.helpers.lastLogLevel - 1; i++) {
            prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | "
        }
        prefix += "\033[3" + (2-stack.helpers.lastLogLevel < 6 ? 2-stack.helpers.lastLogLevel : 2).toString() + "m |<- ";
        prefix += "\033[3" + (1-stack.helpers.lastLogLevel < 6 ? 1-stack.helpers.lastLogLevel : 2).toString() + "m";
    }
    console.log(prefix + (toBeLogged || "") +"\033[0m");
    return stack.helpers;
};