var dapi = dapi || {};
dapi.useful = dapi.useful || {};
dapi.useful.interface = {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.useful.ehParseJSON = function (array) {
    var realArray = array || "body";
    return function(request, response, next){
        for(var index in request[realArray]) {
            try {
                request[realArray][index] = JSON.parse(request[realArray][index])
            } catch (e) {
                request[realArray][index] = e;
            }
        }
        next();
    };
};

dapi.useful.ehQuickRender = function (page) {
    return function(request, response, next){
        response.render(page, {user: request.user || false, page: page});
    }
};

dapi.useful.ehPlug = function (message) {
    return function(request, response, next){
        response.send(message);
    }
};

dapi.useful.ehSetHeader = function (field, value) {
    return function(request, response, next){
        response.set(field, value);
        next();
    }
};

dapi.useful.ehFieldsExist = function (fieldArray, requestArrayName) {
    return function (request, response, next) {
        var errors = [];
        var type = requestArrayName || "body";
        for (let field of fieldArray) {
            if (!request[type][field]) {
                errors.push(`${field} does not exists in request.${type}`);
            }
        }
        if (!errors.length) {
            next();
        }
        else {
            response.status(400);
            response.send(errors);
        }
    }
};

dapi.useful.helperEhgfParams = function (element, request, defaultValue) {
    return (typeof element == "function" ? element(request) : element) || defaultValue || 0;
};

stack.dapis.useful = dapi.useful;