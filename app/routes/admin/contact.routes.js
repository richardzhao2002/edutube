const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactController = require('contact/controllers/contact.controller');
const multer = require('multer');


const csvUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./public/uploads/contact/csv")
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        }
    })
});


const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname === 'image') {
            callback(null, "./public/uploads/contact")
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

namedRouter.all('/contact*', auth.authenticate);

namedRouter.post("contact.getall", '/contact/getall', async (req, res) => {
    try {
        const success = await contactController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        console.log(error.message);
        res.status(error.status).send(error);
    }
});

namedRouter.get("contact.download", '/contact/download', contactController.contactDownload);
namedRouter.get("contact.download-pdf", '/contact/download-pdf', contactController.contactDownloadPDF);

namedRouter.get("contact.upload", '/contact/upload', contactController.upload);
namedRouter.post("contact.uploadCSV", '/contact/uploadCSV', csvUpload.single('csvFile'), contactController.uploadCsv);
namedRouter.get("contact.list", '/contact/list', contactController.list);
namedRouter.get("contact.create", '/contact/create', contactController.create);
namedRouter.post("contact.insert", '/contact/insert', uploadFile.any(), contactController.insert);
namedRouter.get("contact.edit", "/contact/edit/:id", contactController.edit);
namedRouter.post("contact.update", '/contact/update', uploadFile.any(), contactController.update);
namedRouter.get("contact.delete", "/contact/delete/:id", contactController.delete);
namedRouter.get("contact.statusChange", '/contact/status-change/:id', request_param.any(), contactController.statusChange);

module.exports = router; 