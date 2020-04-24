var controls = new ControllerKit();

document.querySelector('#output').innerHTML = "";
document.querySelector('#gamepads').innerHTML = 'getGamepads' in navigator ? navigator.getGamepads().length : '0';
document.querySelector('#gamepad-events').innerHTML = 'GamepadEvent' in window ? 'true' : 'false';

controls.on('change', (state) => {
	document.querySelector('#output').innerHTML = Object.keys(state)
	.filter(key => state[key])
	.map(key => {
		return `${key}: ${state[key]}`
	}).join('<br>')
	console.log(state);
});

controls.on('connected', (evt) => {
	document.querySelector('#gamepads').innerHTML = navigator.getGamepads().length;
	// document.querySelector('#output').innerHTML = `Controller connected with id "${evt.gamepad.id}" and index "${evt.gamepad.index}"`
	console.log('Controller connected.', evt.gamepad);
});

controls.on('disconnected', (evt) => {
	document.querySelector('#output').innerHTML = `Controller disconnected with id "${evt.gamepad.id}" and index "${evt.gamepad.index}"`
	console.log('Controller disconnected.', evt.gamepad);
});

controls.listen();