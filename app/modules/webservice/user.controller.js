const config = require('../../config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');
const mailer = require('../../helper/mailer.js');

const otp = require('otp-generator');
const fs = require('fs');
const moment = require('moment');
const express=require("express");
const routeLabel=require("route-label");
const router=express.Router();
const namedRouter=routeLabel(router);
const ipRepo=require("users_ip/repositories/users_ip.repository");

class UserController {
    constructor() { }


    /*
    // @Method: signup
    // @Description: User signup
    */

    async signup(req, res) {
        try {
           
            if (req.body.full_name == null || req.body.full_name == "") {
                return { status: 201, data: {}, message: "Full Name is required." };
            }
            // else if (req.body.last_name == null || req.body.last_name == "") {
            //     return { status: 201, data: {}, message: "Last Name is required." };
            // }
            else if (req.body.email == null || req.body.email == "") {
            return { status: 201, data: {}, message: "Email is required." };
            }
            else if (req.body.password == null || req.body.password == "") {
            return { status: 201, data: {}, message: "Password is required." }
            }else if(!req.body.role){
                return{status:201,data:{},message:"Role is required"}
            }
            else {
                const checkRole=await roleRepo.getById(req.body.role);
                if(_.isEmpty(checkRole)){
                    return{status:201,data:{},message:"Role data not found"}
                }

                req.body.email = req.body.email.trim().toLowerCase();
                
                if (_.has(req.body, "full_name") && req.body.full_name && req.body.full_name != '') {
                    const fullName = req.body.full_name;
                    const [first_name, last_name] = fullName.split(' ');
                    
                    if(!_.isEmpty(first_name) && first_name != ''){
                        req.body.first_name = first_name
                    }
                    if(!_.isEmpty(last_name) && last_name != ''){
                        req.body.last_name = last_name
                    }
                }

                let userAvailable = await userRepo.getByField({ email: req.body.email, isDeleted: false,isEmailVerified:true });

                if (!_.isEmpty(userAvailable)) {
                    return { status: 201, data: {}, "message": 'Account already exist for this email!' };
                }else {
                    // let userRole = await roleRepo.getByField({ role: 'user' });
                    req.body.role = checkRole._id;

                    if (req.body.first_name && req.body.last_name) {
                        req.body.first_name = req.body.first_name.trim();
                        req.body.last_name = req.body.last_name.trim();
                        req.body.full_name = req.body.full_name.trim();
                    }

                    const readable_pass = req.body.password;
                    req.body.password = new User().generateHash(readable_pass);
                    // req.body.emailOTP = otp.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                    // req.body.emailOTP = '1234';
                    // if(checkRole.role !="creator"){
                        req.body.isEmailVerified=true
                    // }

                    let saveUser = await userRepo.save(req.body);
                    if (!_.isEmpty(saveUser) && !_.isNull(saveUser)) {
                    //      if(checkRole.role =="creator"){
                    //     let encode_user_id = Buffer.from(saveUser._id).toString('base64')

                    //     let front_link = `${process.env.FRONT_LINK}/${encode_user_id}`

                    //     let emailData = { 
                    //         name: saveUser.full_name, 
                    //         email: saveUser.email, 
                    //         front_link: front_link,
                    //         admin_base_url:process.env.ADMIN_LINK,
                    //         PROJECTNAME: process.env.PROJECTNAME,
                    //         userId:encode_user_id
                    //         // otp:req.body.emailOTP
                    //     };
                        
                    //     let sendMail = await mailer.sendMail(`Edutube Admin<${process.env.MAIL_USERNAME}>`, saveUser.email, 'Registration || Edutube', 'user-signup', emailData);
                    // }
                        return { status: 200, data: saveUser, "message": 'Please verify the link sent to your mail.' };
                    } else {
                        return { status: 201, data: {}, "message": 'Something went wrong!' };
                    }

                    
                }
            }
        } catch (error) {
            console.log(error,'error');
            return { status: 500, "message": error.message };
        }
    };

    /*
    // @Method: verifyEmailOTP
    // @Description: User Verify Email OTP
    */

