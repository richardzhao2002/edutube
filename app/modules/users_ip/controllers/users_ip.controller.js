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
                page_name: "ip-management",
                page_title: "IP List",
                user: req.user,
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
   // @Description: IP refresh to perform 2 tasks:
        If the user has not been created, adds the user
        Otherwise refreshes the entry to update timestamp

        I also don't think we need so much given into req.
   */
    async statusChange(req, res) {
        try {
            let userip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let info = await userIpRepo.getByField(userip);
            if (!_.isEmpty(info)) {
                let adminUpdate = userIpRepo.updateById({
                    ip: userip,
                }, req.params.id);
                if (adminUpdate) {
                    req.flash("success", "Admin status has changed successfully");
                    res.redirect(namedRouter.urlFor("admin.list"));
                } else {
                    req.flash("error", "Somthing went wrong");
                    res.redirect(namedRouter.urlFor("admin.list"));
                }
            } else {
                userIpRepo.save({ip: userip});
                res.redirect(namedRouter.urlFor("users-ip.list"));
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message,
            });
        }
    };

};
module.exports = new adminController()