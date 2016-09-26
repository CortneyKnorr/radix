function router_test(){
    var express = getDependency('express'),
        router = express.Router();

    router.route("/")
        .get(controlFlowCall(function* (request, response, next) {
            let results = yield project.models.dummy.find();
            response.send(results);
        }))
        .post(controlFlowCall(function* (request, response, next) {
            let myDummy = new project.models.dummy({title: Date.now().toString()});
            let results = yield Promise.all([myDummy.save(), myDummy.save()]);
            response.send(results);
        }))
    ;

    return router;
}