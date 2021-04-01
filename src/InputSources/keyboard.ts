import CKInputSource from "./index";

export default class CKKeyboardInput extends CKInputSource {
  private readonly keyEvent: {
    [key: string]: (arg0: KeyboardEvent) => void;
  } = {
    // Handle Keydown Events
    keydown: ((evt: KeyboardEvent) => {
      // Create a newState object to compare states
      var newState = { ...this.state };
      this.controlsForKeyCode(evt.keyCode).forEach((control) => {
        newState[control] = true;
      });

      // Update State
      if (JSON.stringify(this.state) != JSON.stringify(newState)) {
        this.updateState(newState);
      }
    }).bind(this),

    // Handle Keyup Events
    keyup: ((evt: KeyboardEvent) => {
      // Create a newState object to compare states
      var newState = (Object as any).assign({}, this.state);
      this.controlsForKeyCode(evt.keyCode).forEach((control) => {
        newState[control] = false;
      });

      // Update State
      if (JSON.stringify(this.state) != JSON.stringify(newState)) {
        this.updateState(newState);
      }
    }).bind(this),
  };

  controlsForKeyCode(keyCode: number) {
    return Object.keys(this.bindings).filter(
      (key) => this.bindings[key]?.keyboard === keyCode
    );
  }

  listen() {
    this.state = (Object as any).fromEntries(
      Object.keys(this.bindings).map((key) => [key, false])
    );
    ["keydown", "keyup"].forEach((name) => {
      window.addEventListener(name, this.keyEvent[name]);
    });
  }

  stop() {
    ["keydown", "keyup"].forEach((name) => {
      window.removeEventListener(name, this.keyEvent[name]);
    });
    this.state = (Object as any).fromEntries(
      Object.keys(this.bindings).map((key) => [key, false])
    );
  }
}
