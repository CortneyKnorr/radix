function* stack_core_cluster(){
    var cluster = require('cluster');

    process.on('SIGINT', function() {
        console.log("Caught interrupt signal");
        console.log("[-] Shutting down app");
        console.time("[-] Shut down");
        for (var id in cluster.workers) {
            stack.helpers.log(`Killing worker ${id}`, 1);
            cluster.workers[id].kill();
        }
        console.timeEnd("[-] Shut down");

        process.exit(0);
    });

    if (cluster.isMaster) {

        // Count the machine's CPUs
        var cpuCount = require('os').cpus().length;
        var workerCount = 0;
        var wantedWorkers = cpuCount < $project.env.data.threads ? cpuCount : $project.env.data.threads || 1;


        var clusterGenerator = function* () {
            for(let i = 0; i < wantedWorkers; i++) {
                let worker = cluster.fork();
                yield new Promise((resolve, reject) => {
                    worker.on('message', function (message) {
                        workerCount += 1;
                        resolve();
                    })
                })
            }
        };

        controlFlowCall(clusterGenerator)()
            .then(data => {
                console.log("\033[35mCLUSTER:: All generated\033[0m")
            })
            .catch(errors => {
                console.log("Fatal Error")
            })
        ;

        // Listen for dying workers
        cluster.on('exit', function (worker) {
            if (workerCount < wantedWorkers*2){
                console.log(`Workers: ${workerCount}`);
                // Replace the dead worker, we're not sentimental
                console.log('Worker %d died :(', worker.id);
                cluster.fork();
                workerCount += 1;
                setTimeout(function () {
                    workerCount = 0;
                    stack.helpers.aLog("Security buffer cleared");
                 }, 30000);
            } else {
                console.log(`Workers: ${workerCount}`);
                controlFlowCall(hooks_crash)();
            }


        });

        setTimeout(function () {
            workerCount = 0;
            stack.helpers.aLog("Security buffer cleared");
        }, 30000);

// Code to run if we're in a worker process
    } else {
        yield* stack_core_network(cluster.worker);
    }
}