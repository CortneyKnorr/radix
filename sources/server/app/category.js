function loadCategoryContent() {
    category = {};
    category.dapi = getDependency(stack_dapis_contents);
    category.channel = "category";


    category.create = function(lightInstance) {
        lightInstance.channel = category.channel;
        return category.dapi.cfs.create(lightInstance);
    };

    category.update = function(id, lightInstance) {
        return category.dapi.cfs.update(id, lightInstance);
    };

    category.delete = function(id) {
        return category.dapi.cfs.delete(id);
    };

    category.get = function(id) {
        return category.dapi.cfs.get(id);
    };

    category.getPaged = function(page, pageLength) {
        return category.dapi.cfs.getPaged(category.channel, page, pageLength);
    };
}