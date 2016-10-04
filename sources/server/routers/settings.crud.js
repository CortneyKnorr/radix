function router_settings() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let settings = stack.dapis.settings.ehgs;

    router.onRoute("/")
        .onGet(settings.getPaged(0, 100))
        .onPost(settings.create(bodyExtractor))
    ;

    router.onRoute("/reset/:identifier")
        .onPut(settings.reset(identifierExtractor));

    router.onRoute("/:identifier")
        .onGet(settings.get(identifierExtractor))
        .onPut(settings.set(identifierExtractor, r => r.body.value))
        .onDelete(settings.delete(identifierExtractor))
    ;

    return router;
}