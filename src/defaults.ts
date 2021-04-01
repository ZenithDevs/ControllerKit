const defaults: CKOptions = {
  touch: "ontouchstart" in document.documentElement,
  keyboard: true,
  gamepad: "getGamepads" in navigator,
  deadZone: 0.75,
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
      gamepadJoystick: { axis: 1, direction: 1 },
    },
    analog_l_down: {
      keyboard: 83,
      gamepadJoystick: { axis: 1, direction: -1 },
    },
    analog_l_left: {
      keyboard: 65,
      gamepadJoystick: { axis: 0, direction: 1 },
    },
    analog_l_right: {
      keyboard: 68,
      gamepadJoystick: { axis: 0, direction: -1 },
    },
    analog_l_press: {
      keyboard: 70,
      gamepadButton: 10,
    },

    // Right Analog Stick
    analog_r_up: {
      keyboard: 73,
      gamepadJoystick: { axis: 2, direction: 1 },
    },
    analog_r_down: {
      keyboard: 75,
      gamepadJoystick: { axis: 2, direction: -1 },
    },
    analog_r_left: {
      keyboard: 74,
      gamepadJoystick: { axis: 3, direction: 1 },
    },
    analog_r_right: {
      keyboard: 76,
      gamepadJoystick: { axis: 3, direction: -1 },
    },
    analog_r_press: {
      keyboard: 72,
      gamepadButton: 11,
    },
  },
};

export default defaults;
