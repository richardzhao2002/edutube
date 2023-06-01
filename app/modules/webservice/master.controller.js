const roleRepo=require("role/repositories/role.repository");

class mastterController{
    constructor(){

    }
    /**
     * //@Method:roleBySlug
     * //@Description:To get role list with respect to rol
     */
    async roleBySlug(req,res){
        try{
            if(!req.params.slug){
                return{status:201,data:{},message:"Please Enter slug"}
            }
            const roleData=await roleRepo.getByField({"role":req.params.slug});
            if(!_.isEmpty(roleData)){
                return{status:200,data:roleData,message:"Role data fetched successfully"}
            }else{
                return{status:201,data:{},message:"There is no any role."}
            }

        }catch(err){
            return{status:500,message:err.message}
        }
    }
};
module.exports=new mastterController()