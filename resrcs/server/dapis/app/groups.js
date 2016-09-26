var dapi = dapi || {};
dapi.access = dapi.access || {};
dapi.access.groups = {};
stack = stack || {};
stack.dapis = stack.dapis || {};


dapi.access.groups.create = function (groupname, admins, groupAdmins, rights, manageableBy) {
    var Groups = getDependency(dapi_model_groups);
    var myGroup = new Groups();
    myGroup.name = groupname;
    myGroup.members = [];
    myGroup.admins = admins;
    myGroup.groupAdmin = groupAdmins;
    myGroup.rights = rights;
    myGroup.manageableBy = manageableBy;
    return myGroup.save();
};
dapi.access.groups.exists = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (resolve) {
        Groups.count({_id: groupId}, function (err, count) {
            resolve(count > 0)
        });
    });
};
dapi.access.groups.get = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findById(groupId);
};
dapi.access.groups.getAll = function () {
    var Groups = getDependency(dapi_model_groups);
    return Groups.find({});
};
dapi.access.groups.removeMember = function (groupId, userId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {members: userId}})
};
dapi.access.groups.addUserAsAdmin = function (groupId, userId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (resolve, reject) {
        stack.dapis.access.users.exists(userId).then(exists => {
            if (exists) {
                return stack.dapis.access.groups.get(groupId);
            } else {
                throw "User does not exist";
            }
        }).then(group => {
            if (group.admins.indexOf(userId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {admins: userId}}, function (err, lgroup) {
                    if (err)
                        reject(err);
                    else
                        resolve(lgroup);
                });
            }
            else {
                resolve(group)
            }
        }).catch(error => {
            reject(error);
        })
    });
};
dapi.access.groups.removeUserAsAdmin = function (groupId, userID) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {admins: userID}})
};
dapi.access.groups.addGroupAsAdmin = function (groupId, futureAdminGroupId) {
    var Groups = getDependency(dapi_model_groups);
    var Users = getDependency(dapi_model_users);
    return new Promise(function (resolve, reject) {
        stack.dapis.access.groups.exists(futureAdminGroupId).then(exists => {
            if (exists) {
                if (exists) {
                    return stack.dapis.access.groups.get(groupId);
                } else {
                    throw "Group does not exist";
                }
            }
        }).then(group => {
            if (group.groupAdmin.indexOf(futureAdminGroupId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {groupAdmin: futureAdminGroupId}}, function (err, lgroup) {
                    if (err)
                        reject(err);
                    else
                        resolve(lgroup);
                });
            }
            else {
                resolve(group)
            }
        }).catch(error => {
            reject(error);
        })
    });
};
dapi.access.groups.removeGroupAsAdmin = function (groupId, adminGroupId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {groupAdmin: adminGroupId}})
};
dapi.access.groups.update = function (groupId, groupnameArg, rightsArg, manageableByArg) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {
        $set: {
            name: groupnameArg || name,
            rights: rightsArg || rights,
            manageableBy: manageableByArg || manageableBy
        }
    }, {upsert: true});
};
dapi.access.groups.delete = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (topResolve, topReject) {
        stack.dapis.access.groups.exists(groupId).then(exists => {
            if (exists) {
                return stack.dapis.access.groups.get(groupId);
            } else {
                topReject("Group does not exist")
            }
        }).then(group => {
            var myPromises = [];
            myPromises.push(Groups.findByIdAndRemove(groupId));
            for (var memberId of group.members) {
                myPromises.push(stack.dapis.access.users.pureRemoveGroup(memberId, groupId));
            }
            topResolve(Promise.all(myPromises))
        }).catch(err => {
            topReject(err);
        })
    })
};
dapi.access.groups.canUserChangeGroup = function (groupId, userId) {
    return new Promise(function (topResolve, topReject) {
        Promise.all([
            stack.dapis.access.users.getBestRights(userId),
            stack.dapis.access.groups.get(groupId),
            stack.dapis.access.users.getRights(userId)
        ]).then(data => {
            console.log(data);
            topResolve((data[0] <= data[1].manageableBy && data[2].canChangeGroup.value))
        }).catch(err => {
            topReject(err);
        });
    });
};
stack.dapis.access = stack.dapis.access || {};
stack.dapis.access.groups = dapi.access.groups;