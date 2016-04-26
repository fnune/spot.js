/* GET ELEMENTS WITH SPOT-EFFECT CLASSES AND ARRANGE THEM IN ELEM OBJECT */
var spotShadowElem = document.getElementsByClassName("spot-shadow"),
	spotRotateElem = document.getElementsByClassName("spot-rotate"),
	spotShadowInstance = [],
	spotRotateInstance = [],
	shadowDist = [],
	elems = {
		spotShadow: spotShadowElem,
		spotRotate: spotRotateElem
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
function SpotInstance(elem, effect) {
	this.elem = elem;
	this.effect = effect;
	this.elemX = elem.getBoundingClientRect().left + elem.clientWidth / 2;
	this.elemY = elem.getBoundingClientRect().top + elem.clientHeight / 2;
	this.getRad = function() {
		var rad = Math.atan2(this.elemY - mouseY, mouseX - this.elemX);
		return rad;
	}
	this.getAngle = function() {
		var angle = -Math.round(this.getRad() * 18000 / Math.PI) / 100;
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

/* DEFINE AND APPLY THE DIFFERENT EFFECTS */
function initiateSpot(event) {
	getMousePosition(event);
	for (i = 0; i < elems.spotShadow.length; i += 1) {
		spotShadowInstance[i] = new SpotInstance(elems.spotShadow[i], "spotShadow");
        shadowDist[i] = Math.round(spotShadowInstance[i].getDistance() / 30);
        if (spotShadowInstance[i].getDistance() > 15) {
            spotShadowInstance[i].elem.style.webkitFilter = "drop-shadow(" + shadowDist[i] * -Math.round(Math.cos(spotShadowInstance[i].getRad()) * 10) / 10 + "px " + shadowDist[i] * Math.round(Math.sin(spotShadowInstance[i].getRad()) * 10) / 10 + "px " + shadowDist[i] + "px rgba(0,0,0,0.8))";
        } else {
            spotShadowInstance[i].elem.style.webkitFilter = "none";
        }
	}
	for (i = 0; i < elems.spotRotate.length; i += 1) {
		spotRotateInstance[i] = new SpotInstance(elems.spotRotate[i], "spotRotate");
		spotRotateInstance[i].elem.style.transform = "rotate(" + spotRotateInstance[i].getAngle() + "deg)";
	}
}

/* EVENT LISTENERS */
window.onmousemove = function(event) {
	initiateSpot(event);
}
