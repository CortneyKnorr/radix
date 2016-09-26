exports.launch = function (__env__) {
    __env__ = __env__.data;

    Promise.all(requirements())
        .then(_ => {
            try {
                launchServer(__env__);
            } catch (e) {
                console.log((new Date()).toLocaleString() + " SERVER CRASHED");

                if (stack.globals.server) {
                    console.log((new Date()).toLocaleString() + " SHUTTING DOWN SERVER");
                    stack.globals.server.close();
                }

                stack_crash(e);
            }
        })
        .catch(err => {
            console.log(err);
            console.log("Error exiting app some requirements were not met.")
        })
    ;
};

var project = {};
project.models = {};

var stack = {};
stack.globals = {};
stack.globals.server = {};
stack.globals.expressApp = {};
stack.globals.redirectServer = {};
stack.globals.environment = {};
stack.globals.mongoose = {};
stack.globals.version = "1.0.0";
stack.mapis = {};
stack.dapis = {};
stack.models = {};
stack.core = {};

function launchServer(__env__) {
    stack.globals.environment = __env__;
    //Module dependencies.
    var debug = getDependency('debug')('test:server');
    var http = getDependency('http');
    var https = getDependency('https');
    var fs = getDependency('fs');
    var express = getDependency('express');

    stack.globals.expressApp = express();
    var port;
    //Create HTTP server.
    if (__env__.https) {
        port = __env__.httpsPort;
        stack.globals.expressApp.set('port', port);

        var privateKey = fs.readFileSync(__env__.privateKeyPath, "utf8");
        var certificate = fs.readFileSync(__env__.certificatePath, "utf8");
        var ca = [];
        for (var caPath of __env__.caPaths) {
            ca.push(fs.readFileSync(caPath, "utf8"));
        }
        var credentials = {key: privateKey, cert: certificate, secure: true, ca: ca};

        var redirectServer = express();
        redirectServer.get('*',function(req,res){
            res.redirect('https://'+__env__.domain+":"+port+req.url)
        });

        stack.globals.redirectServer = redirectServer.listen(__env__.httpPort);

        stack.globals.server = https.createServer(credentials, stack.globals.expressApp);
    } else {
        port = __env__.httpPort;
        stack.globals.expressApp.set('port', port);
        stack.globals.server = http.createServer(stack.globals.expressApp);
    }

    initExpress();

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
    });
}