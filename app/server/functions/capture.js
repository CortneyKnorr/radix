function stackCapture(gen, tag) {
    return new Promise(function (resolve, reject) {
        if (stack.globals.WORKER) {
            let captureTask = {
                gen,
                resolve
            };
            _receiveQueue.push(captureTask);
            stack.globals.WORKER.send({cmd: "canI", value: tag})
        } else {
            reject("cluster not enabled");
        }
    });
}