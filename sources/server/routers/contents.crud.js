function router_contents() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let contentsEhgs = stack.dapis.contents.ehgs;

    router.onRoute("/")
        .onPost(contentsEhgs.create(bodyExtractor))
    ;

    router.onRoute("/:identifier")
        .onGet(contentsEhgs.get(identifierExtractor))
    ;

    router.onRoute("/")
        .onGet(contentsEhgs.getPaged(3,3));


    return router;
}