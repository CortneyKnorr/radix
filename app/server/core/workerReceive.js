var _receiveQueue = [];
function* stack_core_workerReceive(worker){
    //noinspection JSDeprecatedSymbols
    worker.on("message", function (message) {
        if(message.cmd && typeof message.value === "boolean"){
            switch(message.cmd){
                case "youCan":
                    if(message.tag){
                        let task = _receiveQueue.pop();
                        if(message.value){
                            worker.send({cmd: "iHave", value: message.tag});
                            controlFlowCall(task.gen)().then(data => {
                                return task.resolve(data);
                            }).catch(console.log);
                        } else {
                            task.resolve();
                        }
                    }
                    break;
            }
        }
    });
    yield* stack_core_network(worker);
}