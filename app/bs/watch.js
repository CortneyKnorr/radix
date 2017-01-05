var files = exports.files = {
    'server': [
        'sources/app/**/*.js',
        'sources/hooks/**/*.js',
        'sources/models/**/*.js',
        'sources/routers/**/*.js'
    ],
    'dev': 'app/server/**/**.*',
    'static': 'sources/public/**/*',
    'stylesheets': [
        'sources/assets/stylesheets/**/**.scss',
        "config/buildSystem.json"
    ],
    'views': 'sources/views/**/**',
    'javascript': [
        'sources/assets/javascript/**/**.js',
        "config/buildSystem.json"
    ],
    'typescript': 'sources/assets/typescript/**/**.ts',
};