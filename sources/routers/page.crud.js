function router_page() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let pagesEhgs = stack.project.mapis.page.ehgs;

    router.onRoute("/")
        .onGet(pagesEhgs.getAll())
        .onPost(pagesEhgs.create(bodyExtractor))
    ;

    router.onRoute("/getAllSeasonal/")
        .onGet(pagesEhgs.getAllSeasonal())
    ;

    router.onRoute("/getAllEventMod/")
        .onGet(pagesEhgs.getAllEventMod())
    ;

    router.onRoute("/:identifier")
        .onGet(pagesEhgs.get(identifierExtractor))
        .onPut(pagesEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(pagesEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/makeIndependent/:identifier")
        .onPut(pagesEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/setChildren/:identifier")
        .onPut(pagesEhgs.setChildren(identifierExtractor, r => r.body.childrenId))
    ;

    router.onRoute("/desactivateOrReactivate/:identifier")
        .onPut(pagesEhgs.desactivateOrReactivate(identifierExtractor))
    ;

    return router;
}