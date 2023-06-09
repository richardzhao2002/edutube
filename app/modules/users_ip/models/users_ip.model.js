const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const mongooseAggregate=require("mongoose-aggregate-paginate");

const ipSchema=new Schema({
    user_id:{type:Schema.Types.ObjectId,ref:"User",default:null},
    ip:{type:String,default:null},
    status:{type:String,default:"Active",enum:["Active","Inactive"]},
    isOnline:{type:Boolean,default:true,enum:[true,false]},
    isDeleted:{type:Boolean,default:false,enum:[true,false]}

},{versionKey:false,timestamps:true});

//For Plugin
ipSchema.plugin(mongooseAggregate);

//Create DB for users_ip and expose it to our DB 

module.exports=mongoose.model("users_ip",ipSchema);