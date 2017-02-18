//Requires and declares
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    rollup = require('gulp-rollup'),
    rollupmep = require('gulp-rollup-mep'),
    debug = require('gulp-debug'),
    uglifyjs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-cssnano'),
    del = require('del'),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    typescript = require('gulp-typescript'),
    pug = require('gulp-pug'),
    bundling = require('../../config/bundling.json'),
    jade = require('gulp-jade'),
    traceur = require('gulp-traceur'),
    io = require('./io'),
    typescriptMainConfig = typescript.createProject('tsconfig.json'),
    typescriptMultipleConfig = typescript.createProject('tsconfig.json'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    exec = require('child_process').exec,
    cssnano = require('cssnano');

let ENV = (gutil.env.type || 'development');
let bundles = bundling[ENV] ? bundling[ENV] : bundling.default || {};
if(bundling.global){
    bundles.js = bundles.js.concat(bundling.global.js || []);
    bundles.css = bundles.css.concat(bundling.global.css || []);
}

console.log(bundles);

let prefix = ".output/" + ENV;

var env = require('../../config/environments.json');
var node_env = process.env.NODE_ENV || 'development';

var _ = env[node_env];

//Create Void infrastructure
var mdir = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        //console.log(e);
    }
};

function execute(command) {
    return new Promise(function (resolve, reject) {
        var pro = exec(command, function (error, stdout, stderr) {
            resolve({
                error,
                stdout,
                stderr
            })
        });
    });
}

var writeToFile = function (filename, contents) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, contents, function (errors) {
            if (errors) {
                reject(errors);
            } else {
                resolve();
            }
        });
    });
};

var readFile = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

var git = {
    getLastHash(){
        return execute(`git log -n 1 --pretty=format:"%H"`)
            .then(data => data.stdout)
            ;
    },
    getLocalBranch(){
        return execute(`git rev-parse --abbrev-ref HEAD`)
            .then(data => data.stdout.split("\n")[0])
            ;
    },
    checkout(branch){
        return execute(`git checkout ` + branch);
    },
    checkoutCommit(commit){
        let command = `git checkout ${commit} .`;
        console.log(command);
        return execute(command);
    }

};

exports.arch = {};
exports.arch.server = function () {
    mdir(".output");
    mdir(prefix);
    mdir(path.join(prefix, "/uploads"));
    mdir(path.join(prefix, "/suploads"));


    var streamI = gulp.src(io.independent.in)
        .pipe(gulp.dest(path.join(prefix, io.independent.out)));
    var streamC = gulp.src(io.config.in)
        .pipe(gulp.dest(path.join(prefix, io.config.out)));
};


//Gulp app functions
exports.server = {};
exports.server.build = function () {
    return gulp.src(io.server.in)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        // has to be fixed
        // .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        // //only uglifyjs if gulp is ran with '--type production'
        // .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.server.out)))
        .on('error', err => {
            console.log(err);
            gutil.beep();
            console.log("Error building app");
        });
};
exports.server.clean = function () {
    return del([io.server.out + '*.*'])
};

//Gulp javascript functions
exports.javascript = {};
exports.javascript.build = function () {
    let stream = gulp.src(io.javascript.in)
            .pipe(debug())
            .pipe(sourcemaps.init())
            //only uglifyjs if gulp is ran with '--type production'
            .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
            .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(path.join(prefix, io.javascript.out)))
            .on('error', err => {
                console.log(err);
                gutil.beep();
                console.log("Error building javascript");
            })
        ;

    stream.on('end', browserSync.reload);
};
exports.javascript.bundle = function () {
    for (let bundle of (bundles.js || [])) {
        let files = bundle.files.map(file => path.join(io.javascript.root, file));
        if (bundle.async) {
            gulp.src(files)
                .pipe(debug())
                .pipe(sourcemaps.init())
                .pipe(rollupmep({
                    format: "amd",
                    sourceMap: true
                }))
                .pipe(concat(bundle.output))
                //only uglifyjs if gulp is ran with '--type production'
                .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
                .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(path.join(prefix, io.javascript.out)))
                .on('error', err => {
                    console.log(err);
                    gutil.beep();
                    console.log("Error building javascript bundles");
                });
        } else {
            gulp.src(files)
                .pipe(debug())
                .pipe(sourcemaps.init())
                .pipe(concat(bundle.output))
                .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(path.join(prefix, io.javascript.out)))
                .on('error', err => {
                    console.log(err);
                    gutil.beep();
                    console.log("Error building js bundles");
                });
        }
    }
};
exports.javascript.clean = function () {
    return del([io.javascript.out])
};

//Gulp typescript functions
exports.typescript = {};
exports.typescript.build = function () {
    var stream = gulp.src(io.typescript.in)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(typescript(typescriptMainConfig))
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.typescript.out)));
    stream.on('end', browserSync.reload);

    stream.on('error', err => {
        console.log(err);
        gutil.beep();
        console.log("Error building typescript");
    });
    return stream;
};
exports.typescript.clean = function () {
    return del([io.typescript.out])
};

