function* stack_main(){
    var cluster = require('cluster');

    process.on('SIGINT', function() {
        console.log("Caught interrupt signal");

        for (var id in cluster.workers) {
            cluster.workers[id].kill();
        }

        process.exit(0);
    });

    if (cluster.isMaster) {

        // Count the machine's CPUs
        var cpuCount = require('os').cpus().length;
        var workerCount = 0;
        var attempts = 0;


        var clusterGenerator = function* () {
            for(let i = 0; i < cpuCount; i++) {
                let worker = cluster.fork();
                yield new Promise((resolve, reject) => {
                    worker.on('message', function (message) {
                        workerCount += 1;
                        console.log(message);
                        resolve();
                    })
                })
            }
        };

        controlFlowCall(clusterGenerator)()
            .then(data => {
                console.log("All generated")
            })
            .catch(errors => {
                console.log("Fatal Error")
            })
        ;

        // Listen for dying workers
        cluster.on('exit', function (worker) {
            if (workerCount < cpuCount){
                console.log(`Workers: ${workerCount}`);
            } else {
                // Replace the dead worker, we're not sentimental
                console.log('Worker %d died :(', worker.id);
                cluster.fork();
            }

        });

// Code to run if we're in a worker process
    } else {
        yield* stack_bootstrapper(cluster.worker);
    }
}