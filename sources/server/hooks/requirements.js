function requirements() {
    var promises = [];
    var mongoose = getDependency('mongoose');
    mongoose.Promise = Promise;

    var config = {};
    config.mongo = getDependency('../config/mongo.json');

    promises.push(
        new Promise((resolve, reject) => {
            mongoose.connect(config.mongo.url, {user: config.mongo.user, pass: config.mongo.password}, function (err) {
                if (err) {
                    reject("Failed to connect MongoDB: " + err);
                }
                else {
                    console.log("Mongoose connection validated");
                    mongoose.connection.close();
                    resolve("Mongoose connection validated");
                }
            })
        })
    );

    return promises;
}