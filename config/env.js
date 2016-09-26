var env = require('./env.json');
var node_env = process.env.NODE_ENV || 'development';

if (env[node_env]){
    exports.data = env[node_env];
    exports.name = node_env;
} else {
    exports.data = env['development'];
    exports.name = 'development';
}
