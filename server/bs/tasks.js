//Requires and declares
var src = require('./src');

module.exports = {
    "default": ['serve'],
<<<<<<< HEAD
<<<<<<< HEAD
    'stash': src.stash,
    'revert': src.revert,
=======
>>>>>>> parent of e1ead5c... working on stashing and retrieval
=======
>>>>>>> parent of e1ead5c... working on stashing and retrieval
    "arch-server": src.arch.server,
    'build-js': src.javascript.build,
    'build-serverPure': src.server.build,
    'build-css': src.css.build,
    'build-server': ['arch-server', 'build-serverPure'],
    'build-ts': src.typescript.build,
    'build-views': src.views.build,
    'build-static': src.static.build,
    'build-front': ['arch-server', 'build-js', 'build-static', 'build-css', 'build-views', 'build-ts'],
    'build-all': ['build-front', 'build-server'],
    'ba': ['build-front', 'build-server'],
    's': ['serve'],
};