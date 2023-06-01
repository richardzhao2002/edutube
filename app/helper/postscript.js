const axios = require('axios');

const api_key = "sk_c7d73df76efc78e496d3673176b58e50";

class Postscript {
	constructor() {
		
	}
	
	async callPOSTAPI(url,body){
		try{

			console.log("will call the post api");

			var headers = {
				'accept': 'application/json',
				'content-type': 'application/json',				
				'X-Postscript-Shop-Token': 'sk_c7d73df76efc78e496d3673176b58e50',
				// 'Authorization' : `Bearer ${api_key}`
			}

			var res_data = await axios({
				method: 'POST',
				url: url,
				data: body,
				headers: headers
			});

			return res_data
		}
		catch(e){
			throw e;
		}

	}
	async callGETAPI(url){
		try{
			var headers = {
				'accept': 'application/json',
				'content-type': 'application/json',
				'Authorization' : `Bearer ${api_key}`
			}

			const options = {
				method: 'GET',
				url: url,
				headers: headers
			};
			var res_data = await axios(options);
			console.log("data: ",res_data.data);

			return res_data.data;
		}
		catch(e){
			throw e;
		}
	}
	
	
	async sendSMS(){
		try{

			console.log("send SMS");
		
			const url = 'https://api.postscript.io/api/v2/message_requests';
			
			var body = {
				"subscriber_id":"7980981798",
				"phone":"7980981798",
				"country":"IN",
				"body":"Hello world",
				"category":"conversational"
			}

			var resData = await this.callPOSTAPI(url,body)


			console.log("call 3");

			console.log(resData);
			return resData;
			
		}
		catch(e){
			console.log(e.message);
			throw e;
		}
	}

	async getSubscribers(page){
		try{
			var url = 'https://api.postscript.io/api/v2/subscribers?page='+page;
			
			var res_data = await this.callGETAPI(url);
			console.log("data: ",res_data);

			return res_data;
		}
		catch(e){
			throw e;
		}
	}

	async getKeywords(){
		try{
		
			var url = 'https://api.postscript.io/api/v2/keywords';
			
			var res_data = await this.callGETAPI(url);
			console.log("data: ",res_data);

			return res_data;
			
		}
		catch(e){
			throw e;
		}
	}
	
	async createSubscriber(){
		try{
			console.log("create subscriber");
			var url = 'https://api.postscript.io/api/v2/subscribers';

			var body = {
				keyword_id: "kw_31de74b53cedd4f9",
				phone_number: "+917980981798",
				origin: "other"
			}

			var resData = await this.callPOSTAPI(url,body)

			return resData;
		}
		catch(e){
			console.log(e);
			throw e;
		}
	}
}

module.exports = new Postscript();

