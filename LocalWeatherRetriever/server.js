var express = require('express');

var MetaWeather = require('metaweather');

const iplocation = require("iplocation").default;

const publicIp = require('public-ip');
 
var mw = new MetaWeather;
 
var app = express()

app.use(express.static('public'));

app.get('/weather', async function(req, resReturn) {
	//get the users public ip
		iplocation(await publicIp.v4())
		.then((res) => {
			// derive the location of the ip address
			mw.search().latLon({lat: res.latitude,lon: res.longitude})
			.then(function(respo) {	
				//pass the locational results and return a json object containing weather forecast data to display in the front-end
				mw.location(respo.body[0].woeid).then(function(response) {
					response.body.ip = res.ip;
					resReturn.send(response.body);
				});
			});
		})
		.catch(err => {
			console.log(err)
		});
});

app.listen(3000);