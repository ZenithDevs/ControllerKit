var ControllerKit = (function () {
    'use strict';

    const defaults = {
        touch: "ontouchstart" in document.documentElement,
        keyboard: true,
        gamepad: "getGamepads" in navigator,
        deadZone: 0.5,
        touchQuerySelector: "[data-ck-control]",
        bindings: {
            // Misc.
            start: {
                keyboard: 13,
                gamepadButton: 9,
            },
            select: {
                keyboard: 16,
                gamepadButton: 8,
            },
            special: {
                keyboard: 220,
                gamepadButton: 16,
            },
            // Face Buttons
            a: {
                keyboard: 88,
                gamepadButton: 0,
            },
            b: {
                keyboard: 90,
                gamepadButton: 1,
            },
            x: {
                keyboard: 67,
                gamepadButton: 2,
            },
            y: {
                keyboard: 86,
                gamepadButton: 3,
            },
            // D-Pad
            up: {
                keyboard: 38,
                gamepadButton: 12,
            },
            down: {
                keyboard: 40,
                gamepadButton: 13,
            },
            left: {
                keyboard: 37,
                gamepadButton: 14,
            },
            right: {
                keyboard: 39,
                gamepadButton: 15,
            },
            // Shoulders/Triggers
            l_trigger: {
                keyboard: 49,
                gamepadButton: 6,
            },
            l_shoulder: {
                keyboard: 81,
                gamepadButton: 4,
            },
            r_trigger: {
                keyboard: 51,
                gamepadButton: 7,
            },
            r_shoulder: {
                keyboard: 69,
                gamepadButton: 5,
            },
            // Left Analog Stick
            analog_l_up: {
                keyboard: 87,
                gamepadJoystick: { axis: 1, direction: -1 },
            },
            analog_l_down: {
                keyboard: 83,
                gamepadJoystick: { axis: 1, direction: 1 },
            },
            analog_l_left: {
                keyboard: 65,
                gamepadJoystick: { axis: 0, direction: -1 },
            },
            analog_l_right: {
                keyboard: 68,
                gamepadJoystick: { axis: 0, direction: 1 },
            },
            analog_l_press: {
                keyboard: 70,
                gamepadButton: 10,
            },
            // Right Analog Stick
            analog_r_up: {
                keyboard: 73,
                gamepadJoystick: { axis: 3, direction: -1 },
            },
            analog_r_down: {
                keyboard: 75,
                gamepadJoystick: { axis: 3, direction: 1 },
            },
            analog_r_left: {
                keyboard: 74,
                gamepadJoystick: { axis: 2, direction: -1 },
            },
            analog_r_right: {
                keyboard: 76,
                gamepadJoystick: { axis: 2, direction: 1 },
            },
            analog_r_press: {
                keyboard: 72,
                gamepadButton: 11,
            },
        },
    };

    class CKInputSource {
        constructor() {
            this.state = {};
            this.bindings = {};
            this.onChange = () => { };
        }
        /**
         * Starts listening for inputs
         */
        listen() {
            throw "Listen method hasn't been setup.";
        }
        /**
         * Stops listening for inputs
         */
        stop() {
            throw "Stop method hasn't been setup.";
        }
        updateState(state) {
            this.state = state;
            this.onChange(state);
        }
    }

    class CKTouchInput extends CKInputSource {
        constructor() {
            super(...arguments);
            this.querySelector = "[data-ck-control]";
            /**
             * A common event handler for touch inputs
             * @param evt The TouchEvent that triggered the event
             */
            this.touchEvent = ((evt) => {
                this.updateState(this.getPressedButtons(evt.touches));
            }).bind(this);
        }
        listen() {
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
            ["touchstart", "touchmove", "touchcancel", "touchend"].forEach((name) => {
                window.addEventListener(name, this.touchEvent);
            });
        }
        stop() {
            ["touchstart", "touchmove", "touchcancel", "touchend"].forEach((name) => {
                window.removeEventListener(name, this.touchEvent);
            });
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
        }
        /**
         * Gets the currently pressed buttons by taking touch x/y and comparing that to button positions.
         * @param touches A TouchList with the current touched elements.
         */
        getPressedButtons(touches) {
            // Get Controller positions
            // @ts-ignore
            let controls = [...document.querySelectorAll(this.querySelector)].flatMap((el) => {
                let { top, left, right, bottom } = el.getBoundingClientRect();
                return el.dataset.ckControl
                    .split(",")
                    .map((control) => ({
                    control: control.trim(),
                    rect: {
                        top,
                        left,
                        right,
                        bottom,
                    },
                }));
            });
            // Go through each, and find what buttons are pressed
            const entries = controls.map(({ control, rect }) => {
                // Find if there are any pressed buttons in the touches
                const touched = 
                // @ts-ignore
                [...touches].filter(({ clientX, clientY }) => clientX >= rect.left &&
                    clientX <= rect.right &&
                    rect.top <= clientY &&
                    rect.bottom >= clientY).length > 0;
                // Return
                return [control, touched];
            });
            // Convert entries to object
            let output = Object.fromEntries(entries);
            // Correct issue where buttons that are enabled get
            // overwritten by other buttons with the same bindings
            // (i.e. data-ck-control="a,b" and data-ck-control="a")
            let pressed = entries.filter((res) => res[1] == true);
            pressed.forEach((res) => {
                output[res[0]] = true;
            });
            // Return state
            return output;
        }
    }

    class CKKeyboardInput extends CKInputSource {
        constructor() {
            super(...arguments);
            this.keyEvent = {
                // Handle Keydown Events
                keydown: ((evt) => {
                    // Create a newState object to compare states
                    var newState = Object.assign({}, this.state);
                    this.controlsForKeyCode(evt.keyCode).forEach((control) => {
                        newState[control] = true;
                    });
                    // Update State
                    if (JSON.stringify(this.state) != JSON.stringify(newState)) {
                        this.updateState(newState);
                    }
                }).bind(this),
                // Handle Keyup Events
                keyup: ((evt) => {
                    // Create a newState object to compare states
                    var newState = Object.assign({}, this.state);
                    this.controlsForKeyCode(evt.keyCode).forEach((control) => {
                        newState[control] = false;
                    });
                    // Update State
                    if (JSON.stringify(this.state) != JSON.stringify(newState)) {
                        this.updateState(newState);
                    }
                }).bind(this),
            };
        }
        controlsForKeyCode(keyCode) {
            return Object.keys(this.bindings).filter((key) => { var _a; return ((_a = this.bindings[key]) === null || _a === void 0 ? void 0 : _a.keyboard) === keyCode; });
        }
        listen() {
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
            ["keydown", "keyup"].forEach((name) => {
                window.addEventListener(name, this.keyEvent[name]);
            });
        }
        stop() {
            ["keydown", "keyup"].forEach((name) => {
                window.removeEventListener(name, this.keyEvent[name]);
            });
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
        }
    }

    class CKGamepadInput extends CKInputSource {
        constructor() {
            super(...arguments);
            this.running = false;
            this.deadZone = 0.75;
            this.inverseDeadZone = -0.75;
        }
        /**
         * Start listening for inputs
         */
        listen() {
            this.inverseDeadZone = this.deadZone * -1;
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
            this.running = true;
            const listenFunction = function () {
                var _a;
                if (this.running == true) {
                    const gamepads = (_a = navigator.getGamepads()) !== null && _a !== void 0 ? _a : [];
                    if (this.index in gamepads) {
                        const gamepad = gamepads[this.index];
                        let newState = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
                        // Get Button State
                        for (let i = 0, len = gamepad.buttons.length; i < len; i++) {
                            if (!gamepad.buttons[i].pressed)
                                continue;
                            let controls = Object.keys(this.bindings).filter((key) => { var _a; return ((_a = this.bindings[key]) === null || _a === void 0 ? void 0 : _a.gamepadButton) === i; });
                            for (let i = 0, len = controls.length; i < len; i++)
                                newState[controls[i]] = true;
                        }
                        // Get Joystick State
                        for (let i = 0, len = gamepad.axes.length; i < len; i++) {
                            if (gamepad.axes[i] < this.deadZone &&
                                this.inverseDeadZone < gamepad.axes[i])
                                continue;
                            let controls = Object.entries(this.bindings).filter(([key]) => { var _a, _b; return ((_b = (_a = this.bindings[key]) === null || _a === void 0 ? void 0 : _a.gamepadJoystick) === null || _b === void 0 ? void 0 : _b.axis) == i; });
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
            this.state = Object.fromEntries(Object.keys(this.bindings).map((key) => [key, false]));
        }
    }

    class ControllerKit {
        constructor(options = ControllerKit.defaults) {
            // Dynamic properties
            this.sources = [];
            this.eventHandlers = [];
            this.bindings = ControllerKit.defaults.bindings;
            this.listening = false;
            // Add touch support, if enabled.
            if (options.touch) {
                let i = this.sources.push(new CKTouchInput()) - 1;
                this.sources[i].querySelector =
                    options.touchQuerySelector;
            }
            // Add keyboard support, if enabled.
            if (options.keyboard) {
                this.sources.push(new CKKeyboardInput());
            }
            // Add gamepad support, if enabled.
            if (options.gamepad) {
                window.addEventListener("gamepadconnected", (e) => {
                    let i = this.sources.push(new CKGamepadInput()) - 1;
                    this.sources[i].bindings = this.bindings;
                    this.sources[i].index = e.gamepad.index;
                    this.sources[i].deadZone = options.deadZone;
                    this.sources[i].onChange = (state) => {
                        this.eventHandlers.forEach((handler) => {
                            if (handler.event == "change") {
                                handler.handler({
                                    source: this.sources[i],
                                    state,
                                });
                            }
                        });
                    };
                    if (this.listening == true) {
                        this.sources[i].listen();
                    }
                    this.eventHandlers.forEach((handler) => {
                        if (handler.event == "connected") {
                            handler.handler(e);
                        }
                    });
                });
                window.addEventListener("gamepaddisconnected", (e) => {
                    let i = this.sources
                        .filter((v) => Object.getPrototypeOf(v).constructor.name == "CKGamepadInput")
                        .map((v, index) => index)
                        .filter((v) => v == e.gamepad.index)[0];
                    this.sources[i].stop();
                    this.sources.splice(i, 1);
                    this.eventHandlers.forEach((handler) => {
                        if (handler.event == "disconnected") {
                            handler.handler(e);
                        }
                    });
                });
            }
            // Bind controls
            if (options.bindings && options != ControllerKit.defaults) {
                for (let [control, bindings] of Object.entries(options.bindings)) {
                    this.bind(control, bindings);
                }
            }
        }
        /**
         * Bind a keyboard key, gamepad button, or touch element to a control.
         * @param control A CKControl
         * @param bindings What you want to bind the control to.
         */
        bind(control, bindings) {
            this.bindings[control] = Object.assign(Object.assign({}, this.bindings[control]), bindings);
            for (let i in this.sources) {
                this.sources[i].bindings = this.bindings;
            }
        }
        /**
         * Listen to events
         * @param event The event name
         * @param handler The event handler
         */
        on(event, handler) {
            this.eventHandlers.push({ event, handler });
        }
        /**
         * Remove an event listener
         * @param event The event name
         * @param handler The event handler
         */
        off(event, handler) {
            let index = this.eventHandlers.indexOf({ event, handler });
            if (index > -1) {
                this.eventHandlers.splice(index, 1);
            }
        }
        /**
         * Start listening for inputs.
         */
        listen() {
            for (let i in this.sources) {
                this.sources[i].onChange = (state) => {
                    this.eventHandlers.forEach((handler) => {
                        if (handler.event == "change") {
                            handler.handler({
                                source: this.sources[i],
                                state,
                            });
                        }
                    });
                };
                this.sources[i].bindings = this.bindings;
                this.sources[i].listen();
            }
            this.listening = true;
        }
        /**
         * Stop listening for inputs
         */
        stop() {
            for (let i in this.sources) {
                this.sources[i].stop();
            }
            this.listening = false;
        }
    }
    // Static properties
    ControllerKit.defaults = defaults;
    ControllerKit.InputSource = CKInputSource;

    return ControllerKit;

}());
