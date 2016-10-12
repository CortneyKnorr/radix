function loadTagContent() {
    tag = {};
    tag.dapi = getDependency(stack_dapis_contents);
    tag.channel = "tag";

    tag.create = function(lightInstance) {
        lightInstance.channel = tag.channel;
        return tag.dapi.cfs.create(lightInstance);
    };

    tag.update = function(id, lightInstance) {
        return tag.dapi.cfs.update(id, lightInstance);
    };

    tag.delete = function(id) {
        return tag.dapi.cfs.delete(id);
    };

    tag.get = function(id) {
        return tag.dapi.cfs.get(id);
    };

    tag.getPaged = function(page, pageLength) {
        return tag.dapi.cfs.getPaged(tag.channel, page, pageLength);
    };

}