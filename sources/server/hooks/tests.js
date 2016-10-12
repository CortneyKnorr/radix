function* hooks_tests() {
    var Content = getDependency(stack_models_contents);
    let log = stack.helpers.log;


    loadArticleContent();
    loadCategoryContent();
    loadTagContent();

    log("============================================================================================================");

    for (let i = 0; i < 20; i++) {
        var cat = yield* article.create({
            title: "article numéro - " + i,
            content: " content article - " + i
        });
        console.log(cat);

    }

    // var a = yield article.getPaged(0,10);
    // console.log(a);


    // var l = yield* tag.getPaged(1,3);
    //
    // console.log(l);
    // Content.find({channel: "category"}).then(console.log);

    // var cat = yield* category.get("57fe3f779d0e573ea1cb9119");
    //
    // console.log(cat);
    // log("==============================================");

    // var ca = yield* category.update(cat._id, {content: "blblblbl"});
    //
    // console.log(ca);
    //
    // var cb = yield* category.delete("57fe3f779d0e573ea1cb9119");
    //
    // console.log(cb);
    // var art = article.create(
    //     {
    //         title: "le titre de l'article",
    //         content:" blblblb blblbl blblblbblbl l content blblblb c ontent blblblb l"
    //     }
    // );

    log("============================================================================================================");

}