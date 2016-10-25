function router_test() {
    var router = new StackRouter();

    router.onRoute("/")
        .onGet(function* (request, response, next) {
            var dummyArray = yield $project.models.dummy.find();
            console.log(dummyArray);
            response.send(dummyArray);
        })
    ;

    return router;
}