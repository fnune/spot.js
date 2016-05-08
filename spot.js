/*global window */
(function () {

    'use strict';

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
        elems = {
            spotShadow: spotShadowElem,
            spotRotate: spotRotateElem,
            spotIndicator: spotIndicatorElem,
            spotArea: spotAreaElem
        };

    /* Minor configuration options for a maximum refresh per second and a controller for the shadows */
    var spotFPS = 60,
        shadowBlur = 30;

    var mouseX,
        mouseY;

    /* Pretty obvious what this does */
    function getMousePosition(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function on(el, eventName, callback) {
        if (el.addEventListener) {
            el.addEventListener(eventName, callback, false);
            return;
        }
        if (el.attachEvent) {
            el.attachEvent(eventName, callback);
            return;
        }
    }

    /* Reduce the amount of times onmousemove functions are fired */
    /* Credit: http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/ */
    function throttle(delay, callback) {
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    /* Gets basic element info and calculates mouse-related variables */
    function SpotInstance(elem) {

        var boundingClientRect = elem.getBoundingClientRect();
        this.elem = elem;
        this.elemX = boundingClientRect.left + (elem.offsetWidth / 2);
        this.elemY = boundingClientRect.top + (elem.offsetHeight / 2);
    }

    SpotInstance.prototype = {
        getRadians: function () {
            var rad = Math.atan2(this.elemY - mouseY, mouseX - this.elemX);
            return rad;
        },
        getAngle: function () {
            var angle = -Math.round(this.getRadians() * 18000 / Math.PI) / 100;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },
        getDistance: function () {
            var dist = Math.round(Math.sqrt(Math.pow(mouseX - this.elemX, 2) + Math.pow(this.elemY - mouseY, 2)));
            return dist;
        }
    };

    /* Creates new instances for each of the elements with a relevant selector */
    function createSpotInstances() {

        var spotIndicator = elems.spotIndicator,
            spotShadow = elems.spotShadow,
            spotRotate = elems.spotRotate;

        var spotIndicatorLength = spotIndicator.length,
            spotShadowLength = spotShadow.length,
            spotRotateLength = spotRotate.length,
            instancesLength = spotIndicatorInstance.length;

        var docFragment = document.createDocumentFragment(),
            indicatorInstance,
            boundingClientRect,
            div;


        for (var i = 0; i < spotIndicatorLength; i += 1) {
            spotIndicatorInstance[i] = new SpotInstance(spotIndicator[i]);
        }
        for (var i = 0; i < spotShadowLength; i += 1) {
            spotShadowInstance[i] = new SpotInstance(spotShadow[i]);
        }
        for (var i = 0; i < spotRotateLength; i += 1) {
            spotRotateInstance[i] = new SpotInstance(spotRotate[i]);
        }

        for (var i = 0; i < instancesLength; i += 1) {

            indicatorInstance = spotIndicatorInstance[i].elem;
            boundingClientRect = indicatorInstance.getBoundingClientRect();

            div = document.createElement("div");
            div.className = "spot-indicator-overlay";
            div.style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + boundingClientRect.left) + "px; top:" + (window.scrollY + boundingClientRect.top) + "px; height:" + indicatorInstance.offsetHeight + "px; width:" + indicatorInstance.offsetWidth + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
            docFragment.appendChild(div);
            indicator[i] = div;
        }
        document.body.appendChild(docFragment);
    }

    /* Initiates the effects, this is tied to the mousemove event */
    function initiateSpotEffects(event) {

        var spotShadowInstanceLength = spotShadowInstance.length,
            spotRotateInstanceLength = spotRotateInstance.length;

        var shadowInstance,
            shadowInstanceStyle,
            rotateInstance,
            dropShadowText;

        getMousePosition(event);
        for (var i = 0; i < spotShadowInstanceLength; i += 1) {

            shadowInstance = spotShadowInstance[i];
            shadowInstanceStyle = shadowInstance.elem.style;
            shadowDist[i] = Math.round(shadowInstance.getDistance() / shadowBlur);

            if (shadowInstance.getDistance() > 15) {
                dropShadowText = "drop-shadow(" + shadowDist[i] * -Math.round(Math.cos(shadowInstance.getRadians()) * 10) / 10 + "px " + shadowDist[i] * Math.round(Math.sin(shadowInstance.getRadians()) * 10) / 10 + "px " + shadowDist[i] + "px rgba(0,0,0,0.8))";
                shadowInstanceStyle.webkitFilter = dropShadowText;
                shadowInstanceStyle.filter = dropShadowText;
            } else {
                shadowInstanceStyle.webkitFilter = "none";
                shadowInstanceStyle.filter = "none";
            }
        }
        for (var i = 0; i < spotRotateInstanceLength; i += 1) {
            rotateInstance = spotRotateInstance[i];
            rotateInstance.elem.style.transform = "rotate(" + rotateInstance.getAngle() + "deg)";
        }
    }

    /* This is tied to the mousemove event */
    function updateIndicatorInfo() {

        var instanceLength = spotIndicatorInstance.length,
            instance;

        for (var i = 0; i < instanceLength; i += 1) {
            instance = spotIndicatorInstance[i];
            indicator[i].innerHTML = instance.getDistance() + "px " + instance.getAngle() + "º";
        }
    }

    /* Because we don't want new instances taking positions of already rotated elements */
    function clearAllEffects() {

        var instanceLength = spotRotateInstance.length;

        for (var i = 0; i < instanceLength; i += 1) {
            spotRotateInstance[i].elem.style.transform = "rotate(0deg)";
        }
        while (indicatorOverlays[0]) {
            indicatorOverlays[0].parentNode.removeChild(indicatorOverlays[0]);
        }
    }

    /* EVENT LISTENERS */
    if (elems.spotArea[0]) {
        for (var i = 0; i < elems.spotArea.length; i += 1) {
            on(elems.spotArea[i], 'mousemove', throttle(1000 / spotFPS, function (event) {
                initiateSpotEffects(event);
                updateIndicatorInfo();
            }));
        }
    } else {
        on(window, 'mousemove', throttle(1000 / spotFPS, function (event) {
            initiateSpotEffects(event);
            updateIndicatorInfo();
        }));
    }

    on(window, 'load', function () {
        createSpotInstances();
    });

    on(window, 'resize', function () {
        clearAllEffects();
        createSpotInstances();
    });

    on(window, 'scroll', function () {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function () {
            clearAllEffects();
            createSpotInstances();
        }, 50);
    });
}());
