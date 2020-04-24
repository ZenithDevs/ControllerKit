/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var defaults = {
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
            gamepad: [0]
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
};

var CKInputSource = /** @class */ (function () {
    function CKInputSource() {
        this.state = {};
        this.bindings = {};
        this.onChange = function () { };
    }
    /**
     * Starts listening for inputs
     */
    CKInputSource.prototype.listen = function () {
        throw 'Listen method hasn\'t been setup.';
    };
    /**
     * Stops listening for inputs
     */
    CKInputSource.prototype.stop = function () {
        throw 'Stop method hasn\'t been setup.';
    };
    CKInputSource.prototype.updateState = function (state) {
        this.state = state;
        this.onChange(state);
    };
    return CKInputSource;
}());

var CKTouchInput = /** @class */ (function (_super) {
    __extends(CKTouchInput, _super);
    function CKTouchInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * A common event handler for touch inputs
         * @param evt The TouchEvent that triggered the event
         */
        _this.touchEvent = (function (evt) {
            _this.updateState(_this.getPressedButtons(evt.touches));
        }).bind(_this);
        return _this;
    }
    CKTouchInput.prototype.listen = function () {
        var _this = this;
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
        ['touchstart', 'touchmove', 'touchcancel', 'touchend'].forEach(function (name) {
            window.addEventListener(name, _this.touchEvent);
        });
    };
    CKTouchInput.prototype.stop = function () {
        var _this = this;
        ['touchstart', 'touchmove', 'touchcancel', 'touchend'].forEach(function (name) {
            window.removeEventListener(name, _this.touchEvent);
        });
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
    };
    /**
     * Gets the currently pressed buttons by taking touch x/y and comparing that to button positions.
     * @param touches A TouchList with the current touched elements.
    */
    CKTouchInput.prototype.getPressedButtons = function (touches) {
        // Get Controller positions
        // @ts-ignore
        var controls = __spreadArrays(document.querySelectorAll('[data-ck-control]')).flatMap(function (el) {
            var _a = el.getBoundingClientRect(), top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
            return el.dataset.ckControl.split(',').map(function (control) {
                return ({
                    control: control.trim(),
                    rect: {
                        top: top, left: left, right: right, bottom: bottom
                    }
                });
            });
        });
        // Go through each, and find what buttons are pressed
        var entries = controls.map(function (_a) {
            var control = _a.control, rect = _a.rect;
            // Find if there are any pressed buttons in the touches
            // @ts-ignore
            var touched = __spreadArrays(touches).filter(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY;
                return (clientX >= rect.left && clientX <= rect.right &&
                    rect.top <= clientY && rect.bottom >= clientY);
            }).length > 0;
            // Return
            return [control, touched];
        });
        // Convert entries to object
        var output = Object.fromEntries(entries);
        // Correct issue where buttons that are enabled get
        // overwritten by other buttons with the same bindings 
        // (i.e. data-ck-control="a,b" and data-ck-control="a")
        var pressed = entries.filter(function (res) { return res[1] == true; });
        pressed.forEach(function (res) {
            output[res[0]] = true;
        });
        // Return state
        return output;
    };
    return CKTouchInput;
}(CKInputSource));

var CKKeyboardInput = /** @class */ (function (_super) {
    __extends(CKKeyboardInput, _super);
    function CKKeyboardInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keyEvent = {
            // Handle Keydown Events
            keydown: (function (evt) {
                // Create a newState object to compare states
                var newState = __assign({}, _this.state);
                _this.controlsForKeyCode(evt.keyCode).forEach(function (control) {
                    newState[control] = true;
                });
                // Update State
                if (JSON.stringify(_this.state) != JSON.stringify(newState)) {
                    _this.updateState(newState);
                }
            }).bind(_this),
            // Handle Keyup Events
            keyup: (function (evt) {
                // Create a newState object to compare states
                var newState = Object.assign({}, _this.state);
                _this.controlsForKeyCode(evt.keyCode).forEach(function (control) {
                    newState[control] = false;
                });
                // Update State
                if (JSON.stringify(_this.state) != JSON.stringify(newState)) {
                    _this.updateState(newState);
                }
            }).bind(_this)
        };
        return _this;
    }
    CKKeyboardInput.prototype.controlsForKeyCode = function (keyCode) {
        var _this = this;
        return Object.keys(this.bindings).filter(function (key) { var _a, _b; return ((_b = (_a = _this.bindings[key]) === null || _a === void 0 ? void 0 : _a.keyboard) === null || _b === void 0 ? void 0 : _b.indexOf(keyCode)) > -1; });
    };
    CKKeyboardInput.prototype.listen = function () {
        var _this = this;
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
        ['keydown', 'keyup'].forEach(function (name) {
            window.addEventListener(name, _this.keyEvent[name]);
        });
    };
    CKKeyboardInput.prototype.stop = function () {
        var _this = this;
        ['keydown', 'keyup'].forEach(function (name) {
            window.removeEventListener(name, _this.keyEvent[name]);
        });
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
    };
    return CKKeyboardInput;
}(CKInputSource));

