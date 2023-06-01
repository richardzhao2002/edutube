var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


const contactSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

contactSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('contact-details', contactSchema);