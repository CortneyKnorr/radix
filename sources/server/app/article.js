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

    article.create = function (lightInstance) {
        lightInstance.channel = article.channel;
        return article.dapi.cfs.create(lightInstance);
    };

    article.update = function (id, lightInstance) {
        return article.dapi.cfs.update(id, lightInstance);
    };

    article.delete = function (id) {
        return article.dapi.cfs.delete(id);
    };

    article.get = function (id) {
        return article.dapi.cfs.get(id);
    };

    article.getPaged = function (page, pageLength) {
        return article.dapi.cfs.getPaged(article.channel, page, pageLength)
            .populate("children")
            .populate("tags")
            .populate("author");
    };


    article.getAbsolutePaged = function (page, pageLength) {
        let offset = page * pageLength;
        return article.dapi.find({
            publishDate: {$ne: null},
            channel: article.channel
        }).sort({birthDate: -1}).skip(offset).limit(pageLength)
            .populate("children")
            .populate("tags")
            .populate("author");
    };


    article.getTrashed = function (page, pageLength) {
        return (
            (typeof page == 'number' && pageLength) ?

                article.dapi.cfs.getTrashed(article.channel, page, pageLength)
                    .populate("children")
                    .populate("tags")
                    .populate("author") : //true

                article.dapi.cfs.getTrashed(article.channel) //false
        );

    };

    article.getLatestInCategory = function (categoryArg, page, pageLength) {
        let offset = page * pageLength;
        category.dapi.find({title: categoryArg, channel: category.channel}, "_id")
            .then(cat => {
                return (
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
            });

    };

    article.getAbsoluteLatestInCategory = function (categoryArg, page, pageLength) {
        let offset = page * pageLength;
        category.dapi.find({title: categoryArg, channel: category.channel}, "_id")
            .then(cat => {
                return (
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
            });


    };


    article.getLatestWithTags = function (tagsArg, page, pageLength) {
        var tagsSplit = tagsArg.split("&");

        return tag.dapi.find({title: {$all: tagsSplit}, channel: tag.channel}).lean()
            .then(response => {
                return response.map(tag => tag._id);
            })
            .then(response => {
                let offset = page * pageLength;

                return (
                    (typeof page == 'number' && pageLength) ?

                        article.dapi.find({
                            channel: article.channel,
                            tags: {$all: response}
                        }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                            .populate("children")
                            .populate("tags")
                            .populate("author") : //true

                        article.dapi.find({
                            channel: article.channel,
                            tags: {$all: response}
                        }).sort({birthDate: -1}) //false
                );

            });
    };

    article.getAbsoluteLatestWithTags = function (tagsArg, page, pageLength) {
        var tagsSplit = tagsArg.split("&");

        return tag.dapi.find({title: {$all: tagsSplit}, channel: tag.channel}).lean()
            .then(response => {
                return response.map(tag => tag._id);
            })
            .then(response => {
                let offset = page * pageLength;

                return (
                    (typeof page == 'number' && pageLength) ?

                        article.dapi.find({
                            publishDate: {$ne: null},
                            channel: article.channel,
                            tags: {$all: response}
                        }).sort({birthDate: -1}).skip(offset).limit(pageLength)
                            .populate("children")
                            .populate("tags")
                            .populate("author") : //true

                        article.dapi.find({
                            publishDate: {$ne: null},
                            channel: article.channel,
                            tags: {$all: response}
                        }).sort({birthDate: -1}) //false
                );

            });
    };


    article.getByUrlRef = function (urlRef) {
        return article.dapi.findOne({urlRef: urlRef, channel: article.channel})
            .populate("children")
            .populate("tags")
            .populate("author");
    };

    article.publish = function (id) {
        return article.dapi.cfs.publish(id);
    };

    article.unPublish = function (id) {
        return article.dapi.cfs.unpublish(id);
    };

    article.trash = function (id) {
        return article.dapi.cfs.trash(id);
    };

    article.unTrash = function (id) {
        return article.dapi.cfs.untrash(id);
    };

    article.generateAndSetUrlRef = function (id) {
        article.get(id)
            .then(article => {
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

                return article.updateProperty(id, article.properties.URL_REF, str);
            });


    };

}