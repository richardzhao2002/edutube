const mongoose = require('mongoose');
const Cms = require('cms/models/cms.model');
const perPage = config.PAGINATION_PERPAGE;

const cmsRepository = {

    getAll: async (req) => {
        
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({ "isDeleted": false });

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },
                        { 'slug': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },
                        { 'desc': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } }
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({ "status": req.body.query.Status });
            }
            conditions['$and'] = and_clauses;
            
            var sortOperator = { "$sort": {} };
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }

            var aggregate =  Cms.aggregate([
                { $match: conditions },
                sortOperator
            ]);
            
            var options = { page: req.body.pagination.page, limit: req.body.pagination.perpage };
            let allCms = await Cms.aggregatePaginate(aggregate, options);
            
            return allCms;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        
        try {
            let cms = await Cms.findById(id).exec();
            
            if (!cms) {
                return null;
            }
            return cms;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        
        try {
            let cms = await Cms.findOne(params).exec();

            if (!cms) {
                return null;
            }
            return cms;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        
        try {
            let user = await User.find(params).exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getCmsCount: async (params) => {
        try {
            let cmsCount = await Cms.countDocuments(params);
            if (!cmsCount) {
                return null;
            }
            return cmsCount;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let cms = await Cms.findById(id);
            if (cms) {
                let cmsDelete = await Cms.remove({ _id: id }).exec();
                if (!cmsDelete) {
                    return null;
                }
                return cmsDelete;
            }
        } catch (e) {
            throw e;
        }
    },
    
    updateById: async (data, id) => {
        try {
            let cms = await Cms.findByIdAndUpdate(id, data, { new: true, upsert: true }).exec();
            if (!cms) {
                return null;
            }
            return cms;
        } catch (e) {
            throw e;
        }
    },

};

module.exports = cmsRepository;