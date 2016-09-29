function router_test() {
    var router = new StackRouter();

    router.onRoute("/")
        .onGet(function*(request, response, next) {
            request.session.varr = new Date();
            response.send(request.session.varr);
        });

    router.onRoute("/g")
        .onGet(function*(request, response, next) {
            response.send(request.session.varr);
        });

    return router;
}