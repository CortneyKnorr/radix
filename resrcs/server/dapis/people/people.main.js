function stack_dapis_peoples() {
    let Peoples = getDependency(stack_models_peoples);

    let thisDapi = {
        cfs: {
            get: function*(id) {
                return yield Peoples.findById(id);
            },

            getElement: function*(id, enumArg){
                return yield Peoples.find({_id: id}, enumArg);
            },

            getAll: function*(){
                return yield Peoples.find({}, "surname + firstnames + mail").lean();
            },
            create: function*(lightInstance) {
                let myObject = new Peoples(lightInstance);
                return yield myObject.save();
            },
            delete: function*(id) {
                return yield Peoples.findByIdAndRemove(id);
            },
            update: function*(id, leanInstance) {
                let myObject = yield Peoples.findById(id);
                if (myObject) {
                    if (leanInstance.user) myObject.user = leanInstance.user;
                    if (leanInstance.surname) myObject.surname = leanInstance.surname;
                    if (leanInstance.firstnames) myObject.firstnames = leanInstance.firstnames;
                    if (leanInstance.phone) myObject.phone = leanInstance.phone;
                    if (leanInstance.mail) myObject.mail = leanInstance.mail;
                    if (leanInstance.gender) myObject.gender = leanInstance.gender;
                    if (leanInstance.nationality) myObject.nationality = leanInstance.nationality;
                    if (leanInstance.sites) myObject.sites = leanInstance.sites;
                    if (leanInstance.address) myObject.address = leanInstance.address;
                    if (leanInstance.address2) myObject.address2 = leanInstance.address2;
                    if (leanInstance.postal) myObject.postal = leanInstance.postal;
                    if (leanInstance.birthDate) myObject.birthDate = leanInstance.birthDate;
                    if (leanInstance.obitDate) myObject.obitDate = leanInstance.obitDate;
                    if (leanInstance.creationDate) myObject.creationDate = leanInstance.creationDate;
                    if (leanInstance.profilPict) myObject.profilPict = leanInstance.profilPict;
                    if (leanInstance.country) myObject.country = leanInstance.country;
                    if (leanInstance.hobbies) myObject.hobbies = leanInstance.hobbies;
                    if (leanInstance.activity) myObject.activity = leanInstance.activity;
                    if (leanInstance.friends) myObject.friends = leanInstance.friends;
                    if (leanInstance.siblings) myObject.siblings = leanInstance.siblings;
                    if (leanInstance.spouse) myObject.spouse = leanInstance.spouse;
                    if (leanInstance.parents) myObject.parents = leanInstance.parents;
                    if (leanInstance.children) myObject.children = leanInstance.children;

                    return yield myObject.save();
                } else {
                    return {};
                }
            },

            makeIndependent: function*(id) {
                let child = yield Peoples.findById(id);
                if (child.parents && child.parents != null) {
                    let parents = [];
                    for (let parent of yield Peoples.find({children: {$ne: null}})) {
                        for (let children of parent.children) {
                            if (children == id) {
                                parents.push(parent)
                            }
                        }
                    }

                    for (let index in parents) {
                        let i = parents[index].children.indexOf(child._id);
                        if (i != -1) {
                            parents[index].children.splice(i, 1);
                            yield parents[index].save();
                        }
                    }
                    child.parents = null;
                }
                return yield child.save();

            },

            setChildren: function*(id, childrenId) {
                let parent = yield Peoples.findById(id);
                parent.children = parent.children.concat(childrenId);
                parent.save();
                for (let children of childrenId) {
                    let child = yield Peoples.findById(children);
                    child.parents.push(id);
                    child.save();
                }
                return parent;
            }
        },

        ehgs: {
            get(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.get(id));
                }
            },
            getElement(idArg, enumStringArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let enumArg = stack.dapis.wizards.standards.ehgf13Arg(enumStringArg, request, false);
                    response.send(yield* thisDapi.cfs.getElement(id, enumArg));
                }
            },
            getAll(){
                return function*(request, response, next) {
                    response.send(yield* thisDapi.cfs.getAll());
                }
            },
            create(leanInstanceArg){
                return function*(request, response, next) {
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.create(leanInstance));
                }
            },
            delete(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let deletedFile = yield* thisDapi.cfs.delete(id);
                    response.send(deletedFile);
                }
            },
            update(idArg, leanInstanceArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.update(id, leanInstance));
                }
            },
            makeIndependent(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.makeIndependent(id));
                }
            },
            setChildren(idArg, childrenIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let childrenId = stack.dapis.wizards.standards.ehgf13Arg(childrenIdArg, request, false);
                    response.send(yield* thisDapi.cfs.setChildren(id, childrenId));
                }
            },

        }
    };
    return thisDapi;
}