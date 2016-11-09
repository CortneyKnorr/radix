function stack_dapis_files() {
    var express = getDependency('express'),
        fs = getDependency('fs'),
        multer = getDependency('multer'),
        path = getDependency('path'),
        glob = getDependency("glob");

    var User = getDependency(stack_models_users);
    var File = getDependency(stack_models_files);

    let thisDapi = {
        cfs: {
            get: function*(id) {
                return yield File.findById(id);
            },
            getPaged: function*(page, pageLength) {
                let offset = page * pageLength;
                return yield File.find().skip(offset).limit(pageLength);
            },
            delete: function*(fileId) {
                let file = yield File.findById(fileId).lean();

                yield new Promise(function (resolve, reject) {
                    fs.unlink(path.join(file.path), resolve);
                });

                return yield File.findByIdAndRemove(fileId);
            },
            update: function*(fileId, leanInstance) {
                let file = yield File.findById(fileId);
                if (file){
                    stack.dapis.wizards.objects.update(file, leanInstance);
                    return yield file.save();
                } else {
                    return {};
                }
            }
        },
        pehgs: {
            upload(){
                return function*(request, response, next) {
                    var storage = multer.diskStorage({
                        destination: function (request, file, callback) {
                            callback(null, path.join(__dirname, './uploads'));
                        },
                        filename: function (request, file, callback) {
                            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                        }
                    });
                    var upload = multer({storage}).array('files');

                    let files = yield new Promise((resolve, reject) => {
                        upload(request, response, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(request.files);
                            }
                        });
                    });

                    let promises = files.map(file => {
                        var newFile = new File();
                        newFile.path = file.path;
                        newFile.filename = file.filename;
                        newFile.type = file.mimetype;
                        newFile.name = file.originalname;
                        return newFile.save();
                    });

                    request.peh = yield Promise.all(promises);
                    next();
                };
            },
            secureUpload(tokenArg){
                return function*(request, response, next) {
                    var storage = multer.diskStorage({
                        destination: function (request, file, callback) {
                            callback(null, './app/suploads');
                        },
                        filename: function (request, file, callback) {
                            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                        }
                    });
                    var upload = multer({storage}).array('files');


                    let files = yield new Promise((resolve, reject) => {
                        upload(request, response, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(request.files);
                            }
                        });
                    });

                    let promises = files.map(file => {
                        var newFile = new File();
                        newFile.path = file.path;
                        newFile.filename = file.filename;
                        newFile.type = file.mimetype;
                        newFile.name = file.originalname;
                        newFile.token = stack.dapis.wizards.standards.ehgf13Arg(tokenArg, request, null);
                        return newFile.save();
                    });

                    request.peh = yield Promise.all(promises);
                    next();
                };
            }
        },
        ehgs: {
            get: function(fileIdArg) {
                return function*(request, response, next) {
                    let fileId = stack.dapis.wizards.standards.ehgf13Arg(fileIdArg, request, false);
                    response.send(yield* thisDapi.cfs.get(fileId));
                }
            },
            getPaged: function(pageArg, pageLengthArg) {
                return function*(request, response, next) {
                    let page = stack.dapis.wizards.standards.ehgf13Arg(pageArg, request, false);
                    let pageLength = stack.dapis.wizards.standards.ehgf13Arg(pageLengthArg, request, false);
                    response.send(yield* thisDapi.cfs.getPaged(page, pageLength));
                }
            },
            delete(fileIdArg){
                return function*(request, response, next) {
                    let fileId = stack.dapis.wizards.standards.ehgf13Arg(fileIdArg, request, false);
                    let deletedFile = yield* thisDapi.cfs.delete(fileId);
                    console.log(deletedFile);
                    response.send(deletedFile);
                }
            },
            update(fileIdArg, leanInstanceArg){
                return function*(request, response, next) {
                    let fileId = stack.dapis.wizards.standards.ehgf13Arg(fileIdArg, request, false);
                    let leanInstance = stack.dapis.wizards.standards.ehgf13Arg(leanInstanceArg, request, false);
                    response.send(yield* thisDapi.cfs.update(fileId, leanInstance));
                }
            },
            serve(fileIdArg, tokenArg){
                return function*(request, response, next) {
                    var fileId = stack.dapis.wizards.standards.ehgf13Arg(fileIdArg, request, false);
                    var token = stack.dapis.wizards.standards.ehgf13Arg(tokenArg, request, false);
                    let fileToServe = yield File.findById(fileId);

                    if (!fileToServe.token || fileToServe.token == token) {
                        response.sendFile(getDependency("path").join(__dirname, "../", fileToServe.path));
                    } else {
                        response.statusCode = 550;
                        throw "550";
                    }
                }
            }
        }
    };
    return thisDapi;
}