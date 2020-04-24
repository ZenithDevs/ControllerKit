import CKInputSource from './index'

export default class CKGamepadInput extends CKInputSource {

	private running: boolean = false;
	public index: number;

	/**
	 * Start listening for inputs
	 */
	listen() {
		this.state = (Object as any).fromEntries(Object.keys(this.bindings).map(key => [key, false]));
		this.running = true;
		const listenFunction = ((timestamp: any) => {
			if (this.running == true) {
				const gamepads = navigator.getGamepads() ?? [];
				if (this.index in gamepads) {
					try {
						const gamepad = gamepads[this.index];
						let newState = (Object as any).fromEntries(Object.keys(this.bindings).map(key => [key, false]));
						for (var i in gamepad.buttons) {
							if (gamepad.buttons[i].pressed == true) {
								let controls = this.controlsForButtonIndex(parseInt(i));
								for (var index in controls) {
									newState[controls[index]] = true;
								}
							}
						}
						
						// Update State
						if (JSON.stringify(this.state) != JSON.stringify(newState)) {
							this.updateState(newState);
						}
					} catch(err) {}
				}
				window.requestAnimationFrame(listenFunction);
			}
		}).bind(this);

		window.requestAnimationFrame(listenFunction)
	}

	controlsForButtonIndex(index: number) {
		return Object.keys(this.bindings).filter(key => this.bindings[key]?.gamepad?.indexOf(index) > -1);
	}

	/**
	 * Stops listening for inputs
	 */
	stop() {
		this.running = false;
		this.state = (Object as any).fromEntries(Object.keys(this.bindings).map(key => [key, false]));
	}
}