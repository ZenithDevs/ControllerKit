declare type CKEventName = "change" | "connected" | "disconnected";
declare type CKEventHandler = (arg0: any) => void;

declare type CKEventHandlers = {
  event: CKEventName;
  handler: CKEventHandler;
}[];

declare interface CKOptions {
  touch: boolean;
  keyboard: boolean;
  gamepad: boolean;
  touchQuerySelector: string;
  deadZone: number;
  bindings: CKInputBindings;
}

declare type CKInputState = {
  [key in CKControl]?: boolean;
};

declare type CKInputBinding = {
  keyboard?: number;
  gamepadButton?: number;
  gamepadJoystick?: { axis: number; direction: -1 | 1 };
};

declare type CKInputBindings = {
  [key in CKControl]?: CKInputBinding;
};

declare enum CKControl {
  // Misc.
  start = "start",
  select = "select",
  special = "special",

  // Face buttons
  a = "a",
  b = "b",
  x = "x",
  y = "y",

  // D-pad
  up = "up",
  down = "down",
  left = "left",
  right = "right",

  // Left Analog Stick
  analog_l_up = "analog_l_up",
  analog_l_down = "analog_l_down",
  analog_l_left = "analog_l_left",
  analog_l_right = "analog_l_right",
  analog_l_press = "analog_l_press",

  // Right Analog Stick
  analog_r_up = "analog_r_up",
  analog_r_down = "analog_r_down",
  analog_r_left = "analog_r_left",
  analog_r_right = "analog_r_right",
  analog_r_press = "analog_r_press",

  // Shoulders/triggers
  l_shoulder = "l_shoulder",
  l_trigger = "l_trigger",
  r_shoulder = "r_shoulder",
  r_trigger = "r_trigger",
}
