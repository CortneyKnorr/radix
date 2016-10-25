function router_page() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let pageEhgs = stack.project.mapis.page.page.ehgs;
    let sectionEhgs = stack.project.mapis.page.section.ehgs;

    //Page

    router.onRoute("/page/")
        .onPost(pageEhgs.create(bodyExtractor))
    ;

    router.onRoute("/page/getPaged/")
        .onGet(pageEhgs.getPaged(0, 15))
    ;

    router.onRoute("/page/getAllSeasonal/")
        .onGet(pageEhgs.getAllSeasonal())
    ;

    router.onRoute("/page/getAllEventMod/")
        .onGet(pageEhgs.getAllEventMod())
    ;

    router.onRoute("/page/:identifier")
        .onGet(pageEhgs.get(identifierExtractor))
        .onPut(pageEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(pageEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/page/getSectionsInPage/:identifier")
        .onGet(pageEhgs.getSectionsInPage(identifierExtractor))
    ;

    router.onRoute("/page/trash/:identifier")
        .onPut(pageEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/page/untrash/:identifier")
        .onPut(pageEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/page/updateProperties/:identifier")
        .onPut(pageEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/page/updateProperty/:identifier")
        .onPut(pageEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/page/addChildren/:identifier")
        .onPut(pageEhgs.addChildren(identifierExtractor, r => r.body.childrenIdArg))
    ;

    router.onRoute("/page/makeIndependent/:identifier")
        .onPut(pageEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/page/bind/:identifier")
        .onPut(pageEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(pageEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/page/clearChildren/:identifier")
        .onPut(pageEhgs.clearChildren(identifierExtractor))
    ;

    router.onRoute("/page/removeChild/:identifier")
        .onPut(pageEhgs.removeChild(identifierExtractor, r => r.body.childIdArg))
    ;

    //Section

    router.onRoute("/section/getPaged")
        .onPut(sectionEhgs.getPaged(r => r.body.pageArg, r => r.body.pageLengthArg))
    ;

    router.onRoute("/section/")
        .onPost(sectionEhgs.create(bodyExtractor))
    ;

    router.onRoute("/section/:identifier")
        .onGet(sectionEhgs.get(identifierExtractor))
        .onPut(sectionEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(sectionEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/section/trash/:identifier")
        .onPut(sectionEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/section/untrash/:identifier")
        .onPut(sectionEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/section/updateProperties/:identifier")
        .onPut(sectionEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/section/updateProperty/:identifier")
        .onPut(sectionEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/section/addChildren/:identifier")
        .onPut(sectionEhgs.addChildren(identifierExtractor, r => r.body.childrenIdArg))
    ;

    router.onRoute("/section/bind/:identifier")
        .onPut(sectionEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(sectionEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/section/clearChildren/:identifier")
        .onPut(sectionEhgs.clearChildren(identifierExtractor))
    ;

    router.onRoute("/section/removeChild/:identifier")
        .onPut(sectionEhgs.removeChild(identifierExtractor, r => r.body.childIdArg))
    ;

    router.onRoute("/section/setPosition/:identifier")
        .onPut(sectionEhgs.setPosition(identifierExtractor, r => r.body.positionArg))
    ;

    router.onRoute("/section/setAlign/:identifier")
        .onPut(sectionEhgs.setAlign(identifierExtractor, r => r.body.alignArg))
    ;

    router.onRoute("/section/addSectionToPage/:identifier")
        .onPut(sectionEhgs.addSectionToPage(identifierExtractor, r => r.body.pageIdArg))
    ;

    router.onRoute("/section/getParents/:identifier")
        .onGet(sectionEhgs.getParents(identifierExtractor))
    ;

    return router;
}