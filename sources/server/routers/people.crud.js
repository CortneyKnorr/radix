function router_people() {
    var router = new StackRouter();

    let identifierExtractor = r => r.params.identifier;

    let peoplesEhgs = stack.dapis.peoples.ehgs;

    router.onRoute("/:identifier")
        .onGet(peoplesEhgs.get(identifierExtractor))
    ;

    return router;
}