const mongoose = require('mongoose');
const videoInfo = require('video/models/video.model');
const perPage = config.PAGINATION_PERPAGE;

const videoRepository = {

    getAll: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false
            });
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({
                    "status": req.body.query.Status
                });
            }
            conditions['$and'] = and_clauses;

            var sortOperator = {
                "$sort": {}
            };
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

            var aggregate = videoInfo.aggregate([
                {
                    $match: conditions
                },
                sortOperator
            ]);

            var options = {
                page: req.body.pagination.page,
                limit: req.body.pagination.perpage
            };
            let allRecord = await videoInfo.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        let record = await videoInfo.findById(id).lean().exec();
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        let record = await videoInfo.findOne(params).exec();
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        let record = await videoInfo.find(params).sort({
            'name': 1
        }).exec();
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    save: async (data) => {
        try {
            let save = await videoInfo.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            return e;
        }
    },

    getDocumentCount: async (params) => {
        try {
            let recordCount = await videoInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let record = await videoInfo.findById(id);
            if (record) {
                let recordDelete = await videoInfo.findByIdAndUpdate(id, {
                    isDeleted: true
                }, {
                    new: true
                });
                if (!recordDelete) {
                    return null;
                }
                return recordDelete;
            }
        } catch (e) {
            throw e;
        }
    },

    updateById: async (id, data) => {
        try {
            let record = await videoInfo.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            return e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    },

    // Video List for Api
    getVideoList: async (req) => {
        try {

            var conditions = {};
            var and_clauses = [];

            and_clauses.push({
                 "status": "Active", 
            "isDeleted": false ,
            //  'user_id': mongoose.Types.ObjectId(req.user._id)
            });
            if(req.body.userId){
            //    and_clauses.push({
            //     'user_id': mongoose.Types.ObjectId(req.user._id)
            //    })
            }

            // if (req.body.title != '' && _.has(req.body, "title")) {
            //     and_clauses.push({
            //     'title': { $regex: req.body.title.trim(), $options: 'i' } 
            //     });
            // }

            conditions['$and'] = and_clauses;

            var sortOperator = {
                "$sort": {}
            };
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

            let aggregate = videoInfo.aggregate([
                //lookup for creator
                {
                    $lookup:{
                        from:"users",
                        let:{userId:"$user_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq:["$_id","$$userId"]}
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    full_name:"$full_name",
                                    profile_pic:"$profile_pic"
                                }
                            }
                        ],
                        as:"creatorDetails"
                    }
                },
                {$unwind:"$creatorDetails"},
                { $match: conditions },
                sortOperator
            ]);
            var options = {
                page: req.body.pagination.page,
                limit: req.body.pagination.perpage
            };
            let allRecord = await videoInfo.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            throw e;
        }
    },

    // Video Details for Api
    getVideoDetails: async (params) => {
        try {
            let videoData = await videoInfo.aggregate([
                { $match: params },
                { $sort: { title: 1 } }
            ]);

            if (!videoData) {
                return null;
            }
            return videoData;
        } catch (e) {
            return { status: 500, message: e.message }
        }
    },



};

module.exports = videoRepository;