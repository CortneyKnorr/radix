function router_contents() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let contentsEhgs = stack.dapis.contents.ehgs;


    router.onRoute("/")
        .onGet(contentsEhgs.getPaged(0, 15))
        .onPost(contentsEhgs.create(bodyExtractor))
    ;

    router.onRoute("/trashs")
        .onGet(contentsEhgs.getTrashed())
    ;

    router.onRoute("/trash/:identifier")
        .onPut(contentsEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/untrash/:identifier")
        .onPut(contentsEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/bind/:identifier")
        .onPut(contentsEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(contentsEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/makeIndependent/:identifier")
        .onPut(contentsEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/setChildren/:identifier")
        .onPut(
            stack.dapis.useful.pehgs.parseJson(),
            contentsEhgs.setChildren(identifierExtractor, r => r.body.childrenId))
    ;

    router.onRoute("/channel/:identifier")
        .onGet(contentsEhgs.getInChannel(identifierExtractor))
    ;

    router.onRoute("/independentInChannel/:identifier")
        .onGet(contentsEhgs.getIndependentInChannel(identifierExtractor))
    ;

    router.onRoute("/channel/rename")
        .onPut(contentsEhgs.renameChannel(r => r.body.channelArg, r => r.body.newChannelArg))
    ;

    router.onRoute("/:identifier")
        .onDelete(contentsEhgs.delete(identifierExtractor))
        .onGet(contentsEhgs.get(identifierExtractor))
    ;

    router.onRoute("/publish/:identifier")
        .onPut(contentsEhgs.publish(identifierExtractor))
    ;

    router.onRoute("/unpublish/:identifier")
        .onPut(contentsEhgs.unpublish(identifierExtractor))
    ;

    router.onRoute("/property/:identifier")
        .onPut(contentsEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;


    return router;
}