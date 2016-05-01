/* GET ELEMENTS WITH SPOT-EFFECT CLASSES AND ARRANGE THEM IN ELEM OBJECT */
var spotAreaElem = document.getElementsByClassName("spot-area"),
	spotShadowElem = document.getElementsByClassName("spot-shadow"),
	spotRotateElem = document.getElementsByClassName("spot-rotate"),
	spotIndicatorElem = document.getElementsByClassName("spot-indicator"),
	indicatorOverlays = document.getElementsByClassName("spot-indicator-overlay"),
	spotShadowInstance = [],
	spotRotateInstance = [],
	spotIndicatorInstance = [],
	shadowDist = [],
	indicator = [],
	scrollTimer = null,
	spotFPS = 60,
	elems = {
		spotShadow: spotShadowElem,
		spotRotate: spotRotateElem,
		spotIndicator: spotIndicatorElem
	},
	i;
var mouseX,
	mouseY;

/* Pretty obvious what this does */
function getMousePosition(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

/* Reduce the amount of times onmousemove functions are fired */
/* Credit: http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/ */
function throttle(delay, callback) {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    }
}

/* Gets basic element info and calculates mouse-related variables */
function SpotInstance(elem) {
	this.elem = elem;
	this.elemX = elem.getBoundingClientRect().left + (elem.offsetWidth / 2);
	this.elemY = elem.getBoundingClientRect().top + (elem.offsetHeight / 2);
	this.getRadians = function() {
		var rad = Math.atan2(this.elemY - mouseY, mouseX - this.elemX);
		return rad;
	}
	this.getAngle = function() {
		var angle = -Math.round(this.getRadians() * 18000 / Math.PI) / 100;
		if (angle < 0) {
	            angle += 360;
	    }
		return angle;
	}
	this.getDistance = function() {
		var dist = Math.round(Math.sqrt(Math.pow(mouseX - this.elemX, 2) + Math.pow(this.elemY - mouseY, 2)));
		return dist;
	}
}

/* Creates new instances for each of the elements with a relevant selector */
function createSpotInstances() {
	for (i = 0; i < elems.spotIndicator.length; i += 1) {
		spotIndicatorInstance[i] = new SpotInstance(elems.spotIndicator[i]);
	}
	for (i = 0; i < elems.spotShadow.length; i += 1) {
		spotShadowInstance[i] = new SpotInstance(elems.spotShadow[i]);
	}
	for (i = 0; i < elems.spotRotate.length; i += 1) {
		spotRotateInstance[i] = new SpotInstance(elems.spotRotate[i]);
	}
	for (i = 0; i < spotIndicatorInstance.length; i += 1) {
	    indicator[i] = document.createElement("div");
	    indicator[i].className = "spot-indicator-overlay";
	    indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + spotIndicatorInstance[i].elem.getBoundingClientRect().left) + "px; top:" + (window.scrollY + spotIndicatorInstance[i].elem.getBoundingClientRect().top) + "px; height:" + spotIndicatorInstance[i].elem.offsetHeight + "px; width:" + spotIndicatorInstance[i].elem.offsetWidth + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
	    document.body.appendChild(indicator[i]);
	}
}

/* Initiates the effects, this is tied to the mousemove event */
function initiateSpotEffects(event) {
	getMousePosition(event);
	for (i = 0; i < spotShadowInstance.length; i += 1) {
        shadowDist[i] = Math.round(spotShadowInstance[i].getDistance() / 30);
        if (spotShadowInstance[i].getDistance() > 15) {
            spotShadowInstance[i].elem.style.webkitFilter = "drop-shadow(" + shadowDist[i] * -Math.round(Math.cos(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] * Math.round(Math.sin(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] + "px rgba(0,0,0,0.8))";
            spotShadowInstance[i].elem.style.filter = "drop-shadow(" + shadowDist[i] * -Math.round(Math.cos(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] * Math.round(Math.sin(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] + "px rgba(0,0,0,0.8))";
        } else {
            spotShadowInstance[i].elem.style.webkitFilter = "none";
            spotShadowInstance[i].elem.style.filter = "none";
        }
	}
	for (i = 0; i < spotRotateInstance.length; i += 1) {
		spotRotateInstance[i].elem.style.transform = "rotate(" + spotRotateInstance[i].getAngle() + "deg)";
	}
}

/* This is tied to the mousemove event */
function updateIndicatorInfo() {
	for (i = 0; i < spotIndicatorInstance.length; i += 1) {
		indicator[i].innerHTML = spotIndicatorInstance[i].getDistance() + "px " + spotIndicatorInstance[i].getAngle() + "º";
	}
}

/* Because we don't want new instances taking positions of already rotated elements */
function clearAllEffects() {
	for (i = 0; i < spotRotateInstance.length; i += 1) {
		spotRotateInstance[i].elem.style.transform = "rotate(0deg)";
	}
	while(indicatorOverlays[0]) {
		indicatorOverlays[0].parentNode.removeChild(indicatorOverlays[0]);
	}
}

/* EVENT LISTENERS */

window.onmousemove = throttle(1000 / spotFPS, function(event) {
	initiateSpotEffects(event);
	updateIndicatorInfo();
});

window.onload = function() {
	createSpotInstances();
}

window.onresize = function() {
	clearAllEffects();
	createSpotInstances();
}

window.onscroll = function() {
	if(scrollTimer !== null) {
		clearTimeout(scrollTimer);
	}
	scrollTimer = setTimeout(function() {
		clearAllEffects();
		createSpotInstances();
	}, 50);
}