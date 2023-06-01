const settingRepo = require('setting/repositories/setting.repository');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);

class SettingController {
    /*
    // @Method: edit
    // @Description:  render setting edit page
    */
    async edit(req, res) {
        try {
            let result = {};
            let settingValue = await settingRepo.getById(req.params.id);
            if (!_.isEmpty(settingValue)) {
                result.setting_data = settingValue;
                res.render('setting/views/edit.ejs', {
                    page_name: 'setting-management',
                    page_title: 'Update Settings',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry setting not found!");
                res.redirect(namedRouter.urlFor('setting.listing'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* 
    // @Method: update
    // @Description: Setting update action
    */
    async update(req, res) {
        try {
            const settingId = req.body.mid;
            let settingUpdate = await settingRepo.updateById(req.body, settingId);
            if (settingUpdate) {
                req.flash('success', "Setting Updated Successfully");
                res.redirect(namedRouter.urlFor('setting.listing'));
            } else {
                res.redirect(namedRouter.urlFor('setting.edit', {
                    id: settingId
                }));
            }
        } catch (e) {            
            req.flash('error', e.message);
            res.redirect(namedRouter.urlFor('setting.edit', {
                id: req.body.mid
            }));
        }

    };


    /* 
    // @Method: list
    // @Description: To get all the setting from DB
    */
    async list(req, res) {
        try {
            res.render('setting/views/list.ejs', {
                page_name: 'setting-management',
                page_title: 'Setting List',
                user: req.user,
                // setting: req.session.setting,
                // postdata: searchStr,
                // response: success
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: getAll
    // @Description: To get all the setting from DB
    */
    async getAllData(req, res) {
        try {
            let settingValue = await settingRepo.getAll(req);
            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }
            let meta = {
                "page": req.body.pagination.page,
                "pages": settingValue.pages,
                "perpage": req.body.pagination.perpage,
                "total": settingValue.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: settingValue.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            throw e;
        }
    }

}

module.exports = new SettingController();