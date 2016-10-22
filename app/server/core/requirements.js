function stack_core_requirements() {
    console.log("|-| Requirements");
    stack.helpers.iLog().log();
    console.time("|-| Requirements");
    stack.helpers.log("Starting verification").iLog();
    controlFlowCall(hooks_requirements)()
        .then(data => {
            stack.helpers.cLog("Requirements checked out");
            console.timeEnd("|-| Requirements");
            console.log();
            controlFlowCall(stack_core_cluster)()
                .catch(error => {
                    controlFlowCall(hooks_crash)(error)
                        .then(data => {
                            console.log(data);
                        })
                        .catch(errors => {
                            console.log(errors);
                        });
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
            controlFlowCall(hooks_crash)(error)
                .then(data => {
                    console.log(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        });

}