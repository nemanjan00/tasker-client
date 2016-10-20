var WebSocket = require('ws');

var handler = {
	keys: undefined,
	gate: undefined,
	interval: undefined,
	timeout: undefined,

	callbacks: [],

	init: function(opts){
		if(opts == undefined){
			opts = {};
		}

		handler.keys = (opts.KEYS || process.env.KEYS || 'home|laptop').split("|");
		handler.gate = opts.GATE || process.env.GATE || 'ws://localhost:3000/gate';

		handler.connect();

		return handler;
	},
	connect: function(){
		handler.ws = new WebSocket(handler.gate);

		handler.ws.on("error", function(){
			if(handler.timeout != undefined){
				clearTimeout(handler.timeout);
			}

			if(handler.interval != undefined){
				clearInterval(handler.interval);
			}

			handler.timeout = setTimeout(handler.connect, 1000);
		});

		handler.ws.on('open', function open() {
			try { 
				handler.ws.send(JSON.stringify({
					message: "subscribe",
					keys: handler.keys
				}));
			}
			catch (e) {
				console.log(e);

				handler.connect();
			}
		});

		handler.ws.on('message', function(data, flags) {
			data = JSON.parse(data);

			if(data.action != undefined){
				if(data.action.indexOf("_") != 0){
					handler.callbacks.forEach(function(callback){
						callback(data);
					});
				}
			}
		});

		if(handler.interval != undefined){
			clearInterval(handler.interval);
		}

		handler.interval = setInterval(handler.ping, 1000);
	},
	ping: function(){
		try { 
			handler.ws.send(JSON.stringify({message: "ping"}));
		}
		catch (e) {
			handler.connect();
		}
	},
	onMessage: function(callback){
		handler.callbacks.push(callback);
	}
}

module.exports = function(opts){
	return handler.init(opts);
}

