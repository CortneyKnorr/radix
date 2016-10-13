function loadArticleContent() {
    article = {};
    article.dapi = getDependency(stack_dapis_contents);
    article.channel = "article";


    article.properties = {
        LIKES: 0,
        SHARES: 1,
        NOTE: 2,
        COMMENT_ENABLE: 3,
        URL_REF: 4,
        URL_PICTURE: 5
    };


    article.cfs = {

        create: function*(lightInstance) {
            lightInstance.channel = article.channel;
            return yield* article.dapi.cfs.create(lightInstance);
        },
        update: function*(id, lightInstance) {
            return yield* article.dapi.cfs.update(id, lightInstance);
        },

        delete: function*(id) {
            return yield* article.dapi.cfs.delete(id);
        },

        get: function*(id) {
            return yield* article.dapi.cfs.get(id);
        },

        getPaged: function*(page, pageLength) {
            return yield* article.dapi.cfs.getPaged(article.channel, page, pageLength);
            // .populate("children", null, "category")
            // .populate("tags")
            // .populate("author");
        },


        getAbsolutePaged: function*(page, pageLength) {
            let offset = page * pageLength;
            return yield* article.dapi.find({
                publishDate: {$ne: null},
                channel: article.channel
            }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                .populate("children")
                .populate("tags")
                .populate("author");
        },


        getTrashed: function*(page, pageLength) {
            return yield* (
                (typeof page == 'number' && pageLength) ?

                    article.dapi.cfs.getTrashed(article.channel, page, pageLength)
                        .populate("children")
                        .populate("tags")
                        .populate("author") : //true

                    article.dapi.cfs.getTrashed(article.channel) //false
            );

        },

        getLatestInCategory: function*(categoryArg, page, pageLength) {
            let offset = page * pageLength;
            let cat = yield* category.dapi.find({title: categoryArg, channel: category.channel}, "_id");
            return yield* (
                (typeof page == 'number' && pageLength) ?

                    article.dapi.find({
                        channel: article.channel,
                        properties: {$in: cat._id}
                    }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                        .populate("children")
                        .populate("tags")
                        .populate("author") : //true

                    article.dapi.find({
                        channel: article.channel,
                        properties: {$in: cat._id}
                    }).sort({birthDate: -1})//false
            );
        },

        getAbsoluteLatestInCategory: function*(categoryArg, page, pageLength) {
            let offset = page * pageLength;
            let cat = yield* category.dapi.find({title: categoryArg, channel: category.channel}, "_id");
            return yield* (
                (typeof page == 'number' && pageLength) ?

                    article.dapi.find({
                        publishDate: {$ne: null},
                        channel: article.channel,
                        properties: {$in: cat._id}
                    }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                        .populate("children")
                        .populate("tags")
                        .populate("author") : //true

                    article.dapi.find({
                        publishDate: {$ne: null},
                        channel: article.channel,
                        properties: {$in: cat._id}
                    }).sort({birthDate: -1})//false
            );
        },


        getLatestWithTags: function*(tagsArg, page, pageLength) {
            var tagsSplit = tagsArg.split("&");

            let tags = yield* tag.dapi.find({title: {$all: tagsSplit}, channel: tag.channel}).lean();
            tags = tags.map(tag => tag._id);

            let offset = page * pageLength;

            return yield* (
                (typeof page == 'number' && pageLength) ?

                    article.dapi.find({
                        channel: article.channel,
                        tags: {$all: tags}
                    }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                        .populate("children")
                        .populate("tags")
                        .populate("author") : //true

                    article.dapi.find({
                        channel: article.channel,
                        tags: {$all: tags}
                    }).sort({birthDate: -1}) //false
            );

        },

        getAbsoluteLatestWithTags: function*(tagsArg, page, pageLength) {
            var tagsSplit = tagsArg.split("&");

            let tags = yield* tag.dapi.find({title: {$all: tagsSplit}, channel: tag.channel}).lean();
            tags = tags.map(tag => tag._id);
            let offset = page * pageLength;

            return yield* (
                (typeof page == 'number' && pageLength) ?

                    article.dapi.find({
                        publishDate: {$ne: null},
                        channel: article.channel,
                        tags: {$all: tags}
                    }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                        .populate("children")
                        .populate("tags")
                        .populate("author") : //true

                    article.dapi.find({
                        publishDate: {$ne: null},
                        channel: article.channel,
                        tags: {$all: tags}
                    }).sort({birthDate: -1}) //false
            );
        },


        getByUrlRef: function*(urlRef) {
            return yield* article.dapi.findOne({urlRef: urlRef, channel: article.channel})
                .populate("children")
                .populate("tags")
                .populate("author");
        },

        publish: function*(id) {
            return yield* article.dapi.cfs.publish(id);
        },

        unPublish: function*(id) {
            return yield* article.dapi.cfs.unpublish(id);
        },

        trash: function*(id) {
            return yield* article.dapi.cfs.trash(id);
        },

        unTrash: function*(id) {
            return yield* article.dapi.cfs.untrash(id);
        },

        generateAndSetUrlRef: function*(id) {
            let article = yield* article.get(id);
            let str = article.title;

            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();

            var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
            var to = "aaaaaeeeeeiiiiooooouuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            return yield* article.updateProperty(id, article.properties.URL_REF, str);


        }
    };

    article.ehgs = {

        create: function*(lightInstanceArg) {
            return function*(request, response, next) {
                let lightInstance = stack.dapis.wizards.standards.ehgf13Arg(lightInstanceArg, request, false);
                response.send(yield* article.cfs.create(lightInstance));
            }
        },
        update: function*(idArg, lightInstanceArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                let lightInstance = stack.dapis.wizards.standards.ehgf13Arg(lightInstanceArg, request, false);
                response.send(yield* article.cfs.update(id, lightInstance));
            }
        },

        delete: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.delete(id));
            }
        },

        get(idArg){
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.get(id));
            }
        },

        getPaged: function*(pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getPaged(page, pageLength));
            }
        },


        getAbsolutePaged: function*(pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getAbsolutePaged(page, pageLength));
            }
        },


        getTrashed: function*(pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getTrashed(page, pageLength));
            }
        },

        getLatestInCategory: function*(categoryArg, pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let category = stack.dapis.wizards.standards.ehgf13Arg(categoryArg, request, false);
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getLatestInCategory(category, page, pageLength));
            }
        },

        getAbsoluteLatestInCategory: function*(categoryArg, pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let category = stack.dapis.wizards.standards.ehgf13Arg(categoryArg, request, false);
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getAbsoluteLatestInCategory(category, page, pageLength));
            }
        },

        getLatestWithTags: function*(tagsArg, pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let tags = stack.dapis.wizards.standards.ehgf13Arg(tagsArg, request, false);
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getLatestWithTags(tags, page, pageLength));
            }
        },

        getAbsoluteLatestWithTags: function*(tagsArgArg, pageArg, pageLengthArg) {
            return function*(request, response, next) {
                let tags = stack.dapis.wizards.standards.ehgf13Arg(tagsArg, request, false);
                let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                response.send(yield* article.cfs.getAbsoluteLatestWithTags(tags, page, pageLength));
            }
        },


        getByUrlRef: function*(urlRefArg) {
            return function*(request, response, next) {
                let urlRef = stack.dapis.wizards.standards.ehgf13Arg(urlRefArg, request, false);
                response.send(yield* article.cfs.getByUrlRef(urlRef));
            }
        },

        publish: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.publish(id));
            }
        },

        unPublish: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.unPublish(id));
            }
        },

        trash: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.trash(id));
            }
        },

        unTrash: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.unTrash(id));
            }
        },

        generateAndSetUrlRef: function*(idArg) {
            return function*(request, response, next) {
                let id = stack.dapis.wizards.standards.ehgf13Arg(idArg, request, false);
                response.send(yield* article.cfs.generateAndSetUrlRef(id));
            }
        }
    }

}