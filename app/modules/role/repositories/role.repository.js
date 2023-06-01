const Role = require('role/models/role.model');
const perPage = config.PAGINATION_PERPAGE;

class RoleRepository {
    constructor() { }

    async getById(id) {
        try {
            return await Role.findById(id).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async getByField(params) {
        try {
            return await Role.findOne(params).exec();
        } catch (error) {
            throw error;
        }
    }

    async getAllByField(params) {
        try {
            return await Role.find(params).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            await Role.findById(id).lean().exec();
            return await Role.deleteOne({ _id: id }).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async updateById(data, id) {
        try {
            return await Role.findByIdAndUpdate(id, data, { new: true, upsert: true })
                .lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async save(data) {
        try {
            return await Role.create(data).lean().exec();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RoleRepository();