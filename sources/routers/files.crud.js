function router_files() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;
    
    router.onAll("/*", stack.dapis.access.pehgs.restrictTo(5, "/"));

    router.onRoute("/")
        .onGet(function (request, response, next) {
        })
        .onPost(
            stack.dapis.files.pehgs.upload(),
            function* (request, response, next){
                response.send(request.peh);
            }
        )
    ;
    router.onRoute("/s")
        .onPost(
            stack.dapis.files.pehgs.secureUpload(r => r.user._id),
            function* (request, response, next){
                response.send(request.peh);
            }
        )
    ;

    router.onRoute("/s/:identifier")
        .onGet(stack.dapis.files.ehgs.serve(identifierExtractor, r => r.user._id))
    ;

    router.onRoute("/pages/:page/:pageLength")
        .onGet(stack.dapis.files.ehgs.getPaged(r => r.params.page, r => r.params.pageLength))
    ;

    router.onRoute("/:identifier")
        .onGet(stack.dapis.files.ehgs.get(identifierExtractor))
        .onPut(stack.dapis.files.ehgs.update(identifierExtractor, bodyExtractor))
        .onDelete(stack.dapis.files.ehgs.delete(identifierExtractor))
    ;

    return router;
}