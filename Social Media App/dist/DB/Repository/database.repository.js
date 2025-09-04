"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options }) {
        return await this.model.create(data, options);
    }
    async findOne({ filter, select, options }) {
        return await this.model.findOne(filter, select, options);
    }
    async updateOne({ filter, update, }) {
        return await this.model.updateOne(filter, update);
    }
}
exports.DatabaseRepository = DatabaseRepository;
