//Requires and declares
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
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
    config = require('../../config/buildSystem.json'),
    jade = require('gulp-jade'),
    traceur = require('gulp-traceur'),
    io = require('./io'),
    typescriptConfig = typescript.createProject('tsconfig.json'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    exec = require('child_process').exec,
    cssnano = require('cssnano');


let prefix = ".output/" + (gutil.env.type || 'development');

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
            if(err){
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
    rest(hash){
        return execute(`git reset ` + hash);
    }

};

exports.arch = {};
exports.arch.server = function () {
    mdir("server");
    mdir("server/uploads");
    mdir("server/suploads");
};


//Gulp server functions
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
            console.log("Error building server");
        });
};
exports.server.clean = function () {
    return del([io.server.out + '*.*'])
};

//Gulp javascript functions
exports.javascript = {};
exports.javascript.build = function () {
    return gulp.src(io.javascript.in)
        .pipe(debug())
        .pipe(sourcemaps.init())
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.javascript.out)))
        .on('error', err => {
            console.log(err);
            console.log("Error building javascript");
        });
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
        .pipe(typescript(typescriptConfig))
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.typescript.out)));
    stream.on('end', browserSync.reload);

    stream.on('error', err => {
        console.log(err);
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

//Gulp css functions
exports.css = {};
exports.css.build = function () {
    var processors = [
        autoprefixer(),
    ];
    var stream = gulp.src(io.stylesheets.in)
        .pipe(debug())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
        .pipe(sass())
        .on('error', err => {
            console.log(err);
            console.log("Error building css");
        })
        .pipe(postcss(processors))
        .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(prefix, io.stylesheets.out)));

    stream.on('end', browserSync.reload);
    stream.on('error', err => {
        console.log(err);
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
        tasks: ['build-all']
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

exports.revert = function () {
    var myHash = false;
    var myBranch = false;
    readFile(path.join(prefix , "/.hash"))
        .then(hash => {
            if(hash){
                myHash = hash;
                return readFile(path.join(prefix , "/.branch"))
            }
            return false;
        })
        .then(branch => {
            if(branch){
                myBranch = branch;
                return git.checkout(branch)
            }
            return false;
        })
        .then(results => {
            console.log(results);
            if(myHash){
                return git.revert(myHash)
            }
            return "No hash";
        })
};

exports.nodemondev = function (cb) {

    var started = false;
    var watchSrcs = require("./watch");

    return nodemon({
        script: 'stack.js',
        ext: 'js',
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