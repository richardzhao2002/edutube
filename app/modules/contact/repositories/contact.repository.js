const mongoose = require('mongoose');
const contactInfo = require('contact/models/contact.model');
const perPage = config.PAGINATION_PERPAGE;

const contactRepository = {
  getAllContacts: async (req) => {
    try {
      var conditions = {};
      var and_clauses = [];
      and_clauses.push({
        "isDeleted": false
      });

      if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
        and_clauses.push({
          $or: [
            { 'name': { $regex: req.body.query.generalSearch, $options: 'i' } }
          ]
        });
      }
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

      var aggregate = contactInfo.aggregate([
        {
          $project: {
            _id: "$_id",
            name: "$name",
            email: "$email",
            phone: "$phone",
            status: "$status",
            isDeleted: "$isDeleted"
          }
        },
        {
          $match: conditions
        },
        sortOperator
      ]);

      var options = {
        page: req.body.pagination.page,
        limit: req.body.pagination.perpage
      };
      let allRecord = await contactInfo.aggregatePaginate(aggregate, options);

      return allRecord;
    } catch (e) {
      throw (e);
    }
  },


  getById: async (id) => {

    try {
      let record = await contactInfo.findById(id).lean().exec();

      if (!record) {
        return null;
      }
      return record;

    } catch (e) {
      throw e;
    }
  },


  getByField: async (params) => {

    try {
      let record = await contactInfo.findOne(params).exec();

      if (!record) {
        return null;
      }
      return record;

    } catch (e) {
      throw e;
    }
  },

  getAllByField: async (params) => {

    try {
      let record = await contactInfo.find(params).sort({
        'name': 1
      }).exec();

      if (!record) {
        return null;
      }
      return record;

    } catch (e) {
      throw e;
    }
  },



  save: async (data) => {
    try {
      let save = await contactInfo.create(data);
      if (!save) {
        return null;
      }
      return save;
    } catch (e) {
      throw e;
    }
  },

  saveMany: async (data) => {
    try {
      let save = await contactInfo.insertMany(data, { ordered: false, });
      if (!save) {
        return null;
      }
      return save;
    } catch (e) {
      if (!e.code == 11000) {
        throw e;
      }
    }
  },

  getDocumentCount: async (params) => {
    try {
      let recordCount = await contactInfo.countDocuments(params);
      if (!recordCount) {
        return 0;
      }
      return recordCount;
    } catch (e) {
      throw e;
    }
  },

  delete: async (id) => {
    try {
      let record = await contactInfo.findById(id);
      if (record) {
        let recordDelete = await contactInfo.findByIdAndUpdate(id, {
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
      let record = await contactInfo.findByIdAndUpdate(id, data, {
        new: true
      });
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      throw e;
    }
  },

  updateByField: async (field, fieldValue, data) => {
    //todo: update by field
  }
}

module.exports = contactRepository;