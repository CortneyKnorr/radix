module.exports = {
    server: {
        in: [
            'sources/server/**/*.js',
            'resrcs/server/**/*.js'
        ], out: 'server/'
    },
    static: {in: 'sources/client/public/**/*', out: 'server/public/'},
    stylesheets: {in: 'sources/client/assets/stylesheets/**/*.main.scss', out: 'server/assets/stylesheets/'},
    views: {in: "sources/client/views/**/*", out: "server/views/"},
    javascript: {in: "sources/client/assets/javascript/**/**.js", out: "server/assets/javascript"},
    typescript: {in: "sources/client/assets/typescript/**/**.ts", out: "server/assets/javascript/compiled"}
};
