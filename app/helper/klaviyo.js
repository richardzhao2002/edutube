const { curly } = require('node-libcurl');
const querystring = require('querystring');

const api_key = "pk_8668cc32106223740c58fbc3d1dce4a665";

class Klaviyo {
	constructor() {
		
	}
	
	async callPOSTAPI(url,body){
		try{
			console.log(body);
			const { data } = await curly.post(url, {
  				postFields: querystring.stringify(body),
  				httpHeader: [
    				'Content-Type: application/x-www-form-urlencoded',
    				'Accept: application/json'
  				],
			})

			return data;
		}
		catch(e){
			throw e;
		}
	}

	async callGETAPI(url){
		try{
						

			const { data } = await curly.get(url, {
				httpHeader: [
					'Accept: application/json'
				],
			})
			
			return data;
		}
		catch(e){
			throw e;
		}
	}
	
	
	
	async getAllTemplates(){
		try{
			
			var url = `https://a.klaviyo.com/api/v1/email-templates?page=0&count=50&api_key=${api_key}`;

			
			
			var res_data = await this.callGETAPI(url);
			console.log("data: ",res_data);

			return res_data;
		}
		catch(e){
			throw e;
		}
	}

	

	async createNewTemplate(){
		try{
			
			var url = `https://a.klaviyo.com/api/v1/email-templates?api_key=${api_key}`;

			var body = {
				'name':'testtempl',
				'html':'<html><body><p>This is an email for {{ email }}.</p></body></html>'
			}
			
			var res_data = await this.callPOSTAPI(url,body);

			console.log("data: ",res_data);

			return res_data;
		}
		catch(e){
			throw e;
		}
	}

	async renderTemplate(template_id){
		try{
			var url = `https://a.klaviyo.com/api/v1/email-template/${template_id}/render?api_key=${api_key}`;

			var body = {
				'context': '{"email":"Hello World"}',
				'html':'<html><body><p>This is an email for {{ email }}.</p></body></html>'
			}
			
			var res_data = await this.callPOSTAPI(url,body);

			console.log("data: ",res_data);


			return res_data;
		}
		catch(e){
			throw e;
		}
	}

	async renderTemplateAndSendEmail(template_id){
		try{
			console.log("render & send email");
			var url = `https://a.klaviyo.com/api/v1/email-template/${template_id}/render?api_key=${api_key}`;

			var body = {
				'from_email':'george.washington@klaviyo.com',
				'from_name':'George Washington',
     			'subject':'Happy Fourth!',
     			'to':'[{"name":"Steve Smith","email":"pranab.roy@webskitters.com"}]',
				'context': '{"email":"Hello World"}',
			}
			
			var res_data = await this.callPOSTAPI(url,body);

			console.log("data: ",res_data);


			return res_data;
		}
		catch(e){
			throw e;
		}
	}
}

module.exports = new Klaviyo();

