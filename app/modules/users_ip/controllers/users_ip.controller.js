const express = require("express");
const router = express.Router();
const routeLabel = require("route-label");
const namedRouter = routeLabel(router);
const userIpRepo = require('users_ip/repositories/users_ip.repository');

class adminController {

    constructor() {

    };
    /**
     * //@Method:List
     * //@Description:To render list page
     */
    async list(req, res) {
        try {
            res.render("users_ip/views/list.ejs", {
                page_name: "user-management",
                page_title: "IP List",
                user: req.user,
                userId:req.params.id
            })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
    /* @Method: getAll
  // @Description: To get all the faq from DB
  */
    async getAll(req, res) {
        try {
            let faqData = await userIpRepo.getAll(req);
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
   // @Method: statusChange
   // @Description: admin status change action
   */
    async statusChange(req, res) {
        try {


            let adminIfo = await userIpRepo.getById(req.params.id);

            if (!_.isEmpty(adminIfo)) {
                let adminStatus =
                    adminIfo.isActive == true ? false : true;
                let adminUpdate = userIpRepo.updateById({
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