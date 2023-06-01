const nodemailer = require('nodemailer');

const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {
        session: false
    },
    jwt_expiresin: '30d',
    PAGINATION_PERPAGE: 10,
    isProd,
    getPort: process.env.PORT || 1459,
    getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
    getApiFolderName: process.env.API_FOLDER_NAME || 'api',
    nonSecurePaths: ['/vehicleOwner/reset-password', '/vehicleOwner/login', '/vehicleOwner/store', '/vehicleOwner/verify', '/vehicleOwner/resendOtp', '/shopOwner/login', '/shopOwner/reset-password', '/shopOwner/resendOtp'],

    /*transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    }),*/

    transporter: nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        secureConnection: true,
        port: 465,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    }),
    //ORDER_RECEIVE_MAIL: 'kk@yopmail.com, ron@yopmail.com',
    // s3: new aws.S3()
}