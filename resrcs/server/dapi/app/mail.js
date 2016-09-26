/**
 * Created by Kiran on 3/29/2016.
 */

var dapi = dapi || {};
dapi.mailer = dapi.mailer || {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.mailer.sendMails = function (mails) {
    return new Promise(function (resolve, reject) {
        var nodemail = getDependency("nodemailer");
        var mailConfig = getDependency("../config/dapi/mailer.json");

        var transport = nodemail.createTransport(mailConfig);
        var work = [];
        mails.forEach(function (mail) {
            work.push(transport.sendMail(mail));
        });
        Promise.all(work).then(data => {
            resolve(data);
        }, errArg => {
            reject(errArg)
        });
    });
};
stack.dapis.mailer = dapi.mailer;