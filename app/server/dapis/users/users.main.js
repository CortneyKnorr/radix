function stack_dapis_users() {
    var Users = getDependency(stack_models_users);
    return {
        fcs: {
            create: function*(leanInstance) {
                if (leanInstance.username && leanInstance.password) {
                    //Retrieve users with same name
                    var usersWithSameName = yield Users.count({username: leanInstance.username});

                    //If no one else has the same username
                    if (usersWithSameName == 0) {
                        var myUser = new Users();
                        myUser.username = leanInstance.username;
                        myUser.password = leanInstance.password;
                        myUser.rights = leanInstance.rights || 5;
                        return yield myUser.save();
                    } else {
                        return false;
                    }
                } else {
                    throw "Params are not defined properly";
                }
            },
            getPaged: function* (page, pageLength) {
                let offset = page*pageLength;
                return yield Users.find().skip(offset).limit(pageLength);
            },
            count: function* () {
                return yield Users.count();
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
            remove: function*(userId) {
                return yield Users.findByIdAndRemove(userId);
            },
            getRealRights: function*(userId) {
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
                return !!potentialUser;
            }
        },
        ehgs: {
            create: function (leanInstanceArg) {
                return function*(request, response){
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let results = yield* stack.dapis.users.fcs.create(leanInstance);
                    response.send(results);
                };
            },
            get: function (userIdArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let results = yield* stack.dapis.users.fcs.get(userId);
                    response.send(results);
                };
            },
            getPaged: function (pageArg, pageLengthArg) {
                return function*(request, response){
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    let results = yield* stack.dapis.users.fcs.getPaged(page, pageLength);
                    response.send(results);
                };
            },
            count: function () {
                return function*(request, response){
                    response.send(yield* stack.dapis.users.fcs.count());
                };
            },
            getWithoutPassword: function (userIdArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let results = yield* stack.dapis.users.fcs.getWithoutPassword(userId);
                    response.send(results);
                };
            },
            getAllByRights: function (rightsArg) {
                return function*(request, response){
                    let rights = stack.dapis.wizards.standards.ehgf13Arg(rightsArg, request, false);
                    let results = yield* stack.dapis.users.fcs.getAllByRights(rights);
                    response.send(results);
                };
            },
            exists: function (userIdArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let results = yield* stack.dapis.users.fcs.exists(userId);
                    response.send(results);
                };
            },
            update: function (userIdArg, leanInstanceArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let results = yield* stack.dapis.users.fcs.update(userId, leanInstance);
                    response.send(results);
                };
            },
            remove: function (userIdArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let results = yield* stack.dapis.users.fcs.remove(userId);
                    response.send(results);
                };
            },
            getRealRights: function (userIdArg) {
                return function*(request, response){
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let results = yield* stack.dapis.users.fcs.getRealRights(userId);
                    response.send(results);
                };
            },
            checkCredentials: function (usernameArg, passwordArg) {
                return function*(request, response){
                    let username = stack.dapis.wizards.standards.ehgf13Arg(usernameArg, request, false);
                    let password = stack.dapis.wizards.standards.ehgf13Arg(passwordArg, request, false);
                    let results = yield* stack.dapis.users.fcs.checkCredentials(username, password);
                    response.send(results);
                };
            }
        },
        pehgs: {
            create: function (leanInstanceArg) {
                return function*(request, response, next){
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    request.peh = yield* stack.dapis.users.fcs.create(leanInstance);
                    next();
                };
            },
        }
    }
}