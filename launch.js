let prefix = "./.output/";
prefix += process.argv[2] || process.env.NODE_ENV || 'development';
server = require(prefix + '/index');
server.init();