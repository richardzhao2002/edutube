const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const adminController = require('admin/controller/admin.controller');
const multer = require('multer');

const request_param = multer();

namedRouter.all('/admin*', auth.authenticate);

namedRouter.post("admin.getall", '/admin/getall', async (req, res) => {
    try {
        const success = await adminController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});

namedRouter.get("admin.list", '/admin/list', adminController.list);
namedRouter.get("admin.create", '/admin/create', adminController.create);
namedRouter.post("admin.insert", '/admin/insert', request_param.any(), adminController.insert);
namedRouter.get("admin.edit", "/admin/edit/:id", adminController.edit);
namedRouter.post("admin.update", '/admin/update', request_param.any(), adminController.update);
namedRouter.get("admin.delete", "/admin/delete/:id", adminController.delete);
namedRouter.get("admin.statusChange", '/admin/status-change/:id', request_param.any(), adminController.statusChange);

module.exports = router; 