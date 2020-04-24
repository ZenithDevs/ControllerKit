
import CKDefaults from './defaults';

// Import Sources
import CKInputSource from "./InputSources/index";
import CKTouchInput from "./InputSources/touch";
import CKKeyboardInput from "./InputSources/keyboard";
import CKGamepadInput from "./InputSources/gamepad";

export default class ControllerKit {
	// Static properties
	private static defaults: CKOptions = CKDefaults;
	private static InputSource = CKInputSource;

	// Dynamic properties
	private sources: CKInputSource[] = [];
	private eventHandlers: CKEventHandlers = [];
	private bindings: CKInputBindings = ControllerKit.defaults.bindings;
	private listening: boolean = false;
	
	constructor(options: CKOptions = ControllerKit.defaults) {
		// Add touch support, if enabled.
		if (options.touch != false) {
			this.sources.push(new CKTouchInput());
		}

		// Add keyboard support, if enabled.
		if (options.keyboard != false) {
			this.sources.push(new CKKeyboardInput());
		}

		// Add gamepad support, if enabled.
		if (options.gamepad != false) {
			window.addEventListener("gamepadconnected", (e: GamepadEvent) => {
				let i = this.sources.push(new CKGamepadInput()) - 1;
				this.sources[i].bindings = this.bindings;
				(this.sources[i] as CKGamepadInput).index = e.gamepad.index;
				this.sources[i].onChange = (state) => {
					this.eventHandlers.forEach(handler => {
						if (handler.event == 'change') {
							handler.handler(state);
						}
					})
				}
				if (this.listening == true) {
					this.sources[i].listen();
				}
				this.eventHandlers.forEach(handler => {
					if (handler.event == 'connected') {
						handler.handler(e);
					}
				})
			});
			window.addEventListener("gamepaddisconnected", (e: GamepadEvent) => {
				let i = this.sources.filter(v => Object.getPrototypeOf(v).constructor.name == 'CKGamepadInput').map((v, index) => index).filter(v => v == e.gamepad.index)[0];
				this.sources[i].stop();
				this.sources.splice(i, 1);
				this.eventHandlers.forEach(handler => {
					if (handler.event == 'disconnected') {
						handler.handler(e);
					}
				})
			});
		}

		// Bind controls
		if (options.bindings && options != ControllerKit.defaults) {
			for (let [control, bindings] of (Object as any).entries(options.bindings)) {
				this.bind(control, bindings);
			}
		}
	}

	/**
	 * Bind a keyboard key, gamepad button, or touch element to a control.
	 * @param control A CKControl
	 * @param bindings What you want to bind the control to.
	 */
	public bind(control: CKControl, bindings: CKInputBinding) {
		this.bindings[control] = {
			...this.bindings[control],
			...bindings,
		};
		for (let i in this.sources) {
			this.sources[i].bindings = this.bindings;
		}
	}

	/**
	 * Listen to events
	 * @param event The event name
	 * @param handler The event
	 */
	public on(event: string, handler: CKEventHandler) {
		this.eventHandlers.push({ event, handler });
	}

	/**
	 * Start listening for inputs.
	 */
	public listen() {
		for (let i in this.sources) {
			this.sources[i].onChange = (state) => {
				this.eventHandlers.forEach(handler => {
					if (handler.event == 'change') {
						handler.handler(state);
					}
				})
			}
			this.sources[i].bindings = this.bindings;
			this.sources[i].listen();
		}
		this.listening = true;
	}

	/**
	 * Stop listening for inputs
	 */
	public stop() {
		for (let i in this.sources) {
			this.sources[i].stop();
		}
		this.listening = false;
	}
}