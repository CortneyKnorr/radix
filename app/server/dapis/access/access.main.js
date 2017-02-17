function radix_dapis_access() {
    return {
        pehgs: {
            lock(groupsArg){
                return function*(request, response, next) {
                    let groups = radix.dapis.wizards.standards.ehgf13Arg(groupsArg, request, false);

                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else if (request.user._id && groups && typeof groups.map == "function") {
                            let groupRights = yield groups.map(group => {
                                return yield* radix.dapis.groups.fcs.isUserInAGroupNamed(request.user._id, group)
                            });
                            if (groupRights.filter(b => b).length) {
                                next();
                            } else {
                                response.statusCode = 401;
                                next(401);
                            }
                        } else {
                            response.statusCode = 401;
                            next(401);
                        }
                    } else {
                        response.statusCode = 401;
                        next(401);
                    }
                }
            },
            restrictToGroup(groupNameArg, failureRedirectArg) {
                return function*(request, response, next) {
                    let groupName = radix.dapis.wizards.standards.ehgf13Arg(groupNameArg, request, false);
                    let failureRedirect = radix.dapis.wizards.standards.ehgf13Arg(failureRedirectArg, request, false);

                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else if (request.user._id && (yield* radix.dapis.groups.fcs.isUserInAGroupNamed(request.user._id, groupNameArg))) {
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
                    let limit = radix.dapis.wizards.standards.ehgf13Arg(limitArg, request, false);
                    let failureRedirect = radix.dapis.wizards.standards.ehgf13Arg(failureRedirectArg, request, false);

                    if (request.user) {
                        if (request.user.admin || !(limit || limit === 0)) {
                            next();
                        } else if ((yield* radix.dapis.groups.fcs.getUsersBestRights(request.user._id)) <= limit) {
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
