function router_contents() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let contentsEhgs = stack.dapis.contents.ehgs;

    router.onRoute("/")
        .onGet(contentsEhgs.getPaged(0, 5))
        .onPost(contentsEhgs.create(bodyExtractor))
    ;

    router.onRoute("/:identifier")
        .onDelete(contentsEhgs.delete(identifierExtractor))
        .onGet(contentsEhgs.get(identifierExtractor))
    ;

    router.onRoute("/trash/:identifier")
        .onPut(contentsEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/untrash/:identifier")
        .onPut(contentsEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/trashs")
        .onPut(contentsEhgs.getTrashed())
    ;
    return router;
}