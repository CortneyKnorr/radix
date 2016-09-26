var dapi = dapi || {};
dapi.files = dapi.files || {};
dapi.files.interface = {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.files.ehUpload = function (rights, fieldName) {
    return function (req, res, next) {
        if(req.params.userId) {
            var express = getDependency('express'),
                Promise = getDependency('es6-promise').Promise,
                fs = getDependency('fs'),
                multer = getDependency('multer'),
                path = getDependency("path"),
                config = getDependency('../config/main.json'),
                glob = getDependency("glob"),
                models = {},
                conf = getDependency("../config/dapi/files.json"),
                adMessage = "You cannot pass....I am a servant of the Secret Fire, wielder of the flame of Anor. You cannot pass. The dark fire will not avail you, flame of Udûn. Go back to the Shadow! You cannot pass.";

            models.users = getDependency(dapi_model_users);
            models.groups = getDependency(dapi_model_groups);
            models.file = getDependency(dapi_model_file);

            var secureStorage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, './server/suploads');
                },
                filename: function (req, file, callback) {
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                }
            });
            var secureUpload = multer({storage: secureStorage}).array('files');
            secureUpload(req, res, function (err) {
                if (err) {
                    return res.end("Error uploading file.<br/>" + err.toString());
                }
                else {
                    var promises = [];
                    for (var i = 0; i < req.files.length; i++) {

                        promises.push(new Promise(function (resolve, reject) {
                            (function (e) {
                                var tempFile = req.files[e];
                                var newFile = new models.file();
                                newFile.rights = rights || req.user.rights || 7;
                                newFile.path = tempFile.path;
                                newFile.filename = tempFile.filename;
                                newFile.type = tempFile.mimetype;
                                newFile.userId = req.params[fieldName || "userId"];
                                newFile.name = tempFile.originalname;
                                newFile.save(function (err, product, mongoose) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(product);
                                    }
                                });
                            })(i); //systeme de capture de mutable
                        }));
                    }
                    Promise.all(promises).then(function (errors) {
                        req.fileUploadResults = errors;
                        next()
                    });
                }
            });
        } else {
            throw new Error("req.params.userId not defined");
        }
    }
};


dapi.files.ehUploadPublic = function () {
    return function (req, res, next) {
        var express = getDependency('express'),
            Promise = getDependency('es6-promise').Promise,
            fs = getDependency('fs'),
            multer = getDependency('multer'),
            path = getDependency("path"),
            config = getDependency('../config/main.json'),
            glob = getDependency("glob"),
            models = {},
            conf = getDependency("../config/dapi/files.json"),
            adMessage = "You cannot pass....I am a servant of the Secret Fire, wielder of the flame of Anor. You cannot pass. The dark fire will not avail you, flame of Udûn. Go back to the Shadow! You cannot pass.";

        models.users = getDependency(dapi_model_users);
        models.groups = getDependency(dapi_model_groups);
        models.file = getDependency(dapi_model_file);

        var secureStorage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './server/uploads');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        var secureUpload = multer({storage: secureStorage}).array('files');

        secureUpload(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file.<br/>" + err.toString());
            }
            else {
                var promises = [];
                for (var i = 0; i < req.files.length; i++) {

                    promises.push(new Promise(function (resolve, reject) {
                        (function (e) {
                            var tempFile = req.files[e];
                            var newFile = new models.file();
                            newFile.rights = 7;
                            newFile.path = tempFile.path;
                            newFile.filename = tempFile.filename;
                            newFile.type = tempFile.mimetype;
                            newFile.userId = null;
                            newFile.name = tempFile.originalname;
                            newFile.save(function (err, product, mongoose) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(product);
                                }
                            });
                        })(i); //systeme de capture de mutable
                    }));
                }
                Promise.all(promises).then(function (errors) {
                    req.fileUploadResults = errors;
                    next()
                });
            }
        });
    }
};

dapi.files.ehDelete = function (fileFieldName) {
    return function (req, res, next) {
        var fileId = req.params[fileFieldName || "fileId"];
        var fileModels = getDependency(dapi_model_file);
        fileModels.findById(fileId).then(data => {
            fs.unlinkSync(data.path);
            fileModels.findByIdAndRemove(fileId).then(data => {
                req.fileUploadResults = data;
                next();
            }).catch(data => {
                req.fileUploadResults = data;
                next();
            })
        }).catch(err => {
            req.fileUploadResults = err;
            next();
        })
    }
};

dapi.files.ehServe = function(fileFieldName){
    return function (request, response, next) {
        var fileId = request.params[fileFieldName || "fileId"];
        var fileModels = getDependency(dapi_model_file);
        fileModels.findById(fileId)
            .then(file => {
                console.log(file);
                if(file.userId){
                    //File is owned
                    if(request.user){
                        stack.dapis.access.users.getBestRights(request.user._id)
                            .then(data => {
                                if(file.rights > data || file.userId.toString() == request.user._id.toString()){
                                    response.sendFile(getDependency("path").join(__dirname, "../", file.path));
                                } else {
                                    response.statusCode = 403;
                                    response.send("Permission dennied");
                                }
                            })
                            .catch(error => {
                                response.send(error);
                            })
                        ;
                    } else {
                        response.statusCode = 401;
                        response.send("Authentication failed");
                    }
                } else {
                    //File is public
                    response.sendFile(getDependency("path").join(__dirname, "../", file.path));
                }
            })
            .catch(error => {
                console.log(error, fileId);
                response.send(error);
            })
        ;
    }
};
stack.dapis.files = dapi.files;