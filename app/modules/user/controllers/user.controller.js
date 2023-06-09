const mongoose = require('mongoose');
const User = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');
const mailer = require('../../../helper/mailer.js');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const gm = require('gm').subClass({
    imageMagick: true
});
const fs = require('fs');
const jwt = require('jsonwebtoken');
//mail send 
const {
    join
} = require('path');
const ejs = require('ejs');
const {
    readFile
} = require('fs');
const {
    promisify
} = require('util');
const readFileAsync = promisify(readFile);


class UserController {
    constructor() {
        this.users = [];

    }

    /* @Method: login
    // @Description: user Login Render
    */
    async login(req, res) {
        res.render('user/views/login.ejs');
    };

    /* @Method: signin
    // @Description: user Login
    */
    async signin(req, res) {
        try {
            let userData = await userRepo.fineOneWithRole(req.body);
            if (userData.status == 500) {
                req.flash('error', userData.message);
                return res.redirect(namedRouter.urlFor('user.login'));
            }
            let user = userData.data;
            if (!_.isEmpty(user.role) && user.role.role == 'admin') {
                const payload = {
                    id: user._id
                };

                let token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                req.session.token = token;
                req.user = user;
                let user_details = {};
                user_details.id = user._id;
                user_details.name = user.name;
                user_details.email = user.email;
                // return the information including token as JSON
                req.flash('success', "You have successfully logged in");
                res.redirect(namedRouter.urlFor('user.dashboard'));
            } else {
                req.flash('error', 'Authentication failed. You are not a valid user.');
                res.redirect(namedRouter.urlFor('user.login'));
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: create
    // @Description: user create view render
    */
    async create(req, res) {
        try {
            let success = {};
            let roles = await roleRepo.getAllByField({ "isDeleted": false, "rolegroup": "user" });
            success.roles = roles;

            res.render('user/views/add.ejs', {
                page_name: 'user-management',
                page_title: 'Create User',
                user: req.user,
                response: success
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: insert
   // @Description: save User
   */
   async insert(req, res) {
    try {
        var todaydate = new Date()
        var dob = new Date(req.body.dob)
        var diff =(dob.getTime() - todaydate.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        var ageinyears = Math.abs(Math.round(diff/365.25))

        if(ageinyears<18){
            req.flash('error', "Sorry, User's minimum age should be 18.");
            res.redirect(namedRouter.urlFor('user.create'));
        }else{
            const newUser = new User();

            var chars = "123456789abcdefghijklmnpqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNPQRSTUVWXYZ";
            var passwordLength = 7;
            let defaultpassword = '';
    
            for (var i = 0; i <= passwordLength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length);
                defaultpassword += chars.substring(randomNumber, randomNumber + 1);
            }
            req.body.password = newUser.generateHash(defaultpassword);
            req.body.email = req.body.email.trim().toLowerCase();
    
            if (req.body.first_name && req.body.last_name) {
                req.body.full_name = req.body.first_name + ' ' + req.body.last_name;
            }
    
            var roleDetails = await roleRepo.getByField({ role: "user" });
            if (!_.isEmpty(roleDetails)) {
                req.body.role = roleDetails._id;
            }
    
            var chk = { isDeleted: false, email: req.body.email };
            let checkEmail = await userRepo.getByField(chk);
            
            if (!_.isEmpty(checkEmail)) {
                req.flash('error', "Sorry, User already exist with this email.");
                res.redirect(namedRouter.urlFor('user.create'));
            } else {
                if (req.files && req.files.length > 0) {
                    
                    gm('./public/uploads/user//profile_pic/' + req.files[0].filename).resize(100)
                        .write('./public/uploads/user/thumb/' + req.files[0].filename, function (err, result) {
                            if (!err) console.log('done');
                        });
                    req.body.profile_pic = req.files[0].filename;
                }
                req.body.isEmailVerified = true
                let saveUser = await userRepo.save(req.body);
    
                let email_message = "You have successfully registered.";
    
                let emailData = { fullname: saveUser.full_name, message: email_message, email: saveUser.email, password: defaultpassword, PROJECTNAME: process.env.PROJECTNAME};
                let sendMail = await mailer.sendMail(`${process.env.PROJECTNAME}<process.env.MAIL_USERNAME>`, saveUser.email, 'Account Creation', 'create-account', emailData);
                if (_.isObject(saveUser) && saveUser._id) {
                    req.flash('success', 'User created successfully');
                    res.redirect(namedRouter.urlFor('user.listing'));
                } else {
                    req.flash('error', "Failed to create new user");
                    res.redirect(namedRouter.urlFor('user.listing'));
                }
            }
        }

        
    } catch (e) {
        console.log(e.message);
        req.flash('error', e.message);
        //res.status(500).send({message: error.message});
        res.redirect(namedRouter.urlFor('user.create'));
    }
};


    /* @Method: list
    // @Description: To get all the user from DB
    */
    async list(req, res) {
        try {
            let count = await userRepo.getCount({isDeleted: false});
            let activeCount = await userRepo.getCount({
                isDeleted: false,
                isActive: true,
            });
            res.render('user/views/list.ejs', {
                page_name: 'user-management',
                page_title: 'User List',
                user: req.user,
                count: count,
                activeCount: activeCount,
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    /* @Method: getAllUser
    // @Description: To get all the user from DB
    */
    async getAllUser(req, res) {
        try {
            // req.body.role = 'user';
            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }

            if (!_.has(req.body, 'pagination')) {
                req.body.pagination.page = 1;
                req.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let user = await userRepo.getAllUsers(req);

            let meta = {
                "page": req.body.pagination.page,
                "pages": user.pages,
                "perpage": req.body.pagination.perpage,
                "total": user.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: user.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }

    /**
     * @Method: edit
     * @Description: To edit user information
     */
    async edit(req, res) {
        try {
            let result = {};
            let userData = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userData)) {
                result.user_data = userData;
                res.render('user/views/edit.ejs', {
                    page_name: 'user-management',
                    page_title: 'Update User',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry user not found!");
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            throw e;
        }
    };

    async update(req, res) {
        try {
            // console.log(req.body);
            var todaydate = new Date()
            var dob = new Date(req.body.dob)
            var diff =(dob.getTime() - todaydate.getTime()) / 1000;
            diff /= (60 * 60 * 24);
            var ageinyears = Math.abs(Math.round(diff/365.25))
            // console.log(ageinyears);
            if(ageinyears<18){
                req.flash('error', "Sorry, User's minimum age should be 18.");
                res.redirect(namedRouter.urlFor('user.edit', {
                    id: req.body.uid
                }));
            }else{
                let userUpdate = userRepo.updateById(req.body, req.body.uid);
                if (userUpdate) {
                    req.flash('success', 'User updated successfully.');
                    res.redirect(namedRouter.urlFor('user.listing'));
                } else {
                    res.redirect(namedRouter.urlFor('user.edit', {
                        id: req.body.uid
                    }));
                }
            }
            
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    };

    /* @Method: delete
    // @Description: user Delete
    */
    async delete(req, res) {
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id)
            if (!_.isEmpty(userDelete)) {
                req.flash('success', 'User Removed Successfully');
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    /* @Method: Dashboard
    // @Description: User Dashboard
    */
    async dashboard(req, res) {

        try {

            let user = await userRepo.getLimitUserByField({
                'isDeleted': false,
                'role.role': 'admin'
            });
            let resultall = {
                'user': user
            };

            let role = await roleRepo.getByField({ "role": "admin" });

            let userCount = await userRepo.getCount({ "role": { "$ne": mongoose.Types.ObjectId(role._id) }, "isDeleted": false, "isActive": true });

            // let faqCount = await faqRepo.getDocumentCount({ "isDeleted": false });


            /* Html render here */
            res.render('user/views/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                userCount: userCount,
                response: resultall
            });
        } catch (e) {
            throw (e);
            //return res.status(500).send({message: e.message}); 
        }
    };



    /* @Method: Logout
    // @Description: User Logout
    */
    async logout(req, res) {
        try {
            req.session.destroy(function (err) {
                res.redirect('/' + process.env.ADMIN_FOLDER_NAME);
            });
            // req.session.token = "";
            // req.session.destroy();
            // return res.redirect('/');
        }
        catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: viewmyprofile
    // @Description: To get Profile Info from db
    */
    async viewmyprofile(req, res) {
        try {
            const id = req.params.id;
            let user = await userRepo.getById(id)
            if (!_.isEmpty(user)) {
                res.render('user/views/myprofile.ejs', {
                    page_name: 'user-profile',
                    page_title: 'My Profile',
                    user: req.user,
                    response: user
                });

            }
        } catch (e) {

            return res.status(500).send({
                message: e.message
            });
        }
    }

    /* @Method: updateprofile
    // @Description: Update My Profile 
    */
    async updateprofile(req, res) {
        try {
            const id = req.body.id;
            let userUpdate = await userRepo.updateById(req.body, id)
            if (!_.isEmpty(userUpdate)) {
                req.flash('success', "Profile updated successfully.");
                res.redirect(namedRouter.urlFor('admin.profile', {
                    id: id
                }));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /*
    // @Method: statusChange
    // @Description: User status change action
    */
    async statusChange(req, res) {

        try {

            let user = await userRepo.getById(req.params.id)
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                let userUpdate = await userRepo.updateById({ "isActive": userStatus }, req.params.id);
                req.flash('success', "User status has changed successfully.");
                res.redirect(namedRouter.urlFor('user.listing'));
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: changepassword
    // @Description: user changepassword Render
    */
    async adminChangePassword(req, res) {
        var vehicleOwner = await userRepo.getById(req.user._id);
        if (vehicleOwner) {
            res.render('user/views/change_password.ejs', {
                page_name: 'user-changepassword',
                page_title: 'Change Password',
                response: vehicleOwner,
                user: req.user
            });
        } else {
            req.flash('error', "sorry vehicle owner not found.");
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }

    };

    /*
    // @Method: updatepassword
    // @Description: User password change
    */

    async adminUpdatePassword(req, res) {
        try {
            let user = await userRepo.getUserById(req.user._id);
            if (!_.isEmpty(user)) {
                // check if password matches
                if (!user.validPassword(req.body.old_password, user.password)) {
                    req.flash('error', "Sorry old password mismatch!");
                    res.redirect(namedRouter.urlFor('admin.changepassword'));
                } else {
                    if (req.body.password == req.body.password_confirm) {
                        // if user is found and password is right, check if he is an admin
                        let new_password = req.user.generateHash(req.body.password);
                        let userUpdate = await userRepo.updateById({
                            "password": new_password
                        }, req.body.id);

                        if (userUpdate) {
                            req.flash('success', "Your password has been changed successfully.");
                            res.redirect(namedRouter.urlFor('user.dashboard'));
                        }
                    } else {
                        req.flash('error', "Your New Password And Confirm Password does not match.");
                        res.redirect(namedRouter.urlFor('admin.changepassword'));
                    }

                }
            } else {
                req.flash('error', "Authentication failed. Wrong credentials.");
                res.redirect(namedRouter.urlFor('admin.changepassword'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /*
    // @Method: forgotPassword
    // @Description: User forgotPassword
    */

    async forgotPassword(req, res) {
        try {
            let roleDetails = await roleRepo.getByField({ role: "admin" });
            let result = {};
            let user = await User.findOne({ email: { '$regex': `^${req.body.email}$`, '$options': 'i' }, role: roleDetails._id });
            // console.log(user, "user");
            if (!user) {
                // console.log("500");
                result.status = 500;
                return res.status(201).send({ "result": result, "message": "User not found", "status": false });
            } else {
                // console.log("200");
                let random_pass = Math.random().toString(36).substring(2, 9);
                let readable_pass = random_pass;
                let passwordHash = user.generateHash(random_pass);
                let user_details = await userRepo.updateById({ password: passwordHash }, user._id);
                if (!user_details) {
                    result.status = 500;
                    return res.status(201).send({ "result": result, "message": "User not found", "status": false });
                } else {
                    let emailData = { password: readable_pass, PROJECTNAME: process.env.PROJECTNAME, first_name: user.first_name };
                    let sendMail = await mailer.sendMail(process.env.MAIL_USERNAME, user_details.email, 'Forgot Password', 'forgot-password', emailData);
                    result.status = 200;
                    return res.status(200).send({ "result": result, "message": "Mail is sent to your mail id with new password", "status": true });
                }
            }
        }
        catch (e) {
            req.flash('error', e.message);
            res.redirect(namedRouter.urlFor('user.login'));
        }
    };


    async getAllUserCount(req, res) {
        try {
            let userCount = await userRepo.getUsersCount(req);
            return userCount;
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }

    /* @Method: list
    // @Description: To get all the admin from DB
    */
    async listAdmin(req, res) {
        try {

        res.render("user/views/adminlist.ejs", {
            page_name: "admin-management",
            page_title: "Admin List",
            user: req.user,

        });
        } catch (e) {
        return res.status(500).send({
            message: e.message,
        });
        }
    }

       /* @Method: getAllUser
    // @Description: To get all the user from DB
    */
    async getAllAdmin(req, res) {
        try {
            req.body.role = "admin";
    
            if (_.has(req.body, "sort")) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = "_id";
            }
        
            if (!_.has(req.body, "pagination")) {
                req.body.pagination.page = 1;
                req.body.pagination.perpage = config.PAGINATION_PERPAGE;
            }
        
            let user = await userRepo.getAllAdmins(req);
            // console.log(user.data);
            let meta = {
                page: req.body.pagination.page,
                pages: user.pages,
                perpage: req.body.pagination.perpage,
                total: user.total,
                sort: sortOrder,
                field: sortField,
            };
        
            return {
                status: 200,
                meta: meta,
                data: user.docs,
                message: `Data fetched successfully.`,
            };
        } catch (e) {
          return {
            status: 500,
            data: [],
            message: e.message,
          };
        }
      }

        /* @Method: createAdmin
    // @Description: admin create view render
    */
    async createAdmin(req, res) {
        try {
    
          res.render("user/views/adminadd.ejs", {
            page_name: "admin-management",
            page_title: "Create Admin",
            user: req.user,
          });
        } catch (e) {
          return res.status(500).send({
            message: e.message,
          });
        }
    }

    /* @Method: insertadmin
    // @Description: To save the admin data in the database
    */
   //////////////////
    async insertadmin(req, res) {
        try {
        req.body.email = req.body.email.toLowerCase().trim();
        let emailAvailable = await userRepo.getByField({
            email: req.body.email,
            isDeleted: false,
        });
        // console.log(emailAvailable,"emailAvailable");
        if (!emailAvailable) {
            let roleuser = await roleRepo.getByField({ role: "admin" });
            req.body.role = mongoose.Types.ObjectId(roleuser._id);
            req.body.first_name = req.body.first_name.trim();
            req.body.last_name = req.body.last_name.trim();
            req.body.full_name = req.body.first_name + " " + req.body.last_name;
            req.body.full_name = req.body.full_name.trim();

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'profile_pic') {
                            gm('public/uploads/user/profile_pic/' + req.files[i].filename).resize(100).write('public/uploads/user/profile_pic/thumb/' + req.files[i].filename, function (err) {
                            });
                            req.body.profile_pic = req.files[i].filename;
                        }
                    
                    }
                }
            }
            
            const newUser = new User();

            var chars = "123456789abcdefghijklmnpqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNPQRSTUVWXYZ";
            var passwordLength = 7;
            let defaultpassword = '';

            for (var i = 0; i <= passwordLength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length);
                defaultpassword += chars.substring(randomNumber, randomNumber + 1);
            }
            req.body.password = newUser.generateHash(defaultpassword);
            req.body.email = req.body.email.trim().toLowerCase();

            // let emailData = { first_name: req.body.first_name, password: password, language:'en' };
            // let sendMail = await mailHelper.sendMail(`Diet Skills<${process.env.MAIL_USERNAME}>`, req.body.email, 'Registration || Diet Skills', 'admin-add', emailData);
            let email_message = "You have successfully registered.";

            let saveuser = await userRepo.save(req.body);
            if (saveuser) {
                let emailData = { fullname: saveuser.full_name, message: email_message, email: saveuser.email, password: defaultpassword, PROJECTNAME: process.env.PROJECTNAME};
                let sendMail = await mailer.sendMail(`${process.env.PROJECTNAME}<process.env.MAIL_USERNAME>`, saveuser.email, 'Admin Account Creation', 'create-admin-account', emailData);
            
                req.flash("success", "Admin  added successfully.");
                res.redirect(namedRouter.urlFor("admin.listing"));
            } else {
                req.flash("error", "Failed to add brand.");
                res.redirect(namedRouter.urlFor("admin.listing"));
            }
        } else {
            req.flash("error", "User already available using this email address!");
            res.redirect(namedRouter.urlFor("admin.listing"));
        }
        } catch (e) {
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor("admin.create"));
        }
    }
}

module.exports = new UserController();