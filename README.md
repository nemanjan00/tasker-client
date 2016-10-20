# tasker-client

## Example

```javascript
const exec = require('child_process').exec;

var client = require("tasker-client")({
	GATE: "http://localhost:3000/gate",
	KEYS: "home|laptop"
});

client.onMessage(function(message){
	if(message.action == "nextSong"){
		exec('playerctl next', (err, stdout, stderr) => {});
	}

	if(message.action == "pauseSong"){
		exec('playerctl pause', (err, stdout, stderr) => {});
	}

	if(message.action == "playSong"){
		exec('playerctl play', (err, stdout, stderr) => {});
	}
});

```

