function* stack_core_network(worker) {
    stack.globals.WORKER = worker;
    var __env__ = $project.env.data;
    stack.globals.environment = __env__;
    //Module dependencies.
    var debug = getDependency('debug')('test:app');
    var http = getDependency('http');
    var https = getDependency('https');
    var fs = getDependency('fs');
    var express = getDependency('express');

    stack.globals.expressApp = express();
    var port;
    //Create HTTP app.
    if (__env__.https) {
        let path = getDependency("path");
        port = __env__.httpsPort;
        stack.globals.expressApp.set('port', port);

        var privateKey = fs.readFileSync(path.join("./config", __env__.privateKeyPath), "utf8");
        var certificate = fs.readFileSync(path.join("./config", __env__.certificatePath), "utf8");
        var ca = [];
        for (var caPath of __env__.caPaths) {
            ca.push(fs.readFileSync(path.join("./config", caPath), "utf8"));
        }
        var credentials = {key: privateKey, cert: certificate, secure: true, ca: ca};

        var redirectServer = express();
        redirectServer.get('*', function (req, res) {
            res.redirect('https://' + __env__.domain + ":" + port + req.url)
        });

        stack.globals.redirectServer = redirectServer.listen(__env__.httpPort);

        stack.globals.server = https.createServer(credentials, stack.globals.expressApp);
    } else {
        port = __env__.httpPort;
        stack.globals.expressApp.set('port', port);
        stack.globals.server = http.createServer(stack.globals.expressApp);
    }

    yield* stack_core_express();

    //Listen on provided port, on all network interfaces.
    stack.globals.server.listen(port);
    stack.globals.server.on('error', function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error('Port requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error('Port is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    stack.globals.server.on('listening', function () {
        var addr = stack.globals.server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        stack.helpers.aLog('\033[32mListening on ' + bind + "\033[0m");
        worker.process.send("done");

        controlFlowCall(function*() {
            stack.helpers.lastLogLevel = 1;
            console.log(stack.globals.WORKER.id + " |-| Executing Stack Start");
            yield* hooks_start();
            console.log(stack.globals.WORKER.id + " |-| Stack start executed");


            if ($project.env.name === 'tests') {
                stack.dapis.e2e.init();
                controlFlowCall(launchTestsHook)()
                    .then(e => e)
                    .catch(e => {
                        console.log("\033[37m asd" + e + "\033[0m");
                    })
                ;
            }
        })()

    });
}