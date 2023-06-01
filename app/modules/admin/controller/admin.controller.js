const express = require("express");
const router = express.Router();
const routeLabel = require("route-label");
const namedRouter = routeLabel(router);
const userRepo = require('user/repositories/user.repository');
const User = require('user/models/user.model');
const roleRepo=require("role/repositories/role.repository")

class adminController {

    constructor() {

    };
    /**
     * //@Method:List
     * //@Description:To render list page
     */
    async list(req, res) {
        try {
            res.render("admin/views/list.ejs", {
                page_name: "admin-management",
                page_title: "Admin List",
                user: req.user
            })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
    /*
// @Method: create
// @Description:Admin create page
*/
    async create(req, res) {
        try {
            const roledata=await roleRepo.getByField({"role":"admin"})
            res.render("admin/views/add.ejs", {
                page_name: "admin-management",
                page_title: "Admin Create",
                user: req.user,
                roledata:roledata
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };
    /*
  // @Method: insert
  // @Description:  Insert admin into DB
  */
    async insert(req, res) {
        try {
            req.body.email=(req.body.email).toLowerCase()
            const checkEmail=await userRepo.getByField({"email":req.body.email,"isDeleted":false});
            if(checkEmail){
                req.flash("error", "Email already exist");
                res.redirect(namedRouter.urlFor("admin.create"));
            }else{
            const readable_pass = req.body.password;
            req.body.password = new User().generateHash(readable_pass);
            let saveAdmin = await userRepo.save(req.body);
            if (!_.isEmpty(saveAdmin)) {
                req.flash("success", "Admin added successfully.");
                res.redirect(namedRouter.urlFor("admin.list"));
            } else {
                req.flash("error", "Somthing went wrong");
                res.redirect(namedRouter.urlFor("admin.list"));
            }
        }

        } catch (e) {
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor("admin.create"));
        }
    };
    /* @Method: getAll
  // @Description: To get all the faq from DB
  */
    async getAll(req, res) {
        try {
            let faqData = await userRepo.getAllAdmin(req);
            if (_.has(req.body, "sort")) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = "_id";
            }
            let meta = {
                page: req.body.pagination.page,
                pages: faqData.pages,
                perpage: req.body.pagination.perpage,
                total: faqData.total,
                sort: sortOrder,
                field: sortField,
            };

            return {
                status: 200,
                meta: meta,
                data: faqData.docs,
                message: `Data fetched successfully.`,
            };
        } catch (e) {
            throw e;
        }
    };
    /*
  // @Method: edit
  // @Description:  admin edit page
  */
    async edit(req, res) {
        try {

            let userInfo = await userRepo.getById(req.params.id);
            const roledata=await roleRepo.getByField({"role":"admin"})
            if (!_.isEmpty(userInfo)) {
                res.render("admin/views/edit.ejs", {
                    page_name: "admin-management",
                    page_title: "Admin Edit",
                    user: req.user,
                    response: userInfo,
                    roledata:roledata
                });
            } else {
                req.flash("error", "Sorry, record not found!");
                res.redirect(namedRouter.urlFor("admin.list"));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };
    /* @Method: update
  // @Description: admin update action
  */
    async update(req, res) {
        try {

            const adminId = req.body.id;
            req.body.email=(req.body.email).toLowerCase()
            const checkEmail=await userRepo.getByField({"email":req.body.email,"isDeleted":false,_id:{$ne:adminId}});
            if(checkEmail){
                req.flash("error", "Email already exist");
                res.redirect(namedRouter.urlFor("admin.create"));
            }else{
            let adminUpdate = await userRepo.updateById(req.body, adminId);
            if (adminUpdate) {
                req.flash("success", "Admin updated Successfully");
                res.redirect(namedRouter.urlFor("admin.list"));
            } else {
                req.flash("error", "Somthing went wrong");
                res.redirect(namedRouter.urlFor("admin.edit", { id: adminId }));
            }
        }
        } catch (e) {
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor("admin.edit", {
                id: adminId
            }));
        }
    };
    /* @Method: delete
  // @Description: Admin delete action
  */
    async delete(req, res) {
        try {

            let mtDelete = await userRepo.updateById(req.params.id, {
                isDeleted: true,
            });
            if (mtDelete) {
                req.flash("success", "Admin removed successfully");
                res.redirect(namedRouter.urlFor("admin.list"));
            } else {
                req.flash("error", "Somthing went wrong");
                res.redirect(namedRouter.urlFor("admin.list"));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message,
            });
        }
    };

    /*
   // @Method: statusChange
   // @Description: admin status change action
   */
    async statusChange(req, res) {
        try {


            let adminIfo = await userRepo.getById(req.params.id);

            if (!_.isEmpty(adminIfo)) {
                let adminStatus =
                    adminIfo.isActive == true ? false : true;
                let adminUpdate = userRepo.updateById({
                    isActive: adminStatus,
                }, req.params.id);
                if (adminUpdate) {
                    req.flash("success", "Admin status has changed successfully");
                    res.redirect(namedRouter.urlFor("admin.list"));
                } else {
                    req.flash("error", "Somthing went wrong");
                    res.redirect(namedRouter.urlFor("admin.list"));
                }
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message,
            });
        }
    };


};
module.exports = new adminController()