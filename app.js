const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express()
require('dotenv').config()
const axios = require('axios');
require('express-router-group');
const router = express.Router();
const path = require('path');
const PuppeteerNew = require(path.join(__dirname, '/library/Puppeteer'));
const Puppeteer = new PuppeteerNew;
 
global.axios = axios;
global.router = router;
global.fs = fs;
global.path = path;
global.that = Puppeteer;

// start router the first and goto url google.com
(async() => {
	await that.settingRequest();
	let googleTranslate = await that.goToCronMessage();
	let checkUrl = await that.page.evaluate(() => location.href);
	
	if (checkUrl != process.env.URL_TRANSLATE) {
		that.closePage();
		await that.settingRequest();
		googleTranslate = await that.goToCronMessage();
	}
	if (googleTranslate.status == 'error'
		&& googleTranslate.message.indexOf('ERR_INTERNET_DISCONNECTED') != -1) {
		console.log('The network has experienced a problem');
		process.exit(1);
	}
	if (googleTranslate.status == 'error') {
		console.log('There was an error opening google! Please try it again. '+ googleTranslate.message);
		process.exit(1);
	}
})();


// Create an HTTP service.
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`);
});