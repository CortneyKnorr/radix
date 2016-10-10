function stack_dapis_groups() {
    let Groups = getDependency(stack_models_groups);
    let Users = getDependency(stack_models_users);
    let thisDapi = {
        actions: {
            ENABLE: 1,
            DISABLE: 2,
            MAKEPOWERFULL: 3,
            STRIPPOWERS: 4,
        },
        cfs: {
            create: function*(leanInstance) {
                return yield (new Groups(leanInstance)).save();
            },
            update: function*(id, leanInstance) {
                return yield Groups.findByIdAndUpdate(id, leanInstance, {new: true});
            },
            get: function*(id) {
                return yield Groups.findById(id).populate("users").populate("admins");
            },
            getAll: function*(page, pageLength) {
                return yield (
                    (typeof page == 'number' && pageLength) ?
                        Groups.find({}).skip(page * pageLength).limit(pageLength) : //true
                        Groups.find({}) //false
                );
            },
            getEnabled: function*(page, pageLength) {
                return yield (
                    (typeof page == 'number' && pageLength) ?
                        Groups.find({enabled: true}).skip(page * pageLength).limit(pageLength) : //true
                        Groups.find({enabled: true}) //false
                );
            },
            getByRights: function*(rights, page, pageLength) {
                return yield (
                    (typeof page == 'number' && pageLength) ?
                        Groups.find({rights: rights}).skip(page * pageLength).limit(pageLength) : //true
                        Groups.find({rights: rights}) //false
                );
            },
            delete: function*() {
                return yield Groups.findByIdAndRemove(id);
            },

            addUser: function*(parentId, userId) {
                let parent = yield Groups.findById(parentId);
                parent.users.push(userId);
                return yield parent.save();
            },
            addUsers: function*(parentId, userIds) {
                let parent = yield Groups.findById(parentId);
                parent.users.concat(userIds);
                return yield parent.save();
            },
            addAdmin: function*(parentId, adminId) {
                let parent = yield Groups.findById(parentId);
                parent.admins.push(adminId);
                return yield parent.save();
            },
            removeAdmin: function*(parentId, adminId) {
                let parent = yield Groups.findById(parentId);
                parent.admins = parent.admins.filter(admin => admin != adminId);
                return yield parent.save();
            },
            removeUser: function*(parentId, userID) {
                let parent = yield Groups.findById(parentId);
                parent.users = parent.admins.filter(admin => admin != userID);
                return yield parent.save();
            },
            getUsersBestRights: function*(userId) {
                let differentRights = yield mapPromises({
                    groupBased: Groups.find({users: userId, power: true, enabled: true}).exec(),
                    user: Users.findById(userId).exec()
                });
                let rightsArray = differentRights.groupBased.map(group => group.rights);
                rightsArray.push(differentRights.user.rights);
                let bestRights = Math.min(...rightsArray);
                return bestRights;
            },
            getUsersGroups: function*(userId) {
                return yield Groups.find({users: userId, enabled: true}).exec();
            },
            groupHasUser: function*(userId, groupId) {
                return Boolean((yield Groups.count({users: userId, _id: groupId}).exec()));
            },
            isUserInAGroupNamed: function*(userId, groupName) {
                return Boolean((yield Groups.count({users: userId, name: groupName}).exec()));
            },
            action: function*(id, action) {
                switch (action) {
                    case thisDapi.actions.DISABLE:
                        return yield Groups.findByIdAndUpdate(id, {enabled: false}, {new: true});
                        break;
                    case thisDapi.actions.ENABLE:
                        return yield Groups.findByIdAndUpdate(id, {enabled: true}, {new: true});
                        break;
                    case thisDapi.actions.STRIPPOWERS:
                        return yield Groups.findByIdAndUpdate(id, {power: false}, {new: true});
                        break;
                    case thisDapi.actions.MAKEPOWERFULL:
                        return yield Groups.findByIdAndUpdate(id, {power: true}, {new: true});
                        break;
                }
            },

        },
        ehgs: {
            create(leanInstanceArg){
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.create(leanInstance));
                };
            },
            update(idArg, leanInstanceArg){
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.update(id, leanInstance));
                };
            },
            get(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                };
            },
            getAll(pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getAll(page, pageLength));
                };
            },
            getEnabled(pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getEnabled(page, pageLength));
                };
            },
            getByRights(rightsArg, pageArg, pageLengthArg){
                return function*(request, response, next) {
                    let rights = stack.dapis.wizards.standards.ehgf13Arg(rightsArg, request, false);
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getByRights(rights, page, pageLength));
                };
            },
            delete(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.delete(id));
                };
            },

            addUser(parentIdArg, userIdArg){
                return function*(request, response, next) {
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.addUser(parentId, userId));
                };
            },
            addUsers(parentIdArg, userIdsArg){
                return function*(request, response, next) {
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    let userIds = stack.dapis.wizards.standards.ehgf13Arg(userIdsArg, request, false);
                    response.send(yield* thisDapi.cfs.addUsers(parentId, userIds));
                };
            },
            addAdmin(parentIdArg, userIdArg){
                return function*(request, response, next) {
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.addAdmin(parentId, userId));
                };
            },
            removeAdmin(parentIdArg, userIdArg){
                return function*(request, response, next) {
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.removeAdmin(parentId, userId));
                };
            },
            removeUser(parentIdArg, userIdArg){
                return function*(request, response, next) {
                    let parentId = stack.dapis.wizards.standards.ehgf13Arg(parentIdArg, request, false);
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.removeAdmin(parentId, userId));
                };
            },
            getUsersBestRights(userIdArg){
                return function*(request, response, next) {
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.getUsersBestRights(userId));
                };
            },
            getUsersGroups(userIdArg){
                return function*(request, response, next) {
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    response.send(yield* thisDapi.cfs.getUsersGroups(userId));
                };
            },
            groupHasUser(userIdArg, groupIdArg){
                return function*(request, response, next) {
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let groupId = stack.dapis.wizards.standards.ehgf13Arg(groupIdArg, request, false);
                    response.send(yield* thisDapi.cfs.groupHasUser(userId, groupId));
                };
            },
            isUserInAGroupNamed(userIdArg, groupNameArg){
                return function*(request, response, next) {
                    let userId = stack.dapis.wizards.standards.ehgf13Arg(userIdArg, request, false);
                    let groupName = stack.dapis.wizards.standards.ehgf13Arg(groupNameArg, request, false);
                    response.send(yield* thisDapi.cfs.isUserInAGroupNamed(userId, groupName));
                };
            },
            action(idArg, actionArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let action = stack.dapis.wizards.standards.ehgf13Arg(actionArg, request, false);
                    response.send(yield* thisDapi.cfs.action(id, action));
                };
            },
        }
    };
    return thisDapi;
}