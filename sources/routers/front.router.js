function frontRouter(){
    let router = new StackRouter();

    const render = stack.dapis.useful.ehgs.quickRender;

    router.onRoute("/")
        .onGet(render("home"))
        .onPost(
            stack.dapis.files.pehgs.upload(),
            function*(request, response, next) {
                response.send(request.peh);
            }
        );

    return router;
}