const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const masterController = require('webservice/master.controller');
// const config = require(appRoot + '/config/index');
const multer = require('multer');


const request_param = multer();

/**
 * @api {GET} /role/:slug Role Data
 * @apiGroup Master
 * @apiSuccessExample {json} success
 * {
    "status": 200,
    "data": {
        "_id": "645c8b90ef5a641d4d2e47a7",
        "roleDisplayName": "Consumer",
        "role": "consumer",
        "desc": "Consumer of the application.",
        "id": "645c8b90ef5a641d4d2e47a7"
    },
    "message": "Role data fetched successfully"
}
 */

namedRouter.get('api.role', '/role/:slug', request_param.any(), async (req, res) => {
    try {
        const success = await masterController.roleBySlug(req);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
  });

  module.exports=router;