import CKInputSource from './index'

export default class CKTouchInput extends CKInputSource {

	/**
	 * A common event handler for touch inputs
	 * @param evt The TouchEvent that triggered the event
	 */
	private readonly touchEvent = ((evt: TouchEvent) => {
		this.updateState(this.getPressedButtons(evt.touches));
	}).bind(this);


	listen() {
		this.state = (Object as any).fromEntries(Object.keys(this.bindings).map(key => [key, false]));
		['touchstart', 'touchmove', 'touchcancel', 'touchend'].forEach(name => {
			window.addEventListener(name, this.touchEvent);
		});
	}

	stop() {
		['touchstart', 'touchmove', 'touchcancel', 'touchend'].forEach(name => {
			window.removeEventListener(name, this.touchEvent);
		});
		this.state = (Object as any).fromEntries(Object.keys(this.bindings).map(key => [key, false]));
	}

	/** 
	 * Gets the currently pressed buttons by taking touch x/y and comparing that to button positions.
	 * @param touches A TouchList with the current touched elements.
	*/
	getPressedButtons(touches: TouchList) {
		// Get Controller positions
		// @ts-ignore
		let controls = [...document.querySelectorAll('[data-ck-control]')].flatMap(el => {
			let { top, left, right, bottom } = el.getBoundingClientRect();
			return (el as any).dataset.ckControl.split(',').map((control: string) =>
				({
					control: control.trim(),
					rect: {
						top, left, right, bottom
					}
				})
			);
		});

		// Go through each, and find what buttons are pressed
		const entries = controls.map(({ control, rect }: any) => {

			// Find if there are any pressed buttons in the touches
			// @ts-ignore
			const touched = [...touches].filter(({ clientX, clientY}) => 
				(
					clientX >= rect.left && clientX <= rect.right && 
					rect.top <= clientY  && rect.bottom >= clientY
				)
			).length > 0;

			// Return
			return [control, touched]
		});

		// Convert entries to object
		let output = (Object as any).fromEntries(entries)

		// Correct issue where buttons that are enabled get
		// overwritten by other buttons with the same bindings 
		// (i.e. data-ck-control="a,b" and data-ck-control="a")
		let pressed = entries.filter((res: [string, boolean]) => res[1] == true);
		pressed.forEach((res: [string, boolean]) => {
			output[res[0]] = true
		});

		// Return state
		return output;
	}
}