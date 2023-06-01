const postscript = require('../../helper/postscript.js');
const klaviyo = require('../../helper/klaviyo.js');


class TestcodeController {

    constructor() {
        this.user = [];
    }

    async checkCode(req,res){
        try {
                      
            // var res_data = await postscript.createSubscriber();

            
            // var res_data = await postscript.sendSMS();
            // var res_data = await postscript.getKeywords();

            // var res_data = await klaviyo.createNewTemplate();
            // var res_data = await klaviyo.renderTemplate('ViUREH');
            var res_data = await klaviyo.renderTemplateAndSendEmail('ViUREH');
            
            
            return { status: 200, data: res_data, message: "Test api" };
            
        } catch (e) {
            console.log("error",e.message)            
            return { status: 201, data: {}, message: e.message};
        }
    }

}

module.exports = new TestcodeController();
