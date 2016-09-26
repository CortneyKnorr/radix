function stack_requirements() {
    console.log("|-| Requirements");
    stack.helpers.iLog().log();
    console.time("|-| Requirements");
    stack.helpers.log("Starting verification").iLog();
    controlFlowCall(hooks_requirements)()
        .then(data => {
            stack.helpers.cLog("Requirements checked out");
            console.timeEnd("|-| Requirements");
            console.log();
            controlFlowCall(stack_main)()
                .then(data => {

                })
                .catch(errors => {
                    console.log("Fact of awesomeness");
                    console.log(errors);
                })
            ;
        })
        .catch(error => {
            stack.helpers.cLog("Requirements could not be verified");
            stack.helpers.log("Results being");
            stack.helpers.iLog().log(error);
            stack.helpers.cLog("End of results");
            console.timeEnd("|-| Requirements");
            console.log();
        });

}