    async verifyEmailOTP(req, res) {
        try {
            if (!req.body.email || !req.body.email.trim()) {
                return { status: 201, data: {}, "message": 'Email is required.' };
            } else if (!req.body.emailOTP || !req.body.emailOTP.trim()) {
                return { status: 201, data: {}, "message": 'Email OTP is required.' };
            } else {
                let userRole = await roleRepo.getByField({ role: 'user' });
                req.body.email = req.body.email.trim().toLowerCase();
                let userExists = await userRepo.getByField({ email: req.body.email, role: userRole._id, isDeleted: false });
                if (userExists) {
                    if(userExists.isEmailVerified == false){
                        req.body.emailOTP = req.body.emailOTP.toString().trim();
                        if (userExists.emailOTP == req.body.emailOTP) {
                            let data = {
                                isEmailVerified: true,
                                emailOTP: '',
                                //isSignupCompleted: true,
                                isActive: true
                            };
    
                            if (!_.isEmpty(req.body.deviceToken) && !_.isNull(req.body.deviceToken) && !_.isEmpty(req.body.deviceType) && !_.isNull(req.body.deviceType)) {
                                data['deviceToken'] = req.body.deviceToken.toLowerCase();
                                data['deviceType'] = req.body.deviceType;
                            }
    
                            let updateUser = await userRepo.updateById(data, userExists._id);
                            if (updateUser && userExists._id) {
                                // let emailData = { 
                                //     site_logo_url: process.env.PUBLIC_PATH+"/assets/media/logos/logo.png",
                                //     name: updateUser.first_name 
                                // };
                                // await mailer.sendMail(`Beautibee<${process.env.SEND_GRID_FROM_EMAIL}>`, updateUser.email, 'Email Verification', 'admin-user-signup', emailData);
    
                                let tokenKey = otp.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                                await userRepo.updateById({ token_key: tokenKey }, userExists._id);
    
                                const payload = {
                                    id: userExists._id,
                                    token_key: tokenKey
                                };
    
                                let token = jwt.sign(payload, config.jwtSecret, {
                                    expiresIn: config.jwt_expiresin
                                });
    
                                req.session.token = token;
                                return { status: 200, data: {}, "message": 'Email Verified' };
                            } else {
                                return { status: 201, data: {}, "message": 'Something went wrong!' };
                            }
                        } else {
                            return { status: 201, data: {}, "message": 'OTP mismatched!' };
                        }
                    }else{
                        return { status: 201, data: {}, "message": 'You are verified already' };
                    }
                    
                } else {
                    return { status: 201, data: {}, "message": 'No account found with this email address. Please proceed to signup' };
                }
            }
        } catch (error) {
            return { status: 500, "message": error.message };
        }
    };


    /*
    // @Method: verifyEmailLink
    // @Description: User Verify Email Link
    */
    async verifyEmailLink(req, res) {
        try {
           

            if (req.body.encoded_id == null || req.body.encoded_id == "") {
                return { status: 201, data: {}, message: "Encoded Id is required." };
            }
            let encoded_id = req.body.encoded_id;
            let decoded_id =  Buffer.from(encoded_id, 'base64').toString('ascii')
            let userData = await userRepo.getById(decoded_id);

            if (!_.isEmpty(userData)) {


                if(userData.isEmailVerified == false){
                        const payload = {
                            id: userData._id,
                        };

                        const token = jwt.sign(payload, config.jwtSecret, {
                            expiresIn: "30d",
                        });
                        if (_.has(req.body, "deviceToken") && _.has(req.body, "deviceType")) {
                            let updateUserDeviceToken = await userRepo.updateById(
                                {
                                    deviceToken: req.body.deviceToken,
                                    deviceType: req.body.deviceType,
                                    isEmailVerified: true
                                },
                                userData._id
                            );
                        }
                        return {
                            status: 200,
                            token: token,
                            message:
                            "User has been verified Successfully. Registration Successful",
                            data: updatedUser,

                        };
                }
                else {
                    return {
                        status: 201,
                        data: {},
                        message: "You are verified already",
                    };
                }
            } else {
                return {
                    status: 201,
                    data: {},
                    message: "No account found with this email address. Please proceed to signup",
                };
            }
        }
 catch (e) {
            return res.status(500).send({ message: e.message });
        }
    }


    /* @Method: resendOTP
    // @Description: resendOTP
    */