var CKGamepadInput = /** @class */ (function (_super) {
    __extends(CKGamepadInput, _super);
    function CKGamepadInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.running = false;
        return _this;
    }
    /**
     * Start listening for inputs
     */
    CKGamepadInput.prototype.listen = function () {
        var _this = this;
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
        this.running = true;
        var listenFunction = (function (timestamp) {
            var _a;
            if (_this.running == true) {
                var gamepads = (_a = navigator.getGamepads()) !== null && _a !== void 0 ? _a : [];
                if (_this.index in gamepads) {
                    try {
                        var gamepad = gamepads[_this.index];
                        var newState = Object.fromEntries(Object.keys(_this.bindings).map(function (key) { return [key, false]; }));
                        for (var i in gamepad.buttons) {
                            if (gamepad.buttons[i].pressed == true) {
                                var controls = _this.controlsForButtonIndex(parseInt(i));
                                for (var index in controls) {
                                    newState[controls[index]] = true;
                                }
                            }
                        }
                        // Update State
                        if (JSON.stringify(_this.state) != JSON.stringify(newState)) {
                            _this.updateState(newState);
                        }
                    }
                    catch (err) { }
                }
                window.requestAnimationFrame(listenFunction);
            }
        }).bind(this);
        window.requestAnimationFrame(listenFunction);
    };
    CKGamepadInput.prototype.controlsForButtonIndex = function (index) {
        var _this = this;
        return Object.keys(this.bindings).filter(function (key) { var _a, _b; return ((_b = (_a = _this.bindings[key]) === null || _a === void 0 ? void 0 : _a.gamepad) === null || _b === void 0 ? void 0 : _b.indexOf(index)) > -1; });
    };
    /**
     * Stops listening for inputs
     */
    CKGamepadInput.prototype.stop = function () {
        this.running = false;
        this.state = Object.fromEntries(Object.keys(this.bindings).map(function (key) { return [key, false]; }));
    };
    return CKGamepadInput;
}(CKInputSource));

var ControllerKit = /** @class */ (function () {
    function ControllerKit(options) {
        var _this = this;
        if (options === void 0) { options = ControllerKit.defaults; }
        // Dynamic properties
        this.sources = [];
        this.eventHandlers = [];
        this.bindings = ControllerKit.defaults.bindings;
        this.listening = false;
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
            window.addEventListener("gamepadconnected", function (e) {
                var i = _this.sources.push(new CKGamepadInput()) - 1;
                _this.sources[i].bindings = _this.bindings;
                _this.sources[i].index = e.gamepad.index;
                _this.sources[i].onChange = function (state) {
                    _this.eventHandlers.forEach(function (handler) {
                        if (handler.event == 'change') {
                            handler.handler({
                                source: _this.sources[i],
                                state: state
                            });
                        }
                    });
                };
                if (_this.listening == true) {
                    _this.sources[i].listen();
                }
                _this.eventHandlers.forEach(function (handler) {
                    if (handler.event == 'connected') {
                        handler.handler(e);
                    }
                });
            });
            window.addEventListener("gamepaddisconnected", function (e) {
                var i = _this.sources.filter(function (v) { return Object.getPrototypeOf(v).constructor.name == 'CKGamepadInput'; }).map(function (v, index) { return index; }).filter(function (v) { return v == e.gamepad.index; })[0];
                _this.sources[i].stop();
                _this.sources.splice(i, 1);
                _this.eventHandlers.forEach(function (handler) {
                    if (handler.event == 'disconnected') {
                        handler.handler(e);
                    }
                });
            });
        }
        // Bind controls
        if (options.bindings && options != ControllerKit.defaults) {
            for (var _i = 0, _a = Object.entries(options.bindings); _i < _a.length; _i++) {
                var _b = _a[_i], control = _b[0], bindings = _b[1];
                this.bind(control, bindings);
            }
        }
    }
    /**
     * Bind a keyboard key, gamepad button, or touch element to a control.
     * @param control A CKControl
     * @param bindings What you want to bind the control to.
     */
    ControllerKit.prototype.bind = function (control, bindings) {
        this.bindings[control] = __assign(__assign({}, this.bindings[control]), bindings);
        for (var i in this.sources) {
            this.sources[i].bindings = this.bindings;
        }
    };
    /**
     * Listen to events
     * @param event The event name
     * @param handler The event handler
     */
    ControllerKit.prototype.on = function (event, handler) {
        this.eventHandlers.push({ event: event, handler: handler });
    };
    /**
     * Remove an event listener
     * @param event The event name
     * @param handler The event handler
     */
    ControllerKit.prototype.off = function (event, handler) {
        var index = this.eventHandlers.indexOf({ event: event, handler: handler });
        if (index > -1) {
            this.eventHandlers.splice(index, 1);
        }
    };
    /**
     * Start listening for inputs.
     */
    ControllerKit.prototype.listen = function () {
        var _this = this;
        var _loop_1 = function (i) {
            this_1.sources[i].onChange = function (state) {
                _this.eventHandlers.forEach(function (handler) {
                    if (handler.event == 'change') {
                        handler.handler({
                            source: _this.sources[i],
                            state: state
                        });
                    }
                });
            };
            this_1.sources[i].bindings = this_1.bindings;
            this_1.sources[i].listen();
        };
        var this_1 = this;
        for (var i in this.sources) {
            _loop_1(i);
        }
        this.listening = true;
    };
    /**
     * Stop listening for inputs
     */
    ControllerKit.prototype.stop = function () {
        for (var i in this.sources) {
            this.sources[i].stop();
        }
        this.listening = false;
    };
    // Static properties
    ControllerKit.defaults = defaults;
    ControllerKit.InputSource = CKInputSource;
    return ControllerKit;
}());

export default ControllerKit;
