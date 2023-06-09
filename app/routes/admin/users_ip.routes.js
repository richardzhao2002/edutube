const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const ipController = require('users_ip/controllers/users_ip.controller');
const multer = require('multer');

const request_param = multer();

namedRouter.all('/users-ip*', auth.authenticate);

namedRouter.post("users-ip.getall", '/users-ip/getall/', async (req, res) => {
    try {
        const success = await ipController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});

namedRouter.get("users-ip.list", '/users-ip/list', ipController.list);
namedRouter.get("users-ip.statusChange", '/users-ip/status-change/:id/:userId', request_param.any(), ipController.statusChange);
namedRouter.get("users-ip.create", '/users-ip/create', ipController.statusChange);

module.exports = router; 