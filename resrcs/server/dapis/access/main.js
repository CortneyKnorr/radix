function stack_dapis_access() {
    return {
        pehgs: {
            restrictTo(limitArg, failureRedirectArg) {
                return function* (request, response, next) {
                    let limit = stack.dapis.wizards.standards.ehgf13Arg(limitArg, request, false);
                    let failureRedirect = stack.dapis.wizards.standards.ehgf13Arg(failureRedirectArg, request, false);
                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else {
                            dapi.access.users.getBestRights(request.user._id).then(rights => {
                                if (rights <= limit) {
                                    next();
                                } else {
                                    response.statusCode = 403;
                                    response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
                                }
                            }).catch(err => {
                                response.statusCode = 401;
                                response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
                            })
                        }
                    } else {
                        response.statusCode = 401;
                        response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
                    }
                }
            },
            logout() {
                return function* (request, response, next) {
                    request.logout();
                    next();
                }
            },
            login(successRedirect, failureRedirect) {
                return getDependency('passport').authenticate('local', {
                    successRedirect: successRedirect || dapi.access.conf.successRedirect.value,
                    failureRedirect: failureRedirect || dapi.access.conf.failureRedirect.value,
                    failureFlash: true
                })
            },
        },
        ehgs: {
            me() {
                return function* (request, response, next) {
                    response.send(request.user || {});
                }
            },
        }
    };
}