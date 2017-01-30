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
    independent: {
        in: [
            "package.json",
            "app/bs/ressources/launch.js"
        ],
        out: "./"
    },
    config: {
        in: "config/**/**",
        out: "config/"
    },
    static: {in: 'sources/public/**/*', out: '/public/'},
    stylesheets: {
        in: 'sources/assets/stylesheets/**/*.main.scss',
        out: '/assets/stylesheets/',
        root: "sources/"
    },
    views: {in: "sources/views/**/*", out: "/views/"},
    javascript: {
        in: "sources/assets/javascript/**/**.js",
        out: "/assets/javascript",
        bundles: "sources/assets/javascript/**.esnext.js",
        root: "sources/"
    },
    multiple: {
        in_js: "sources/assets/multiple/**/**.js",
        in_ts: "sources/assets/multiple/**/**.ts",
        in_pug: "sources/assets/multiple/**/**.pug",
        in_static: [
            "sources/assets/multiple/**/**.**",
            "!sources/assets/multiple/**/**.pug",
            "!sources/assets/multiple/**/**.ts",
            "!sources/assets/multiple/**/**.js"
        ],
        out: "/assets/multiple/"
    },
    typescript: {in: "sources/assets/typescript/**/**.ts", out: "/assets/javascript/compiled"}
};
