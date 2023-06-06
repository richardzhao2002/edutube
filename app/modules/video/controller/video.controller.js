const express = require("express");
const router = express.Router();
const routeLabel = require("route-label");
const namedRouter = routeLabel(router);
const videoRepo = require('video/repositories/video.repository');
const videoModel = require('video/models/video.model');

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
            if (!req.body.pagination) {
                req.body.pagination = {};
            }

            if (!req.body.pagination.page) {
                req.body.pagination.page = 1;
            } else {
                req.body.pagination.page = parseInt(req.body.pagination.page);
            }

            if (!req.body.pagination.perpage) {
                req.body.pagination.perpage = 5;
            } else {
                //req.body.pagination.perpage = parseInt(req.body.pagination.perpage);
                req.body.pagination.perpage = 5;
            }

            let video = await videoRepo.getAll(req);
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
        try {
            let videoInfo = await videoRepo.getById(req.params.id);
            if (!_.isEmpty(videoInfo)) {
                /*
                let status =
                    videoInfo.isActive == true ? false : true;
                let videoUpdate = videoModel.findByIdAndUpdate(req.params.id, 
                    {$set: {"isActive": status}, },
                    {upsert:true, multi:true},
                    function(err, numberAffected){
                    });
                */
               let status = 
                    videoInfo.status == 'Active' ? 'Inactive' : 'Active';
                let videoUpdate = videoModel.findByIdAndUpdate(req.params.id, 
                    {$set: {"status": status}, },
                    {upsert:true, multi:true},
                    function(err, numberAffected){
                    });
                if (videoUpdate) {
                    req.flash("success", "Video active status has been changed.");
                    res.redirect(namedRouter.urlFor("video.list"));
                } else {
                    req.flash("error", "Somthing went wrong");
                    res.redirect(namedRouter.urlFor("video.list"));
                }
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message,
            });
        }
    };


};
module.exports = new videoController()