    async resendOTP(req, res) {
        try {
            if (!req.body.email) {
                return { status: 201, data: {}, "message": 'Email is required!' };
            } else {
                let checkEmail = await userRepo.getByField({ "email": { $regex: '^' + req.body.email.trim() + '$', $options: 'i' }, "isDeleted": false });
                if (checkEmail) {
                    if (!checkEmail.isEmailVerified) {
                        var data = {};
                        data.emailOTP = otp.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                        let emailData = { 
                            name: checkEmail.full_name, 
                            email: checkEmail.email, 
                            PROJECTNAME: process.env.PROJECTNAME,
                            otp:data.emailOTP 
                        };
                        let sendMail = await mailer.sendMail(process.env.MAIL_USERNAME, emailData.email, 'OTP Resend', 'resendotp', emailData);
                        console.log(sendMail, "---------sendMail----------");

                        let updateUser = await userRepo.updateById(data, checkEmail._id);

                        return { status: 200, data: {}, "message": 'OTP sent successfully! Please check your email inbox.' };
                        
                    } else {
                        return { status: 201, data: {}, "message": 'Sorry, User already verified!' };
                    }
                } else {
                    return { status: 201, data: {}, "message": 'Email is not available' };
                }
            }
        } catch (error) {
            return { status: 500, "message": error.message };
        }
    };

    /*
    // @Method: signin
    // @Description: User signin
    */
    async signin(req, res) {
        try {
            if (!req.body.email) {
                return { status: 201, data: {}, "message": 'Email is required!' };
            } else if (!req.body.password) {
                return { status: 201, data: {}, "message": 'Password is required!' };
            } else {

                // let userRole = await roleRepo.getByField({ role: 'user' });
                req.body.email = req.body.email.trim().toLowerCase();

                let userAvailable = await userRepo.getByField({ email: req.body.email,"isEmailVerified":true, isDeleted: false });
                if (!userAvailable) {
                    return { status: 201, data: {}, "message": 'No account found! Please proceed to signup' };
                // } else if (!userAvailable.isEmailVerified) {
                //     requestHandler.throwError(400, 'Forbidden', 'This account email was not verified')();    
                } else if (!userAvailable.isActive || userAvailable.isBanned) {
                    return { status: 201, data: {}, "message": 'This account was set inactive by the Admin' };

                // } else if (!userAvailable.account_verified) {
                //     requestHandler.throwError(400, 'Forbidden', 'This account was not verified by the Admin')();
                // } else {
                     
                }
                else if (!userAvailable.isEmailVerified) {
                    return { status: 201, data: {}, "message": 'Please verify your email address' }
                     
                }
                else{
                    let isPasswordMatched = new User().validPassword(req.body.password, userAvailable.password);
                    if (!isPasswordMatched) {
                        return { status: 201, data: {}, "message": 'Authentication failed!' };
                    } else {

                        let tokenKey = otp.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

                        await userRepo.updateById({ token_key: tokenKey, is_online: true }, userAvailable._id);

                        if (!_.isEmpty(req.body.deviceToken) && !_.isNull(req.body.deviceToken) && !_.isEmpty(req.body.deviceType) && !_.isNull(req.body.deviceType)) {
                            await userRepo.updateById({
                                deviceType: req.body.deviceType.toLowerCase(),
                                deviceToken: req.body.deviceToken
                            }, userAvailable._id);
                        }

                        const payload = {
                            id: userAvailable._id,
                            token_key: tokenKey
                        };
                        // console.log(config.jwtSecret);
                        // console.log(config.jwt_expiresin);
                        let token = jwt.sign(payload, config.jwtSecret, {
                            expiresIn: config.jwt_expiresin
                        });
                        let userData = await userRepo.getByField({ _id: userAvailable._id });

                const checkIp=await ipRepo.getByField({"ip":req.socket.remoteAddress,"user_id":userData._id,"isDeleted":false});
                if(!_.isEmpty(checkIp)){
                    if(checkIp.status=="Inactive"){
                         return{status:201,data:{},message:"Sorry your ip address has bolcked"}
                    }else{
                        ipRepo.updateById({"isOnline":true},checkIp._id);
                        return { status: 200, data: userData, token, "message": 'Logged in successfully!' };
                    }
                }else{
                    ipRepo.save({
                        user_id:userData._id,
                        ip:req.socket.remoteAddress
                    });
                    return { status: 200, data: userData, token, "message": 'Logged in successfully!' };
                }
                        

                    }
                }
            }
        } catch (error) {
            console.log(error,'errrrrrrr');
            return { status: 500, "message": error.message };
        }
    };

