export default class CKInputSource {
	public state: CKInputState = {}

	/**
	 * Starts listening for inputs
	 */
	listen() {
		throw 'Listen method hasn\'t been setup.'
	}

	/**
	 * Stops listening for inputs
	 */
	stop() {
		throw 'Stop method hasn\'t been setup.'
	}

	public bindings: CKInputBindings = {};

	public onChange: (arg0: CKInputState) => void = () => {};

	updateState(state: CKInputState) {
		this.state = state;
		this.onChange(state);
	}
}