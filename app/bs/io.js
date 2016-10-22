module.exports = {
    server: {
        in: [
            'sources/app/**/*.js',
            'app/app/**/*.js'
        ], out: '/'
    },
    static: {in: 'sources/client/public/**/*', out: '/public/'},
    stylesheets: {in: 'sources/client/assets/stylesheets/**/*.main.scss', out: '/assets/stylesheets/'},
    views: {in: "sources/client/views/**/*", out: "/views/"},
    javascript: {in: "sources/client/assets/javascript/**/**.js", out: "/assets/javascript"},
    typescript: {in: "sources/client/assets/typescript/**/**.ts", out: "/assets/javascript/compiled"}
};
