const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const videoController = require('webservice/video.controller');
const fs = require('fs');

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./public/uploads/video")) {
            fs.mkdirSync("./public/uploads/video");
        }
        callback(null, "./public/uploads/video");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});
const request_param = multer();

/**
 * @api {POST} /video/list Video List
 * @apiVersion 1.0.0
 * @apiGroup Video
 * @apiParam {Object} pagination
 * @apiParam {string} user_id (optional) [give the value of _id of user when they login otherwise don't use it]
 * @apiParamExample {json} Request-Example:
 * {
    "pagination":{
        "page":1,
        "perpage":3
    }
}
 * @apiSuccessExample {json} Success
{
    "status": 200,
    "data": [
        {
            "_id": "6463645e3ff5508246956d5d",
            "title": "video 6",
            "video": "1684235357986_video6.mp4",
            "thumbnail_image": "1684235358110_thumbnail6.webp",
            "user_id": "6463426ec46e8daa62e0353c",
            "isDeleted": false,
            "status": "Active",
            "createdAt": "2023-05-16T11:09:18.114Z",
            "updatedAt": "2023-05-16T11:09:18.114Z",
            "creatorDetails": {
                "_id": "6463426ec46e8daa62e0353c",
                "full_name": "Abc Def",
                "profile_pic": ""
            }
        },
        {
            "_id": "64635d193ff5508246956cb4",
            "title": "video upload test",
            "video": "1684233497112_education.mp4",
            "thumbnail_image": "1684233497221_video-thumb.png",
            "user_id": "6463426ec46e8daa62e0353c",
            "isDeleted": false,
            "status": "Active",
            "createdAt": "2023-05-16T10:38:17.227Z",
            "updatedAt": "2023-05-16T10:38:17.227Z",
            "creatorDetails": {
                "_id": "6463426ec46e8daa62e0353c",
                "full_name": "Abc Def",
                "profile_pic": ""
            }
        }
    ],
    "total": 4,
    "limit": 2,
    "page": 1,
    "pages": 2,
    "message": "Video list has been fetched successfully"
}
*/
namedRouter.post("api.video.list", '/video/list', request_param.any(), async (req, res) => {
    try {
        const success = await videoController.videoList(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

namedRouter.all("/video*", auth.authenticateAPI);

/**
 * @api {POST} /video/add Video Add
 * @apiVersion 1.0.0
 * @apiGroup Video
 * @apiHeader {String} x-access-token User's Access Token
 * @apiParam { String } title Video Title
 * @apiParm {string} description Description
 * @apiParam { String } video Video
 * @apiParam { String } thumbnail_image Thumbnail Image
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "title": "New Video",
        "video": "1684155966258_mp4.svg",
        "thumbnail_image": "1684155966259_pexels-anand-dandekar-2167355.jpg",
        "user_id": "646227fa3811b97e1fc073f3",
        "isDeleted": false,
        "status": "Active",
        "_id": "64622e3e022780adab349732",
        "createdAt": "2023-05-15T13:06:06.277Z",
        "updatedAt": "2023-05-15T13:06:06.277Z"
    },
    "message": "Video has been added successfully"
}
*/


namedRouter.post("api.video.add", '/video/add',  uploadFile.any(), async (req, res) => {
    try {
        const success = await videoController.AddVideo(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});



/**
 * @api {GET} /video/details/:id Video Details
 * @apiVersion 1.0.0
 * @apiGroup Video
 * @apiParam {ObjectId} _id Video Id
 * @apiHeader {String} x-access-token User's Access Token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "message": "Video details has been Fetched Successfully",
    "data": {
        "_id": "64622e3e022780adab349732",
        "title": "New Video",
        "video": "1684155966258_mp4.svg",
        "thumbnail_image": "1684155966259_pexels-anand-dandekar-2167355.jpg",
        "user_id": "646227fa3811b97e1fc073f3",
        "isDeleted": false,
        "status": "Active",
        "createdAt": "2023-05-15T13:06:06.277Z",
        "updatedAt": "2023-05-15T13:06:06.277Z"
    }
}
*/

namedRouter.get("api.video.details", '/video/details/:id', async (req, res) => {
    try {
        const success = await videoController.videoDetails(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

module.exports = router;