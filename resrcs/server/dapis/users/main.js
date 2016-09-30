function stack_dapis_users() {
    var Users = getDependency(stack_models_users);
    return {
        cfs: {
            create: function*(username, password, rights) {
                if (username && password && typeof rights == 'number') {
                    //Retrieve users with same name
                    var usersWithSameName = yield Users.count({username: username});

                    //If no one else has the same username
                    if (usersWithSameName == 0) {
                        var myUser = new Users();
                        myUser.username = username;
                        myUser.password = password;
                        myUser.rights = rights;
                        return yield myUser.save();
                    } else {
                        return false;
                    }
                } else {
                    throw "Params are not defined properly";
                }
            },
            get: function*(userId) {
                return yield Users.findById(userId);
            },
            getWithoutPassword: function*(userId) {
                return yield Users.findById(userId, "-password");
            },
            getAllByRights: function*(rightsArg) {
                return yield Users.find({"rights": rightsArg}, "-password");
            },
            exists: function*(userId) {
                let matches = yield Users.count({_id: userId});
                return yield matches > 0;
            },
            update: function*(userId, leanInstance) {
                let oldUser = yield Users.findById(userId);
                let newUser = stack.dapis.wizards.objects.update(oldUser, leanInstance);
                return yield newUser.save();
            },
            remove: function*(userId, leanInstance) {
                return yield Users.findByIdAndRemove(userId);
            },
            getRealRights: function*(userId, leanInstance) {
                let conf = getDependency("../config/dapi/access.json");
                let user = yield Users.findById(userId);
                return yield (conf[user.rights] || {});
            },
            checkCredentials: function*(username, password) {
                let Users = getDependency(dapi_model_users);
                let Hash = require('password-hash');
                let potentialUser = yield Users.findOne({
                    'username': username,
                    'password': ( Hash.isHashed(password) ? password : Hash.generate(password))
                });
                if (potentialUser){
                    return true;
                } else {
                    return false;
                }
            }
        },
        ehgs: {
            create: function*(usernameArg, passwordArg, rightsArg) {
                return function*(request, response, next){
                    let username = stack.dapis.wizards.standards.ehgf13Arg(usernameArg, request, false);
                    let password = stack.dapis.wizards.standards.ehgf13Arg(passwordArg, request, false);
                    let rights = stack.dapis.wizards.standards.ehgf13Arg(rightsArg, request, false);
                    let results = yield* stack.dapis.users.cfs.create(username, password, rights);
                    response.send(results);
                };
            },
            get: function*(userId) {
                yield Users.findById(userId);
            },
            getWithoutPassword: function*(userId) {
                yield Users.findById(userId, "-password");
            },
            getAllByRights: function*(rightsArg) {
                yield Users.find({"rights": rightsArg}, "-password");
            },
            exists: function*(userId) {
                let matches = yield Users.count({_id: userId});
                yield matches > 0;
            },
            update: function*(userId, leanInstance) {
                let oldUser = yield Users.findById(userId);
                let newUser = stack.dapis.wizards.objects.update(oldUser, leanInstance);
                yield newUser.save();
            },
            remove: function*(userId, leanInstance) {
                yield Users.findByIdAndRemove(userId);
            },
            getRealRights: function*(userId, leanInstance) {
                let conf = getDependency("../config/dapi/access.json");
                let user = yield Users.findById(userId);
                yield (conf[user.rights] || {});
            },
            checkCredentials: function*(username, password) {
                let Hash = require('password-hash');
                let potentialUser = yield Users.findOne({
                    'username': username,
                    'password': ( Hash.isHashed(password) ? password : Hash.generate(password))
                });
                if (potentialUser){
                    yield true;
                } else {
                    yield false;
                }
            }
        }
    }
}