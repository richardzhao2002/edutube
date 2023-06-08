const mongoose = require("mongoose");
const videoRepo = require('video/repositories/video.repository');

class VideoController {
    constructor() { }

    /* @Method: AddVideo
    // @Description: Add Video
    */
    async AddVideo(req) {
        try {

            if (req.body.title == null || req.body.title == "") {
                return { status: 201, data: {}, message: "Title is required." };
            }

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {

                        if (req.files[i].fieldname == 'video') {
                            req.body.video = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'thumbnail_image') {
                            req.body.thumbnail_image = req.files[i].filename;
                        }
                    }
                }
            }

            req.body.title = req.body.title.trim()
            req.body.user_id = mongoose.Types.ObjectId(req.user._id)
            let saveVideo = await videoRepo.save(req.body);
            if (!_.isEmpty(saveVideo)) {
                return { status: 200, data: saveVideo, message: 'Video has been added successfully' };
            } else {
                return { status: 201, data: saveVideo, message: 'Video could not be saved' };
            }
        } catch (e) {
            return { status: 500, data: {}, message: e.message };
        }
    };


    /* @Method: videoList
    // @Description: List of Video
    */
    async videoList(req) {
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
                req.body.pagination.perpage = parseInt(req.body.pagination.perpage);
            }
            let videoList = await videoRepo.getVideoList(req)
            // console.log("videoList",videoList);
            if (!_.isEmpty(videoList)) {
                return { status: 200, data: videoList.docs, total: videoList.total, limit: videoList.limit, page: videoList.page, pages: videoList.pages, message: 'Video list has been fetched successfully' };
            }
            else {
                return { status: 201, data: [], message: 'Sorry unable to fetch video list!' };
            }
        } catch (e) {
            return { status: 500, data: {}, message: e.message };
        }
    };


    /* @Method: getVideDetails
    // @Description: Details of Video
    */
     async videoDetails(req, res) {
        try {
            if (!req.params.id) {
                return { status: 201, message: "Video Id is required" }
            }
            let video_id = mongoose.Types.ObjectId(req.params.id);
            let getVideData = await videoRepo.getVideoDetails({ _id: video_id });
            if (!_.isEmpty(getVideData)) {
                return { status: 200, message: "Video details has been Fetched Successfully", data: getVideData[0] }
            } else {
                return { status: 201, message: "Video details not found" }
            }
        } catch (e) {
            return { status: 500, message: e.message }
        }
    }
};

module.exports = new VideoController();