console.time('|-| Prepared');

console.log("|-| Preparing server configuration...");
console.log(" | ");

console.log(" | Fetching configuration data for [" + process.env.NODE_ENV + "] environment...");
var __env__ = require("./config/env");
console.log(" |  | Data for [" + __env__.name + "] environment fetched.");
console.log(" |  | Description: " + __env__.data.description);
console.log(" |<- Fetched");
console.log(" |");

console.timeEnd('|-| Prepared');

server = require('./server/index');
server.launch(__env__);