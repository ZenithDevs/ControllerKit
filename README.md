<div style="text-align: center;">
	<img src="docs/logo.png" alt="ControllerKit" style="width: 64px; height: 64px;">
	<p style="font-size: 32px; font-weight: 600; margin-bottom: 0px;">ControllerKit</p>
	<p style="font-size: 18px;">Responsive controller framework for the web.</p>
	<a href="https://zenithdevs.github.io/ControllerKit/demo/" class="button">See it in Action</a>
    <hr>
</div>
        
### What is ControllerKit?
<p>ControllerKit is a JavaScript library that makes adding controls to your website trivial. ControllerKit supports keyboard, touch, and gamepad inputs right off the bat, so all you have to do is bind and handle the controls.</p>
		
### Getting Started
First things first, let's install it.

```shell
$ npm i @zenithdevs/controllerkit
```

Once installed, just import it and make a new instance of the ControllerKit class. The only argument the ControllerKit class takes is options, which is optional. See [API](#api) to learn more.

```js
import ControllerKit from '@zenithdevs/controllerkit';
const controls = new ControllerKit();
```

Now we can listen for inputs by binding the on "change" event handler and running the listen method.

```js
controls.on('change', (controls) => console.log(controls));
controls.listen();
```

### API
ControllerKit was made to be simple and requires little to no configuration. The four lines in the [Getting Started](#getting-started) section may be all you need, but for those who want more customization there's more options here.

For starters, the options object in the ControllerKit constructor. Below is an example that has all the options passed, along with their default values.
```js
new ControllerKit({
    touch: true, // Enable touch input
    keyboard: true, // Enable keyboard input
    gamepad: true, // Enable gamepad input
    bindings // The bindings object, covered in the "Binding" section
})
```