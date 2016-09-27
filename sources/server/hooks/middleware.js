var hooks_middleware = [
    function poweredBy(request, response, next) {
        response.setHeader("x-powered-by", "KVM Stack");
        next();
    }
];