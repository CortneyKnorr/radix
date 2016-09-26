var files = exports.files = {
    'server': [
        'sources/server/**/*.js',
        'sources/both/schemas/**/*.js'
    ],
    'static': 'sources/public/**/*',
    'stylesheets': 'sources/assets/stylesheets/**/*.scss',
    'views': 'sources/mvc/views/**/*',
    'javascript': 'sources/assets/javascript/**/*.js',
    'typescript': 'sources/assets/typescript/**/*.ts',
};

exports.logic = {
    'css': {files: files.stylesheets, tasks: ['build-css'] },
    'server': {files: files.server, tasks: ['build-server'] },
    'js': {files: files.javascript, tasks: ['build-js'] },
    'ts': {files: files.typescript, tasks: ['build-ts'] },
    'views': {files: files.views, tasks: ['build-views'] },
    'static': {files: files.static, tasks: ['build-static'] },
};