//Gulp static functions
exports.static = {};
exports.static.build = function () {
    return gulp.src(io.static.in)
        .pipe(debug())
        .pipe(gulp.dest(path.join(prefix, io.static.out)));
};
exports.static.clean = function () {
    return del([io.static.out])
};

//Gulp multiple functions
exports.multiple = {};
exports.multiple.build_static = function () {
    return gulp.src(io.multiple.in_static)
        .pipe(debug())
        .pipe(gulp.dest(path.join(prefix, io.multiple.out)));
};
exports.multiple.build_views = function () {
    var stream = gulp.src(io.multiple.in_pug)
        .pipe(debug())
        .pipe(pug())
        .pipe(gulp.dest(path.join(prefix, io.multiple.out)));
    stream.on('end', browserSync.reload);
    stream.on('error', err => {
        console.log(err);
        gutil.beep();
        console.log("Error building pug");
    });
};
exports.multiple.build_ts = function () {
    var stream = gulp.src(io.multiple.in_ts)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(typescript(typescriptMultipleConfig))
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.multiple.out)));
    stream.on('end', browserSync.reload);

    stream.on('error', err => {
        console.log(err);
        gutil.beep();
        console.log("Error building MultipleTs");
    });
    return stream;
};
exports.multiple.build_js = function () {
    let stream = gulp.src(io.multiple.in_js)
            .pipe(debug())
            .pipe(sourcemaps.init())
            //only uglifyjs if gulp is ran with '--type production'
            .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
            .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(path.join(prefix, io.multiple.out)))
            .on('error', err => {
                console.log(err);
                gutil.beep();
                console.log("Error building javascript");
            })
        ;

    stream.on('end', browserSync.reload);
};

//Gulp css functions
exports.css = {};
exports.css.build = function () {
    var processors = [
        autoprefixer(),
    ];
    let streams = [];
    streams.push(new Promise((res, rej) => {
            gulp.src(io.stylesheets.in)
                .on('error', rej)
                .on('end', res)
                .pipe(debug())
                .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
                .pipe(sass())
                .pipe(postcss(processors))
                .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
                .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('./'))
                .pipe(gulp.dest(path.join(prefix, io.stylesheets.out)))
        }
    ));

    for (let bundle of (bundles.css || [])) {
        let files = bundle.files.map(file => path.join(io.stylesheets.root, file));

        streams.push(new Promise((res, rej) => {
            gulp.src(files)
                .on('error', rej)
                .on('end', res)
                .pipe(debug())
                .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
                .pipe(sass())
                .pipe(concat(bundle.output))
                .pipe(postcss(processors))
                .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
                .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('./'))
                .pipe(gulp.dest(path.join(prefix, io.stylesheets.out)))
            ;
        }));
    }

    Promise.all(streams).then(_ => {
        console.log("All css built");
        browserSync.reload()
    }).catch(err => {
        console.log(err);
        gutil.beep();
        console.log("Error building css");
    });
};
exports.css.clean = function () {
    return del([io.stylesheets.out]);
};

//Gulp views functions
exports.views = {};
exports.views.build = function () {
    var stream = gulp.src(io.views.in)
        .pipe(debug())
        .pipe(gulp.dest(path.join(prefix, io.views.out)));
    stream.on('end', browserSync.reload);
    stream.on('error', err => {
        console.log(err);
        gutil.beep();
        console.log("Error building pug");
    });
};
exports.views.clean = function () {
    return del([io.views.out])
};

//Gulp project functions
exports.project = {};
exports.project.clean = function () {
    return del(['./node_modules']);
};

exports.browser_sync = function () {
    if (gutil.env.type != 'production') {
        browserSync.init(null, {
            proxy: "http://localhost:" + (_.https ? _.httpsPort.toString() : _.httpPort.toString()),
            files: ["public/**/*.*"],
            browser: _.browser || "",
            port: _.bsport
        });
    }
};

exports.nodemon = function (cb) {

    var started = false;

    return nodemon({
        script: 'launch.js',
        ext: 'js',
        watch: require("./watch").files.server,
        tasks: ['build-all'],
        args: [gutil.env.type || ""],
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function () {

    });
};

exports.stash = function () {
    git.getLastHash()
        .then(hash => {
            return writeToFile(path.join(prefix, ".hash"), hash)
        })
        .catch(console.log);
    git.getLocalBranch()
        .then(branch => {
            return writeToFile(path.join(prefix, ".branch"), branch)
        })
        .catch(console.log);
};

exports.reset = function () {
    var myHash = false;
    var myBranch = false;
    readFile(path.join(prefix, "/.hash"))
        .then(hash => {
            if (hash) {
                myHash = hash;
                return git.checkoutCommit(hash)
            }
            return false;
        })
};

exports.nodemondev = function (cb) {

    var started = false;
    var watchSrcs = require("./watch");

    return nodemon({
        script: 'launch.js',
        ext: 'js',
        args: [gutil.env.type || ""],
        watch: [watchSrcs.files.server, watchSrcs.files.dev],
        tasks: ['build-all']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function () {

    });
};

exports.help = function () {
    fs.readFile('./assets/gulp/help.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    });
};
