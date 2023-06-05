const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const videoController = require('video/controller/video.controller');

const multer = require('multer');
const request_param = multer();

//authentication section of video
namedRouter.all('/video*', auth.authenticate);

// admin cms list route
namedRouter.get("video.list", '/video/list', videoController.list);

namedRouter.post("video.getall", '/video/getall', async (req, res) => {
    try {
        //const success = await videoController.getAll(req, res);
        const success = await videoController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});

namedRouter.get("video.statusChange", '/video/status-change/:id', request_param.any(), videoController.statusChange);

//Export the express.Router() instance
module.exports = router;