    /*
    // @Method: forgetPasswordRequest
    // @Description: User Forget Password Request
    */
    async forgetPasswordRequest(req, res) {
        try {
            // console.log("forget Password Request");
            if (!req.body.email) {
                return { status: 201, data: {}, "message": 'Email is required!' };
            } 
            else {
                // console.log("done");
                // let userRole = await roleRepo.getByField({ role: 'user' });
                req.body.email = req.body.email.trim().toLowerCase();

                let userAvl = await userRepo.getByField({ email: req.body.email,  isDeleted: false });
                if (userAvl) {
                    if (!userAvl.isActive || userAvl.isDeleted) {
                        return { status: 201, data: userData, token, "message": 'Account was deactivated!' };
                    } else {
                        let data = {};
                        let otP = otp.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

                        data["emailOTP"] = otP;
                        let emailData = {
                            site_logo_url: process.env.PUBLIC_PATH+"/assets/media/logos/logo.png",
                            name: userAvl.full_name,
                            otp: otP,
                            PROJECTNAME: process.env.PROJECTNAME,
                        };
                        let sendMail = await mailer.sendMail(process.env.PROJECTNAME+`<${process.env.SEND_GRID_FROM_EMAIL}>`, userAvl.email, 'Forgot Password', 'forgetpassword-otp', emailData);
                        console.log(sendMail, "--------sendMail--------");
                        let updateUser = await userRepo.updateById(data, userAvl.id);
                        if (updateUser && userAvl.id) {
                            return { status: 200, data: {}, "message": 'OTP triggered to your email address associated with this account.' };
                        } else {
                            return { status: 201, data: {}, "message": 'Something went wrong!' };
                        }
                    }
                } else {
                    return { status: 201, data: {}, "message": 'No account found!' };
                }
            }
        } catch (error) {
            return { status: 500, "message": error.message };
        }
    };

    /*
    // @Method: forgetPasswordVerify
    // @Description: User Forget Password Verify
    */
    async forgetPasswordVerify(req, res) {
        try {
            if (!req.body.otp || !req.body.otp.toString().trim()) {
                return { status: 201, data: {}, "message": 'OTP is required!' };
            } else if (!req.body.email || !req.body.email.trim()) {
                return { status: 201, data: {}, "message": 'Email is required!' };
            } else {
                req.body.email = req.body.email.trim().toLowerCase();
                let userAvl = await userRepo.getByField({ email: req.body.email, isDeleted: false });
                if (userAvl) {
                    if (!userAvl.isActive || userAvl.isDeleted || !userAvl.isEmailVerified) {
                        return { status: 201, data: {}, "message": 'Account was deactivated!' };
                    } else {
                        let data = {};
                        req.body.otp = req.body.otp.toString().trim();
                        if (req.body.otp == userAvl.emailOTP) {

                            data["emailOTP"] = "";
                            let updateUser = await userRepo.updateById(data, userAvl.id);
                            if (updateUser && userAvl.id) {
                                // const payload = {
                                //     id: userAvl._id
                                // };

                                // let token = jwt.sign(payload, config.auth.jwtSecret, {
                                //     expiresIn: config.auth.jwt_expiresin
                                // });

                                // req.session.token = token;
                                return { status: 200, data: updateUser, "message": 'OTP verifcation successfully done' };

                            } else {
                                return { status: 201, data: {}, "message": 'Something went wrong!' };
                            }
                        } else {
                            return { status: 201, data: {}, "message": 'OTP mis-matched.' };
                        }
                    }
                } else {
                    return { status: 201, data: {}, "message": 'No account found!' };
                }
            }
        } catch (error) {
            return { status: 500, "message": error.message };
        }
    };

    /*
    // @Method: resetPassword
    // @Description: User Reset Password
    */
    async resetPassword(req, res) {
        try {
            const user = new User();
            
            if (!req.body.password || !req.body.password.trim()) {
                return { status: 201, data: {}, "message": 'New Password is required.' };
            }
            if (!req.body.confirm_password || !req.body.confirm_password.trim()) {
                return { status: 201, data: {}, "message": 'Confirm Password is required.' };
            }
            if (req.body.password != req.body.confirm_password) {
                return { status: 201, data: {}, "message": 'Password & Confirm Password should be equal.' };
            }
            if (!req.body.user_id) {
                return { status: 201, data: {}, "message": 'User Id is required' };
            }

            let userAvailable = await userRepo.getById(req.body.user_id)
            if(userAvailable){
                 
                let newPassword = user.generateHash(req.body.password);
                let updatedUser = await userRepo.updateById({ password: newPassword }, req.body.user_id);
                if (updatedUser && updatedUser._id) {
                    return { status: 200, data: {}, "message": 'Password changed successfully' };
                } else {
                    return { status: 201, data: {}, "message": 'Unable to update the password.' };
                }
            }else{
                return { status: 201, data: {}, "message": 'No user found.' };
            }
            
        } catch (err) {
            return { status: 500, "message": err.message };
        }
    };

