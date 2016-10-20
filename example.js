var client = require("./index")();

client.onMessage(function(message){
	console.log(message);
});
