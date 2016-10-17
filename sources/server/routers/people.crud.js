function router_people() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let peoplesEhgs = stack.project.mapis.people.ehgs;

    router.onRoute("/")
        .onGet(peoplesEhgs.getAll())
        .onPost(peoplesEhgs.create(bodyExtractor))
    ;

    router.onRoute("/:identifier")
        .onGet(peoplesEhgs.get(identifierExtractor))
        .onPut(peoplesEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(peoplesEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/makeIndependent/:identifier")
        .onPut(peoplesEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/setChildren/:identifier")
        .onPut(peoplesEhgs.setChildren(identifierExtractor, r => r.body.childrenId))
    ;

    router.onRoute("/makeDivorced/:identifier")
        .onPut(peoplesEhgs.makeDivorced(identifierExtractor))
    ;

    router.onRoute("/setSpouse/:identifier")
        .onPut(peoplesEhgs.setSpouse(identifierExtractor, r => r.body.spouseId))
    ;

    router.onRoute("/desactivateOrReactivate/:identifier")
        .onPut(peoplesEhgs.desactivateOrReactivate(identifierExtractor))
    ;

    router.onRoute("/addFriend/:identifier")
        .onPut(peoplesEhgs.addFriend(identifierExtractor, r => r.body.friendId))
    ;

    router.onRoute("/removeFriend/:identifier")
        .onPut(peoplesEhgs.removeFriend(identifierExtractor, r => r.body.friendId))
    ;

    router.onRoute("/addSibling/:identifier")
        .onPut(peoplesEhgs.addSibling(identifierExtractor, r => r.body.siblingId))
    ;

    router.onRoute("/removeSibling/:identifier")
        .onPut(peoplesEhgs.removeSibling(identifierExtractor, r => r.body.siblingId))
    ;

    router.onRoute("/checkMail/:identifier")
        .onGet(peoplesEhgs.checkMail(identifierExtractor))
    ;

    router.onRoute("/createWithUser")
        .onPost(peoplesEhgs.createWithUser(r => r.body.peopleLightInstance, r => r.body.userLightInstance))
    ;

    router.onRoute("/getPeopleOfUser/:identifier")
        .onGet(peoplesEhgs.getPeopleOfUser(identifierExtractor))
    ;

    return router;
}