    /*
    // @Method: updateProfile
    // @Description: User edit profile
    */
    async updateProfile(req, res) {
        try {
            //console.log(req.user._id);
            let userInfo = await userRepo.getByField({ '_id': req.user._id, 'isDeleted': false });
            if (!_.isEmpty(userInfo)) {
                    

                    if (req.body.first_name && req.body.last_name) {
                        // req.body.full_name = req.body.first_name + ' ' + req.body.last_name;
                        var fullName = req.body.first_name + ' ' + req.body.last_name;
                        var first_name = req.body.first_name
                        var last_name = req.body.last_name

                        req.body.full_name = fullName
                        req.body.first_name = first_name
                        req.body.last_name = last_name
                    }
                    if (req.body.full_name) {
                        var fullName = req.body.full_name.split(' ')
                        var first_name = fullName[0]
                        var last_name = fullName[fullName.length - 1]
                        fullName = first_name + ' ' + last_name;

                        req.body.full_name = fullName
                        req.body.first_name = first_name
                        req.body.last_name = last_name
                    }

                    if (req.files && req.files.length) {
                        userInfo = await userRepo.getByField({ '_id': req.user._id, 'isDeleted': false });
                        
                        for (let file of req.files) {
                            req.body[file.fieldname] = file.filename;
                        }
                        
                    }

                    // console.log(req.body);
                    let updateUser = await userRepo.updateById(req.body, req.user._id);

                    if (!_.isEmpty(updateUser) && updateUser._id) {
                        return { status: 200, data: updateUser, "message": 'Profile updated successfully' };
                    } else {
                        return { status: 201, data: {}, "message": 'Failed to update User' };
                    }
                
            } else {
                return { status: 201, data: {}, "message": 'User not found' };
            }
        } catch (err) {
            //console.log(err.message);
            return { status: 500, "message": err.message };
        }
    };


    /*
    // @Method: changePassword
    // @Description: User change password
    */
    async changePassword(req, res) {
        try {
            if (!req.body.old_password || !req.body.old_password.trim()) {
                return { status: 201, data: {}, "message": 'Old Password is required.' };
            }
            if (!req.body.new_password || !req.body.new_password.trim()) {
                return { status: 201, data: {}, "message": 'New Password is required.' };
            }
            const user = new User();
            let userData = await userRepo.getById(req.user._id);
            let isPasswordMatched = user.validPassword(req.body.old_password, userData.password);
            if (isPasswordMatched) {
                let newPassword = user.generateHash(req.body.new_password);
                let updatedUser = await userRepo.updateById({ password: newPassword }, req.user._id);
                if (updatedUser && updatedUser._id) {
                    return { status: 200, data: {}, "message": 'Password changed successfully' };
                } else {
                    return { status: 201, data: {}, "message": 'Something went wrong!' };
                }
            } else {
                return { status: 201, data: {}, "message": 'You have entered Wrong Old Password' };
            }
        } catch (err) {
            return { status: 500, "message": err.message };
        }
    };

    /*
    // @Method: userDetails
    // @Description: User profile details
    */
    async userDetails(req, res) {
        try {
            let userData = await userRepo.getByField({ '_id': req.user._id, 'isDeleted': false });
            if (!_.isEmpty(userData)) {

                return { status: 200, data: userData, "message": 'User profile details fetched successfully' };
            } else {
                return { status: 201, data: {}, "message": 'User not found' };
            }
        } catch (err) {
            return { status: 500, "message": err.message };
        }
    };

    /*
    // @Method: userLogout
    // @Description: User profile Logout
    */
    async userLogout(req, res) {
		try {
			let logged_in_user = req.user._id;

			let user = await userRepo.getById(logged_in_user);
			if (_.isObject(user)) {
                await userRepo.updateById({'deviceToken':'', 'deviceType': ''}, logged_in_user);
                return { status: 200, data: {}, "message": 'Logged out successfully' };
			} else {
                return { status: 201, data: {}, "message": 'User not found' };
			}
		} catch (err) {
            return { status: 500, "message": err.message };
		}
	};

    


}
module.exports = new UserController();
