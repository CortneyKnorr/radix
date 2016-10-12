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
            },

            makeDivorced: function*(id){
                let subject = yield Peoples.findById(id);
                if (subject.spouse && subject.spouse != null) {

                    let subjectSpouse = yield Peoples.findById(subject.spouse);
                    subjectSpouse.spouse = null;
                    subjectSpouse.save();

                    subject.spouse = null;
                    subject.save();
                }
                return subject;
            },

            setSpouse: function*(id, spouseId) {
                let subject = yield Peoples.findById(id);
                let spouseSubject = yield Peoples.findById(spouseId);

                if(subject && spouseSubject){
                    subject.spouse = spouseId;
                    subject.save();

                    spouseSubject.spouse = id;
                    spouseSubject.save();

                    return subject;
                }
            },

            desactivateOrReactivate: function*(id){
                let subject = yield Peoples.findById(id);
                if(subject.obitDate){
                    subject.obitDate = subject.obitDate != null ? null : Date.now();
                } else {
                    subject.obitDate = Date.now();
                }
                return subject.save();
            },

            addFriend: function*(id, friendId){
                let subject = yield Peoples.findById(id);
                let friendSubject = yield Peoples.findById(friendId);
                if(subject && friendSubject){
                    subject.friends.push(friendId);
                    subject.save();

                    friendSubject.friends.push(id);
                    friendSubject.save();
                }

            },

            removeFriend: function*(id, friendId){
                let subject = yield Peoples.findById(id);
                let friendSubject = yield Peoples.findById(friendId);
                if(subject && friendSubject){
                    for(let i = 0; i < subject.friends.length; i++){
                        if(subject.friends[i] == friendId){
                            subject.friends.splice(i, 1);
                            subject.save();
                        }
                    }
                    for(let i = 0; i < friendSubject.friends.length; i++){
                        if(friendSubject.friends[i] == friendId){
                            friendSubject.friends.splice(i, 1);
                            friendSubject.save();
                        }
                    }
                }
            },

            addSibling: function*(id, siblingId){
                let subject = yield Peoples.findById(id);
                let siblingSubject = yield Peoples.findById(siblingId);
                if(subject && siblingSubject){
                    subject.siblings.push(siblingId);
                    subject.save();

                    siblingSubject.siblings.push(siblingId);
                    siblingSubject.save();

                    return subject;
                }
            },

            removeSibling: function*(id, siblingId){
                let subject = yield Peoples.findById(id);
                let siblingSubject = yield Peoples.findById(siblingId);
                if(subject && siblingSubject){
                    for(let i = 0; i < subject.siblings.length; i++){
                        if(subject.siblings[i] == siblingId){
                            subject.siblings.splice(i, 1);
                            subject.save();
                        }
                    }
                    for(let i = 0; i < siblingSubject.siblings.length; i++){
                        if(siblingSubject.siblings[i] == siblingId){
                            siblingSubject.siblings.splice(i, 1);
                            siblingSubject.save();
                        }
                    }
                    return subject;
                }
            },


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
            setSpouse(idArg, spouseIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let spouseId = stack.dapis.wizards.standards.ehgf13Arg(spouseIdArg, request, false);
                    response.send(yield* thisDapi.cfs.setSpouse(id, spouseId));
                }
            },
            makeDivorced(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.makeDivorced(id));
                }
            },
            desactivateOrReactivate(idArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    response.send(yield* thisDapi.cfs.desactivateOrReactivate(id));
                }
            },
            addFriend(idArg, friendIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let friendId = stack.dapis.wizards.standards.ehgf13Arg(friendIdArg, request, false);
                    response.send(yield* thisDapi.cfs.addFriend(id, friendId));
                }
            },
            removeFriend(idArg, friendIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let friendId = stack.dapis.wizards.standards.ehgf13Arg(friendIdArg, request, false);
                    response.send(yield* thisDapi.cfs.removeFriend(id, friendId));
                }
            },
            addSibling(idArg, siblingIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let siblingId = stack.dapis.wizards.standards.ehgf13Arg(siblingIdArg, request, false);
                    response.send(yield* thisDapi.cfs.addSibling(id, siblingId));
                }
            },
            removeSibling(idArg, siblingIdArg){
                return function*(request, response, next) {
                    let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                    let siblingId = stack.dapis.wizards.standards.ehgf13Arg(siblingIdArg, request, false);
                    response.send(yield* thisDapi.cfs.removeSibling(id, siblingId));
                }
            },

        }
    };
    return thisDapi;
}