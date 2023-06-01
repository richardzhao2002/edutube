const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const cmsController = require('newvideos/controllers/newvideos.controller');

const multer = require('multer');
const request_param = multer();

//authentication section of cms
namedRouter.all('/cms*', auth.authenticate);

// admin cms list route
namedRouter.get("cms.list", '/cms/list', cmsController.list);
namedRouter.post("cms.getall", '/cms/getall', async (req, res) => {
    try {
        const success = await cmsController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});
/*@Route:  cms  Edit*/
namedRouter.get("cms.edit", '/cms/edit/:id', cmsController.edit);

/*@Route:  cms  update*/
namedRouter.post("cms.update", '/cms/update', request_param.any(), cmsController.update);

//Export the express.Router() instance
module.exports = router;