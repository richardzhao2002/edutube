const express = require("express");
const router = express.Router();
const routeLabel = require("route-label");
const namedRouter = routeLabel(router);
const userIpRepo = require('users_ip/repositories/users_ip.repository');

const ipModel = require('users_ip/models/users_ip.model');

class adminController {

    constructor() {

    };
    /**
     * //@Method:List
     * //@Description:To render list page
     */
    async list(req, res) {
        let views = await userIpRepo.fetchDaily();
        try {
            res.render("users_ip/views/list.ejs", {
                page_name: "ip-management",
                page_title: "IP List",
                user: req.user,
                daily: views,
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
            let userip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress);
            if (await ipModel.exists({ip: userip})) {
                //let info = await userIpRepo.getByField({ip: userip});
                ipModel.findOneAndUpdate({ip: userip},{
                    ip: userip,
                });
            } else {
                userIpRepo.save({ip: userip});
            }           
        } catch (e) {
            throw e;
        }
    };

};
module.exports = new adminController()