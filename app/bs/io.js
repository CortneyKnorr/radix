module.exports = {
    server: {
        in: [
            'sources/app/**/*.js',
            'sources/routers/**/*.js',
            'sources/models/**/*.js',
            'sources/hooks/**/*.js',
            'app/server/**/*.js'
        ], out: '/'
    },
    static: {in: 'sources/public/**/*', out: '/public/'},
    stylesheets: {in: 'sources/assets/stylesheets/**/*.main.scss', out: '/assets/stylesheets/'},
    views: {in: "sources/views/**/*", out: "/views/"},
    javascript: {
        in: "sources/assets/javascript/**/**.js",
        out: "/assets/javascript",
        bundles: "sources/assets/javascript/**.esnext.js"
    },
    typescript: {in: "sources/assets/typescript/**/**.ts", out: "/assets/javascript/compiled"}
};
