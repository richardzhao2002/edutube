const Email = require('email-templates');
const path = require('path');
const nodemailer = require('nodemailer');

class Mailer {
    constructor() {
    }

    /* @Method: sendMail
    // @Description: For sendmail
    */
    async sendMail (from, to, subject, tplName, locals) {
        try {
            const templateDir = path.join(__dirname, "../views/", 'email-templates', tplName + '/html')
            const email = new Email({
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs'
                    }
                }
            });
           
            const getMailBody = await email.render(templateDir, locals);
           
            if (getMailBody) {
                let options = {
                    from: from,
                    to: to,
                    subject: subject,
                    html: getMailBody
                };

                const _transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    }
                });

                let mailresponse = await _transport.sendMail(options);

                if (mailresponse) {
                    return true;
                } else {
                    return false;
                }
                
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };



}
module.exports = new Mailer();




