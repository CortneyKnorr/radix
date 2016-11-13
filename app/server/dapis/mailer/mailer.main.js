function stack_dapis_mailer() {
    let thisDapi = {
        sendMails(mails) {
            return new Promise(function (resolve, reject) {
                var nodemail = getDependency("nodemailer");
                var mailConfig = getDependency(getDependency("path").join(__dirname, "/config/dapi/mailer.json"));

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
        },
        pehgs: {
            sendMail(fromArg, toArg, mailArg){
                return function*(request, response, next) {
                    let from = stack.dapis.wizards.standards.ehgf13Arg(fromArg, request, null);
                    let to = stack.dapis.wizards.standards.ehgf13Arg(toArg, request, null);
                    let mail = stack.dapis.wizards.standards.ehgf13Arg(mailArg, request, null);
                    thisDapi.sendMails([{
                        from,
                        to,
                        subject: mail.subject,
                        html: mail.html,
                        text: mail.text
                    }]);
                    next();
                }
            },

        }
    };
    return thisDapi;
}