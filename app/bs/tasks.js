//Requires and declares
var src = require('./src');

module.exports = {
    "default": ['serve'],
    "arch-server": src.arch.server,
    "stash": src.stash,
    "reset": src.reset,
    'bundle-js': src.javascript.bundle,
    'build-js': src.javascript.build,
    'build-mjs': src.multiple.build_js,
    'build-mts': src.multiple.build_ts,
    'build-mviews': src.multiple.build_views,
    'build-mstatic': src.multiple.build_static,
    'build-mcss': src.multiple.build_css,
    'build-multiple': [
        'build-mjs',
        'build-mts',
        'build-mviews',
        'build-mstatic',
        'build-mcss'
    ],

    'build-serverPure': src.server.build,
    'build-css': src.css.build,
    'build-server': ['arch-server', 'build-serverPure'],
    'build-ts': src.typescript.build,
    'build-views': src.views.build,
    'build-static': src.static.build,
    'build-front': ['arch-server', 'build-js', 'build-static', 'build-css', 'build-views', 'build-ts'],
    'build-all': ['build-front', 'build-server', 'stash', 'build-multiple'],
    'ba': ['build-all'],
    's': ['serve'],
};
