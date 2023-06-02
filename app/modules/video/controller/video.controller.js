const express = require("express");
const router = express.Router();
const routeLabel = require("route-label");
const namedRouter = routeLabel(router);
//const userRepo = require('user/repositories/user.repository');
//const User = require('user/models/user.model');
//const roleRepo=require("role/repositories/role.repository");
//const videoController = require("webservice/video.controller");
const videoRepo = require('video/repositories/video.repository');

class videoController {

    constructor() {
        //super()
    };
    /**
     * //@Method:List
     * //@Description:To render list page
     */
    async list(req, res) {
        //temp = super.videoList(req)
        
        try {
            res.render("video/views/list.ejs", {
                page_name: "video-management",
                page_title: "Unapproved Videos",
                user: req.user
            });

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
    /*
// @Method: create
// @Description:Admin create page
*/
    async create(req, res) {
        
    };
    /*
  // @Method: insert
  // @Description:  Insert admin into DB
  */
    async insert(req, res) {
       
    };
    /* @Method: getAll
  // @Description: To get all the faq from DB
  */
    async getAll(req, res) {
        try {
            let videoData = await videoRepo.getAll(req);
            if (_.has(req.body, "sort")) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = "_id";
            }
            let meta = {
                "page": req.body.pagination.page,
                "pages": video.pages,
                "perpage": req.body.pagination.perpage,
                "total": video.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: video.docs,
                message: `Data fetched successfully.`,
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    };
    /*
  // @Method: edit
  // @Description:  admin edit page
  */
    async edit(req, res) {
        
    };
    /* @Method: update
  // @Description: admin update action
  */
    async update(req, res) {
        
    };
    /* @Method: delete
  // @Description: Admin delete action
  */
    async delete(req, res) {
        
    };

    /*
   // @Method: statusChange
   // @Description: admin status change action
   */
    async statusChange(req, res) {
        
    };


};
module.exports = new videoController()