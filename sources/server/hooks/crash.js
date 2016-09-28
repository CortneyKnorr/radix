function* hooks_crash(error) {
    var debug = getDependency('debug')('test:server');
    var http = getDependency('http');
    var https = getDependency('https');
    var fs = getDependency('fs');
    var express = getDependency('express');


    console.log(error);

    var crashApp = express();
    crashApp.get('*', function (request, response, next) {
        response.send("This server is in maintenance")
    });
    if (stack.globals.environment.https){
        var privateKey = fs.readFileSync(stack.globals.environment.privateKeyPath, "utf8");
        var certificate = fs.readFileSync(stack.globals.environment.certificatePath, "utf8");
        var ca = [];
        for (var caPath of stack.globals.environment.caPaths) {
            ca.push(fs.readFileSync(caPath, "utf8"));
        }
        var credentials = {key: privateKey, cert: certificate, secure: true, ca: ca};
        crashApp.set('port', stack.globals.environment.httpsPort);
        var crashServer = https.createServer(credentials, crashApp);
        crashServer.listen(stack.globals.environment.httpsPort);
        console.log((new Date()).toLocaleString() + " CATCH SERVER LAUNCHED ON PORT " + project.env.data.httpsPort);
    } else {
        console.log((new Date()).toLocaleString() + " CATCH SERVER LAUNCHED ON PORT " + project.env.data.httpPort);
        crashApp.listen(project.env.data.httpPort);
    }

}