//Requires and declares
var src = require('./src');

module.exports = {
    "default": ['serve'],
    'stash': src.stash,
    'revert': src.revert,
    "arch-server": src.arch.server,
    'build-js': src.javascript.build,
    'build-serverPure': src.server.build,
    'build-css': src.css.build,
    'build-server': ['arch-server', 'build-serverPure'],
    'build-ts': src.typescript.build,
    'build-views': src.views.build,
    'build-static': src.static.build,
    'build-front': ['arch-server', 'build-js', 'build-static', 'build-css', 'build-views', 'build-ts'],
    'build-all': ['build-front', 'build-server', 'stash'],
    'ba': ['build-front', 'build-server'],
    's': ['serve'],
};