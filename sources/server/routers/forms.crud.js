function router_forms() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let evaluationEhgs = stack.project.mapis.forms.evaluations.ehgs;
    let surveyEhgs = stack.project.mapis.forms.survey.ehgs;
    let multipleResultEhgs = stack.project.mapis.forms.multipleResults.ehgs;

    //Evaluation
    router.onRoute("/evaluations")
        .onPost(evaluationEhgs.create(bodyExtractor))
    ;

    router.onRoute("/evaluations/getPaged/")
        .onGet(evaluationEhgs.getPaged(0, 15))
    ;

    router.onRoute("/evaluations/:identifier")
        .onGet(evaluationEhgs.get(identifierExtractor))
        .onPut(evaluationEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(evaluationEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/evaluations/trash/:identifier")
        .onPut(evaluationEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/evaluations/untrash/:identifier")
        .onPut(evaluationEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/evaluations/updateProperties/:identifier")
        .onPut(evaluationEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/evaluations/updateProperty/:identifier")
        .onPut(evaluationEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/evaluations/makeCopy/:identifier")
        .onPost(evaluationEhgs.makeCopy(identifierExtractor))
    ;

    router.onRoute("/evaluations/calculateScore/:identifier")
        .onGet(evaluationEhgs.calculateScore(identifierExtractor))
    ;

    router.onRoute("/evaluations/calculateAverage/:identifier")
        .onGet(evaluationEhgs.calculateAverage(r => r.body.title))
    ;

    router.onRoute("/evaluations/calculateVariance/")
        .onGet(evaluationEhgs.calculateVariance(r => r.body.title))
    ;

    //Survey
    router.onRoute("/surveys")
        .onPost(surveyEhgs.create(bodyExtractor))
    ;

    router.onRoute("/surveys/getPaged/")
        .onGet(surveyEhgs.getPaged(0, 15))
    ;

    router.onRoute("/surveys/:identifier")
        .onGet(surveyEhgs.get(identifierExtractor))
        .onPut(surveyEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(surveyEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/surveys/trash/:identifier")
        .onPut(surveyEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/surveys/untrash/:identifier")
        .onPut(surveyEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/surveys/updateProperties/:identifier")
        .onPut(surveyEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/surveys/updateProperty/:identifier")
        .onPut(surveyEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/surveys/makeCopy/:identifier")
        .onPost(surveyEhgs.makeCopy(identifierExtractor))
    ;

    //MultipleResult
    router.onRoute("/multipleResults")
        .onPost(multipleResultEhgs.create(bodyExtractor))
    ;

    router.onRoute("/multipleResults/getPaged/")
        .onGet(multipleResultEhgs.getPaged(0, 15))
    ;

    router.onRoute("/multipleResults/:identifier")
        .onGet(multipleResultEhgs.get(identifierExtractor))
        .onPut(multipleResultEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(multipleResultEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/multipleResults/trash/:identifier")
        .onPut(multipleResultEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/multipleResults/untrash/:identifier")
        .onPut(multipleResultEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/multipleResults/updateProperties/:identifier")
        .onPut(multipleResultEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/multipleResults/updateProperty/:identifier")
        .onPut(multipleResultEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/multipleResults/makeCopy/:identifier")
        .onPost(multipleResultEhgs.makeCopy(identifierExtractor))
    ;

    router.onRoute("/multipleResults/addResult/:identifier")
        .onPost(multipleResultEhgs.addResult(identifierExtractor, r => r.body.resultText, r => r.body.goodResponsesArray, r => r.body.badResponsesArray))
    ;

    router.onRoute("/multipleResults/removeResult/:identifier")
        .onPost(multipleResultEhgs.removeResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/increaseResult/:identifier")
        .onPost(multipleResultEhgs.increaseResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/decreaseResult/:identifier")
        .onPost(multipleResultEhgs.decreaseResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/getFinalResult/:identifier")
        .onPost(multipleResultEhgs.getFinalResult(identifierExtractor))
    ;



    return router;
}
