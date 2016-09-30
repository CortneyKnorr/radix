function router_users() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    router.onRoute("/")
        .onGet(function (request, response, next) {

        })
        .onPost(stack.dapis.users.ehgs.create(bodyExtractor))
    ;

    router.onRoute("/:identifier")
        .onGet(stack.dapis.users.ehgs.get(identifierExtractor))
        .onPut(stack.dapis.users.ehgs.update(identifierExtractor, bodyExtractor))
        .onDelete(stack.dapis.users.ehgs.remove(identifierExtractor))
    ;

    return router;
}