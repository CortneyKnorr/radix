function stack_dapis_useful() {
    let thisDapi = {
        ehgs: {
            quickRender(pageArg){
                return function*(request, response, next) {
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    response.render(page, {user: request.user || false, page: page});
                }
            },
            plug(messageArg){
                return function*(request, response, next) {
                    let message = stack.dapis.wizards.standards.ehgf13Arg(messageArg, request, false);
                    response.send(message);
                }
            }
        },
        pehgs: {
            parseJson(arrayArg){
                return function*(request, response, next) {
                    let array = stack.dapis.wizards.standards.ehgf13Arg(arrayArg, request, "body");
                    for (var index in request[array]) {
                        try {
                            request[array][index] = JSON.parse(request[array][index])
                        } catch (e) {
                            response.statusCode = 500;
                            throw e;
                        }
                    }
                    next();
                }
            },
            setHeader(fieldArg, valueArg){
                return function* (request, response, next) {
                    let field = stack.dapis.wizards.standards.ehgf13Arg(fieldArg, request, false);
                    let value = stack.dapis.wizards.standards.ehgf13Arg(valueArg, request, false);
                    response.set(field, value);
                    next();
                }
            }
        }
    };
    return thisDapi;
}