function exampleRouter(){
    let router = new RadixRouter;
    let serve = radix.dapis.useful.ehgs.quickRender;

    router.onGet("/", serve("example.view.pug"));

    return router;
};
