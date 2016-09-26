var dapi = dapi || {};
dapi.access = dapi.access || {};
dapi.access.conf = getDependency('../config/dapi/access.json');
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.access.users = {};
dapi.access.users.create = function (username, password, rights) {
    var Users = getDependency(dapi_model_users);
    var sha = getDependency("sha256");
    return new Promise(function (topResolve, topReject) {
        Users.count({username: username}, function (err, nbr) {
            if (err)
                topReject(err);
            else if (nbr == 0 && username != "") {
                var myUser = new Users();
                myUser.username = username;
                myUser.password = password;
                myUser.rights = rights;

                myUser.save(function (err) {
                    if (err)
                        topReject(err);
                    else
                        topResolve(myUser);
                });
            } else {
                topReject('User with same username already exist');
            }
        });
    });
};
dapi.access.users.get = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId);
};
dapi.access.users.getWithoutPassword = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId, "-password");
};
dapi.access.users.getAllByRights = function (rightsArg) {
    var Users = getDependency(dapi_model_users);
    return Users.find({"rights": rightsArg}, "-password");
};
dapi.access.users.getGroups = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId, 'groups');
};
dapi.access.users.exists = function (userId) {
    var Users = getDependency(dapi_model_users);
    return new Promise(function (resolve, reject) {
        Users.count({_id: userId}, function (err, count) {
            resolve(count > 0)
        });
    });
};
dapi.access.users.addToGroup = function (groupId, userId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (topResolve, topReject) {
        dapi.access.groups.exists(groupId).then(function (data) {
            if (data) {
                return dapi.access.users.exists(userId);
            }
            else {
                throw "Group does not exist";
            }
        }).then(userExists => {
            if (userExists) {
                return dapi.access.users.getGroups(userId, false)
            } else {
                throw "User does not exist";
            }
        }).then(data => {
            if (data.groups.indexOf(groupId) == -1) {
                return Users.findByIdAndUpdate(userId, {$push: {groups: groupId}});
            }
            else {
                return "pass"
            }
        }).then(data => {
            return dapi.access.groups.get(groupId, false)
        }).then(data => {
            if (data.members.indexOf(userId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {members: userId}}, function (err) {
                    if (err) {
                        topReject(err);
                    } else {
                        topResolve("All good");
                    }
                });
            }
            else {
                topResolve("All good");
            }
        }).catch(data => {
            topReject(data);
        });
    });
};
dapi.access.users.getBestRights = function (userId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    var groupRights = [];
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.getGroups(userId).then(data => {
            var myPromises = [];
            for (var groupId of data.groups) {
                (function (id) {
                    myPromises.push(new Promise(function (resolve, reject) {
                        Groups.findById(id, 'rights', function (err, group) {
                            resolve(group.rights);
                        })
                    }))
                })(groupId)
            }
            Promise.all(myPromises).then(data => {
                groupRights = data;
                return dapi.access.users.get(userId)
            }).then(user => {
                var usersBestRights = user.rights || 0;
                for (var rights of groupRights) {
                    if (usersBestRights < 2) {
                        continue;
                    }
                    if (rights < usersBestRights) {
                        usersBestRights = rights
                    }
                }
                topResolve(usersBestRights);
            }).catch(err => {
                topReject(err);
            })
        }).catch(err => {
            topReject(err);
        })
    });
};
dapi.access.users.update = function (userId, usernameArg, passwordArg, rightsArg) {
    var Users = getDependency(dapi_model_users);
    return Users.findByIdAndUpdate(userId, {
        $set: {
            username: usernameArg || username,
            password: passwordArg || password,
            rights: rightsArg || rights
        }
    }, {upsert: true});
};
dapi.access.users.remove = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findByIdAndRemove(userId)
};
dapi.access.users.checkCredentials = function (username, password) {
    var Users = getDependency(dapi_model_users);
    var sha = getDependency("sha256");
    return Users.findOne({'username': username, 'password': sha(password)}, '_id').then(data => {
        if (data) {
            return data._id;
        } else {
            return false;
        }
    });
};
dapi.access.users.pureRemoveGroup = function (userId, groupId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    return Users.findByIdAndUpdate(userId, {$pull: {groups: groupId}})
};
dapi.access.users.devare = function (userId) {
    var Users = getDependency(dapi_model_users);
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.exists(userId).then(exists => {
            if (exists) {
                return dapi.access.users.getGroups(userId)
            }
            else {
                topResolve("All good");
            }
        }).then(user => {
            var myPromises = [];
            myPromises.push(Users.findByIdAndRemove(userId));
            for (var groupId of user.groups) {
                myPromises.push(dapi.access.groups.removeUserAsAdmin(groupId, userId));
                myPromises.push(dapi.access.groups.removeMember(groupId, userId));
            }
            topResolve(Promise.all(myPromises))
        }).catch(err => {
            topReject(err);
        })
    });
};
dapi.access.users.getRights = function (userId) {
    var Users = getDependency(dapi_model_users);
    var conf = getDependency("../config/dapi/access.json");
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.getBestRights(userId).then(rights => {
            topResolve(conf.rights[rights])
        }).catch(err => {
            topReject(err)
        })
    });
};
dapi.access.users.canUserChangeUser = function (userId, challengerId) {
    return new Promise(function (topResolve, topReject) {
        Promise.all([
            dapi.access.users.getBestRights(userId),
            dapi.access.users.getBestRights(challengerId),
            dapi.access.users.getRights(challengerId)
        ]).then(data => {
            topResolve((data[0] > data[1] && data[2].canChangeUser.value))
        }).catch(err => {
            topReject(err);
        });
    });
};
dapi.access.users.removeFromGroup = function (groupId, userId) {
    return Promise.all([
        dapi.access.users.pureRemoveGroup(userId, groupId),
        dapi.access.groups.removeMember(groupId, userId)
    ])
};


dapi.access.ehAuth = function (limit, failureRedirect) {
    return function (request, response, next) {
        if (request.user) {
            if (request.user.admin) {
                next();
            } else if(!limit && limit !== 0) {
                console.log("next applied");
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
};

dapi.access.ehLogin = function (successRedirect, failureRedirect) {
    return getDependency('passport').authenticate('local', {
        successRedirect: successRedirect || dapi.access.conf.successRedirect.value,
        failureRedirect: failureRedirect || dapi.access.conf.failureRedirect.value,
        failureFlash: true
    })
};

dapi.access.ehLogout = function () {
    return function (request, response, next) {
        request.logout();
        next();
    }
};
stack.dapis.access = stack.dapis.access || {};
stack.dapis.access.users = dapi.access.users;