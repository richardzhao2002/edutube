const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ['Active', 'Inactive'];

const videoSchema = new Schema({
    title: { type: String, default: '' },
    video: { type: String, default: '' },
    description:{type:String,default:""},
    thumbnail_image: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: status },
    isActive: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true, versionKey: false });

// For pagination
videoSchema.plugin(mongooseAggregatePaginate);

// create the model for Shop and expose it to our app
module.exports = mongoose.model('Video', videoSchema);