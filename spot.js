/* GET ELEMENTS WITH SPOT-EFFECT CLASSES AND ARRANGE THEM IN ELEM OBJECT */
var spotShadowElem = document.getElementsByClassName("spot-shadow"),
	spotRotateElem = document.getElementsByClassName("spot-rotate"),
	spotIndicatorElem = document.getElementsByClassName("spot-indicator"),
	spotShadowInstance = [],
	spotRotateInstance = [],
	spotIndicatorInstance = [],
	shadowDist = [],
	indicator = [],
	elems = {
		spotShadow: spotShadowElem,
		spotRotate: spotRotateElem,
		spotIndicator: spotIndicatorElem
	},
	i;
var mouseX,
	mouseY;

/* GET ANGLE FROM CURSOR TO ELEMENT HORIZONTAL AXIS */
function getMousePosition(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

/* DEFINE ELEMENT CONSTRUCTOR */
function SpotInstance(elem) {
	this.elem = elem;
	const elemX = window.scrollX + elem.getBoundingClientRect().left + (elem.offsetWidth / 2);
	const elemY = window.scrollY + elem.getBoundingClientRect().top + (elem.offsetHeight / 2);
	this.getRadians = function() {
		var rad = Math.atan2(elemY - mouseY, mouseX - elemX);
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
		var dist = Math.round(Math.sqrt(Math.pow(mouseX - elemX, 2) + Math.pow(elemY - mouseY, 2)));
		return dist;
	}
}

/* CREATE INSTANCES OF SELECTED ELEMENTS */
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
	    indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + spotIndicatorInstance[i].elem.getBoundingClientRect().left) + "px; top:" + (window.scrollY + spotIndicatorInstance[i].elem.getBoundingClientRect().top) + "px; height:" + spotIndicatorInstance[i].elem.clientHeight + "px; width:" + spotIndicatorInstance[i].elem.clientWidth + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
	    document.body.appendChild(indicator[i]);
	}
}

/* DEFINE AND APPLY THE DIFFERENT EFFECTS */
function initiateSpotEffects(event) {
	getMousePosition(event);
	for (i = 0; i < spotShadowInstance.length; i += 1) {
        shadowDist[i] = Math.round(spotShadowInstance[i].getDistance() / 30);
        if (spotShadowInstance[i].getDistance() > 15) {
            spotShadowInstance[i].elem.style.webkitFilter = "drop-shadow(" + shadowDist[i] * -Math.round(Math.cos(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] * Math.round(Math.sin(spotShadowInstance[i].getRadians()) * 10) / 10 + "px " + shadowDist[i] + "px rgba(0,0,0,0.8))";
        } else {
            spotShadowInstance[i].elem.style.webkitFilter = "none";
        }
	}
	for (i = 0; i < spotRotateInstance.length; i += 1) {
		spotRotateInstance[i].elem.style.transform = "rotate(" + spotRotateInstance[i].getAngle() + "deg)";
	}
}

/* CLEAR ALL EFFECTS SO THEY DON'T INTERFERE WITH NEW ONES */
function clearAllEffects() {
	for (i = 0; i < spotShadowInstance.length; i += 1) {
        spotShadowInstance[i].elem.style.webkitFilter = "none";
	}
	for (i = 0; i < spotRotateInstance.length; i += 1) {
		spotRotateInstance[i].elem.style.transform = "none";
	}
	var indicatorOverlays = document.getElementsByClassName("spot-indicator-overlay");
	for (i = 0; i < indicatorOverlays.length; i += 1) {
		indicatorOverlays[i].parentNode.removeChild(indicatorOverlays[i]);
	}
}

/* EVENT LISTENERS */
window.onmousemove = function(event) {
	initiateSpotEffects(event);
}

window.onload = function() {
	createSpotInstances();
}

window.onresize = function() {
	clearAllEffects();
	createSpotInstances();
}

/*
window.onscroll = function(event) {
	initiateSpotEffects(event);
}*/