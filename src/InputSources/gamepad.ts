import CKInputSource from "./index";

export default class CKGamepadInput extends CKInputSource {
  private running: boolean = false;
  public index: number;
  public deadZone: number = 0.75;
  private inverseDeadZone: number = -0.75;
  public bindings: CKInputBindings;
  /**
   * Start listening for inputs
   */
  listen() {
    this.inverseDeadZone = this.deadZone * -1;
    this.state = (Object as any).fromEntries(
      Object.keys(this.bindings).map((key) => [key, false])
    );
    this.running = true;
    const listenFunction = function () {
      if (this.running == true) {
        const gamepads = navigator.getGamepads() ?? [];
        if (this.index in gamepads) {
          const gamepad = gamepads[this.index];
          let newState = Object.fromEntries(
            Object.keys(this.bindings).map((key) => [key, false])
          );

          // Get Button State
          for (let i = 0, len = gamepad.buttons.length; i < len; i++) {
            if (!gamepad.buttons[i].pressed) continue;
            let controls = Object.keys(this.bindings).filter(
              (key) => this.bindings[key]?.gamepadButton === i
            );
            for (let i = 0, len = controls.length; i < len; i++)
              newState[controls[i]] = true;
          }

          // Get Joystick State
          for (let i = 0, len = gamepad.axes.length; i < len; i++) {
            if (
              gamepad.axes[i] < this.deadZone &&
              this.inverseDeadZone < gamepad.axes[i]
            )
              continue;
            let controls = Object.entries(this.bindings).filter(
              ([key]) => this.bindings[key]?.gamepadJoystick?.axis == i
            ) as [string, CKInputBinding][];
            for (let j = 0, len = controls.length; j < len; j++) {
              let joystick = controls[j][1].gamepadJoystick;
              newState[controls[j][0]] =
                gamepad.axes[i] >= this.deadZone
                  ? joystick.direction === 1
                  : joystick.direction === -1;
            }
          }

          // Update State
          if (JSON.stringify(this.state) != JSON.stringify(newState))
            this.updateState(newState);
        }
        window.requestAnimationFrame(listenFunction);
      }
    }.bind(this);

    window.requestAnimationFrame(listenFunction);
  }

  /**
   * Stops listening for inputs
   */
  stop() {
    this.running = false;
    this.state = (Object as any).fromEntries(
      Object.keys(this.bindings).map((key) => [key, false])
    );
  }
}
