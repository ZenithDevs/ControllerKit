const defaults: CKOptions = {
	touch: 'ontouchstart' in document.documentElement,
	keyboard: true,
	gamepad: 'getGamepads' in navigator,
	bindings: {
		// Misc.
		start: {
			keyboard: [13],
			gamepad: [9]
		},
		select: {
			keyboard: [16],
			gamepad: [8]
		},
		special: {
			keyboard: [220],
			gamepad: [16]
		},

		// Face Buttons
		a: {
			keyboard: [88],
			gamepad: [0],
		},
		b: {
			keyboard: [90],
			gamepad: [1]
		},
		x: {
			keyboard: [67],
			gamepad: [2]
		},
		y: {
			keyboard: [86],
			gamepad: [3]
		},

		// D-Pad
		up: {
			keyboard: [38],
			gamepad: [12]
		},
		down: {
			keyboard: [40],
			gamepad: [13]
		},
		left: {
			keyboard: [37],
			gamepad: [14]
		},
		right: {
			keyboard: [39],
			gamepad: [15]
		},

		// Shoulders/Triggers
		l_trigger: {
			keyboard: [49],
			gamepad: [6]
		},
		l_shoulder: {
			keyboard: [81],
			gamepad: [4]
		},
		r_trigger: {
			keyboard: [51],
			gamepad: [7]
		},
		r_shoulder: {
			keyboard: [69],
			gamepad: [5]
		},

		// Left Analog Stick
		analog_l_up: {
			keyboard: [87],
			gamepad: [10]
		},
		analog_l_down: {
			keyboard: [83],
			gamepad: [10]
		},
		analog_l_left: {
			keyboard: [65],
			gamepad: [10]
		},
		analog_l_right: {
			keyboard: [68],
			gamepad: [10]
		},
		analog_l_press: {
			keyboard: [70],
			gamepad: [10]
		},

		// Right Analog Stick
		analog_r_up: {
			keyboard: [73],
			gamepad: [10]
		},
		analog_r_down: {
			keyboard: [75],
			gamepad: [10]
		},
		analog_r_left: {
			keyboard: [74],
			gamepad: [10]
		},
		analog_r_right: {
			keyboard: [76],
			gamepad: [10]
		},
		analog_r_press: {
			keyboard: [72],
			gamepad: [11]
		}
	}
}

export default defaults