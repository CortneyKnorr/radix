var hooks_catch = {
    default: function* (request, response, next) {
        console.log(request.errors);
        response.send(request.errors.toString());
    }
};