function router_access() {
    var router = new StackRouter();

    router.onGet("/logout",
        stack.dapis.access.pehgs.logout(),
        function* (request, response, next){
            response.redirect("/loggedOut");
        }
    );

    router.onGet("/", stack.dapis.access.ehgs.me());
    router.onPost("/", stack.dapis.access.pehgs.login("/", "/?e=asd"));

    return router;
}