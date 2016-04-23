# spot.js

**Track mouse position relative to elements in your website.** With spot.js, you can:
- Track mouse angle relative to an element's horizontal axis.
- Track mouse distance relative to an element's center.
- Select a CSS class which will activate spot.js on its HTML elements.
- Select a CSS class which restrict the area on which mouse position is tracked.
- Have an easy time developing with on-screen helpers.
- **Get creative** with mouse events using CSS transforms.
- **NEW:** create sexy drop-shadow effects dynamically depending on mouse position.
- **NEW:** create rotation effects dynamically depending on mouse position.
- **NEW:** pass values for the new functionality as user settings.

## Live demos

[Drop-shadow](http://brainlessdeveloper.com/spot.js/demos/spot.js-drop-shadow-demo.html)
[Transform: rotate](http://brainlessdeveloper.com/spot.js/demos/spot.js-drop-shadow-demo.html)
[Drop-shadow with debugging indicators](http://brainlessdeveloper.com/spot.js/demos/spot.js-drop-shadow-demo.html)

## Examples

Sample HTML with an activeAreaClass (with CSS class "spot-area") and three "spot" class DIVs (targetClass). Upon activation of indicators, we can see the angle and distance values being stored and displayed. The values are stored when the indicators are off too.

![spot.js basic sample](http://brainlessdeveloper.com/assets/spotjs1.gif)

Adding <code>transform: rotate;</code> with JS and passing a <code>mouseDeg[i]</code> variable as value for the rotation:

![spot.js basic sample](http://brainlessdeveloper.com/assets/spotjs2.gif)

Same procedure, without indicators for clarity. Notice the DIVs do not rotate when the mouse leaves the activeAreaClass DIV. This can be disabled (thus enabling mouse tracking in the entire viewport) through settings (more on settings below).

![spot.js basic sample](http://brainlessdeveloper.com/assets/spotjs3.gif)

Coming soon: live demo on my blog and a post detailing the development process.

----------
## Installation

Add **spot.js** to your HTML document with a script tag:
```html
<script src="spot.js"></script>
```
And voila! The default settings will be loaded. Here's a template in case you want to change them. The whole thing should look like this:
```html
<script>
function setUserOpt() {
    var userOpt = {
        // General settings
        targetClass: "myTargetClass",
        activeAreaClass: "myActiveAreaClass",
        showIndicators: false,

        //Shadow settings
        shadowOn: true,
        shadowBlur: 30,
        shadowColor: "rgba(0,0,0,0.8)",

        //Rotation settings
        rotationOn: false
    };
    return userOpt;
}
</script>
<script src="spot.js"></script>
``` 

This is what the different settings do:
- **targetClass** (string, default "spot"): add this CSS class to an HTML element and **spot.js** will track its position relative to your mouse.
- **activeAreaClass** (string, default "spot-area"): add this CSS class to an HTML element to restrict mouse position tracking to elements of this class. If there's no element of this class in the HTML, then **spot.js** will track the mouse position on the entire viewport.
- **showIndicators** (boolean, default true): this will display helpers around your **targetClass** and **activeAreaClass** elements and indicate the angle (in degrees) and distance (in pixels) of them in relation to your mouse.
- **shadowOn** (boolean, default false): activates the shadow effects.
- **shadowBlur** (float, default 30): controls the parameters which ultimately render a more intense or a more blurry shadow, emulating distance from the light source. Higher values yield sharper shadows while lower values emulate longer distance and higher blur.
- **shadowColor** (string, default "rgba(0,0,0,0.6)"): pretty obvious. You can set colors with words ("green", "red") or HEX, or whatever. But remember to keep this a string.
- **rotationOn** (boolean, default false): activates rotation effects. If you use this together with shadow effects, hell will break loose. Cover your computer with a blanket before trying this at home.

##Available variables:
- **mouseDeg**[i] - Angle between the mouse position and an element's horizontal axis in degrees.
- **mouseDist**[i] - Distance between the mouse position and the element's center.

----------
## TODO / Inspiration
This plugin offers basic functionality. I'm planning to create other plugins which use this one as a dependency and offer cool stuff such as:
- **DONE** - Drop-shadow filters relative to mouse position. This will require some math. It is indeed easier when using box-shadow, but that doesn't respect a PNG's alpha layer, for example. The shadow could be scalable relative to the distance of the mouse and the elements.
- **DONE** - Rotate an element based on mouse position. I've already implemented this but it needs optimization, i.e. I need to code it again. NOTE: still needs better implementation. If you add a CSS transition to the element and the rotation goes from 360º to 0º+ then the element goes the long way. I'll see what I can do to work my way arond this.
- **Make elements rush towards wherever your cursor is,** or make them run away from it.

----------
## License
See the [LICENSE](https://github.com/brainlessdeveloper/spot.js/blob/master/LICENSE.md) file for license rights and limitations (MIT).

---------
## Feel free to collaborate!
