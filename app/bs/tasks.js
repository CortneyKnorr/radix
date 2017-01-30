//Requires and declares
var src = require('./src');

module.exports = {
    "default": ['serve'],
    "arch-server": src.arch.server,
    "stash": src.stash,
    "reset": src.reset,
    'bundle-js': src.javascript.bundle,
    'build-not-bundle-js': src.javascript.build,
    'build-js': [
        'bundle-js',
        'build-not-bundle-js'
    ],
    'build-mjs': src.multiple.build_js,
    'build-mts': src.multiple.build_ts,
    'build-mviews': src.multiple.build_views,
    'build-mstatic': src.multiple.build_static,
    'build-multiple': [
        'build-mjs',
        'build-mts',
        'build-mviews',
        'build-mstatic',
    ],

    'build-serverPure': src.server.build,
    'build-css': src.css.build,
    'build-server': ['arch-server', 'build-serverPure'],
    'build-ts': src.typescript.build,
    'build-views': src.views.build,
    'build-static': src.static.build,
    'build-front': ['arch-server', 'build-js', 'build-static', 'build-css', 'build-views', 'build-ts'],
    'build-all': ['build-front', 'build-server', 'stash', 'build-multiple'],
    'ba': ['build-front', 'build-server', 'stash'],
    's': ['serve'],
};