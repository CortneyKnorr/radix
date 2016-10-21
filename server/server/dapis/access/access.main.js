function stack_dapis_access() {
    return {
        pehgs: {
            restrictToGroup(groupNameArg, failureRedirectArg) {
                return function*(request, response, next) {
                    let groupName = stack.dapis.wizards.standards.ehgf13Arg(groupNameArg, request, false);
                    let failureRedirect = stack.dapis.wizards.standards.ehgf13Arg(failureRedirectArg, request, false);

                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else if (request.user._id && stack.dapis.groups.cfs.isUserInAGroupNamed(request.user._id, groupNameArg)) {
                            next();
                        } else {
                            response.statusCode = 401;
                            response.redirect(failureRedirect);
                        }
                    } else {
                        response.statusCode = 401;
                        response.redirect(failureRedirect);
                    }
                }
            },
            restrictTo(limitArg, failureRedirectArg) {
                return function*(request, response, next) {
                    let limit = stack.dapis.wizards.standards.ehgf13Arg(limitArg, request, false);
                    let failureRedirect = stack.dapis.wizards.standards.ehgf13Arg(failureRedirectArg, request, false);

                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else if ((yield* stack.dapis.groups.cfs.getUsersBestRights(request.user._id)) <= limit) {
                            next();
                        } else {
                            response.statusCode = 401;
                            response.redirect(failureRedirect);
                        }
                    } else {
                        response.statusCode = 401;
                        response.redirect(failureRedirect);
                    }
                }
            },
            logout() {
                return function*(request, response, next) {
                    request.logout();
                    next();
                }
            },
            login(successRedirect, failureRedirect) {
                return function*(request, response, next) {
                    return getDependency('passport').authenticate('local', {
                        successRedirect: successRedirect,
                        failureRedirect: failureRedirect,
                        failureFlash: true
                    })(request, response, next);
                }
            },
        },
        ehgs: {
            me() {
                return function*(request, response, next) {
                    response.send(request.user || {});
                }
            },
        }
    };
}