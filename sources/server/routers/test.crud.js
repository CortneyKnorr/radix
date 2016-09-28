function router_test() {
    var router = new StackRouter();

    router.onRoute("/")
        .onGet(function*(request, response, next) {
            response.send(yield project.models.dummy.find());
        })
        .onPost(function*(request, response, next) {
            let myDummy = new project.models.dummy({title: Date.now().toString()});
            let results = yield Promise.all([myDummy.save(), myDummy.save()]);
            response.send(results);
        })
    ;

    return router;
}