var hooks_catch = {
    default: function* (request, response, next) {
        console.log(request.errors);
        response.send(request.errors.toString());
    },
    404: function* (request, response, next) {
        response.render("404");
    },
};