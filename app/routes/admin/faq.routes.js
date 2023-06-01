const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const faqController = require('faq/controllers/faq.controller');
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname === 'image') {
            callback(null, "./public/uploads/faq")
        }

    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            req.fileValidationError = 'Only support jpeg, jpg or png file types.';
            return cb(null, false, new Error('Only support jpeg, jpg or png file types'));
        }
        cb(null, true);
    }
});


const request_param = multer();

namedRouter.all('/faq*', auth.authenticate);

namedRouter.post("faq.getall", '/faq/getall', async (req, res) => {
    try {
        const success = await faqController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});

namedRouter.get("faq.list", '/faq/list', faqController.list);
namedRouter.get("faq.create", '/faq/create', faqController.create);
namedRouter.post("faq.insert", '/faq/insert', uploadFile.any(), faqController.insert);
namedRouter.get("faq.edit", "/faq/edit/:id", faqController.edit);
namedRouter.post("faq.update", '/faq/update', uploadFile.any(), faqController.update);
namedRouter.get("faq.delete", "/faq/delete/:id", faqController.delete);
namedRouter.get("faq.statusChange", '/faq/status-change/:id', request_param.any(), faqController.statusChange);

module.exports = router; 