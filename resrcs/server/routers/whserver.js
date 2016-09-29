function stack_router_whserver() {
    let router = new StackRouter();
    var cluster = require('cluster');

    router.onGet("/workers", function* (request, response, next) {
        response.send(cluster.workers);
    });

    return router;
}