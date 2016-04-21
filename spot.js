/* Include custom settings in HTML file before calling spot.js
   The script WILL work by just including this file in the HTML - without
   user settings. In case you want to do that, the default classes are:

   - Target class (element that will track the mouse): "spot"
   - Target area class (element where mouse events will be listened to): "spot-area"
   - Default setting for debugging on-screen helpers: false

function setUserOpt() {
    var userOpt = {
        targetClass: "myTargetClass",
        activeAreaClass: "myActiveAreaClass",
        showIndicators: false
    };
    return userOpt;
}
*/
(function () {

    'use strict';

    var user = {},
        opt = {};

    if (typeof setUserOpt !== "undefined") {
        user = setUserOpt();
    }

    if (typeof user === "undefined" || user.targetClass === undefined) {
        opt.targetClass = "spot";
    } else {
        opt.targetClass = user.targetClass;
    }
    if (typeof user === "undefined" || user.activeAreaClass === undefined) {
        opt.activeAreaClass = "spot-area";
    } else {
        opt.activeAreaClass = user.activeAreaClass;
    }
    if (typeof user === "undefined" || user.showIndicators === undefined) {
        opt.showIndicators = true;
    } else {
        opt.showIndicators = user.showIndicators;
    }

    var frames = document.getElementsByClassName(opt.activeAreaClass);

    var elem = document.getElementsByClassName(opt.targetClass),
        elemHeight = [],
        elemWidth = [],
        elemX = [],
        elemY = [],
        i;

    var mouseX,
        mouseY;

    var deltaX = [],
        deltaY = [],
        mouseRad = [],
        mouseDeg = [],
        mouseDist = [],
        indicator = [];

    function getElemDimensions() {
        for (i = 0; i < elem.length; i += 1) {
            elemHeight[i] = elem[i].clientHeight;
            elemWidth[i] = elem[i].clientWidth;
            elemX[i] = 0;
            elemY[i] = 0;
        }
    }

    function getElemPosition() {
        for (i = 0; i < elem.length; i += 1) {
            elemX[i] = elem[i].getBoundingClientRect().left + (elemWidth[i] / 2);
            elemY[i] = elem[i].getBoundingClientRect().top + (elemHeight[i] / 2);
        }
    }

    function getIndicator() {
        if (opt.showIndicators) {
            for (i = 0; i < elem.length; i += 1) {
                indicator[i] = document.createElement("div");
                indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + elem[i].getBoundingClientRect().left) + "px; top:" + (window.scrollY + elem[i].getBoundingClientRect().top) + "px; height:" + elemHeight[i] + "px; width:" + elemWidth[i] + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
                document.body.appendChild(indicator[i]);
            }
        }
    }

    function updateIndicator() {
        for (i = 0; i < elem.length; i += 1) {
            indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + elem[i].getBoundingClientRect().left) + "px; top:" + (window.scrollY + elem[i].getBoundingClientRect().top) + "px; height:" + elemHeight[i] + "px; width:" + elemWidth[i] + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
        }
    }

    function getMousePosition() {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function getAngle() {

        getMousePosition();

        for (i = 0; i < elem.length; i += 1) {
            deltaX[i] = mouseX - elemX[i];
            deltaY[i] = elemY[i] - mouseY;
            mouseRad[i] = Math.atan2(deltaY[i], deltaX[i]);
            mouseDeg[i] = -Math.round(mouseRad[i] * 18000 / Math.PI) / 100;
            if (mouseDeg[i] <= 0) {
                mouseDeg[i] += 360;
            }
            if (opt.showIndicators && indicator[i] !== undefined) {
                indicator[i].innerHTML = "<p style='display:table-cell; vertical-align:middle;'>" + mouseDeg[i] + "º<br>" + mouseDist[i] + "px</p>";
            }
        }

    }

    function getDistance() {

        for (i = 0; i < elem.length; i += 1) {
            mouseDist[i] = Math.round(Math.sqrt(Math.pow(deltaX[i], 2) + Math.pow(deltaY[i], 2)));
        }

    }

    function getInfo() {
        getAngle();
        getDistance();
    }

    window.addEventListener("load", function () {
        getElemDimensions();
        getElemPosition();
        if (opt.showIndicators) {
            getIndicator();
        }
    }, false);

    window.addEventListener("resize", function () {
        getElemDimensions();
        getElemPosition();
        if (opt.showIndicators) {
            updateIndicator();
        }
    }, false);

    window.addEventListener("scroll", getElemPosition, false);

    if (opt.activeAreaClass === undefined || opt.activeAreaClass === window || opt.activeAreaClass === "window" || frames.length === 0) {
        window.addEventListener("mousemove", getInfo, false);
    } else {
        for (i = 0; i < frames.length; i += 1) {
            if (opt.showIndicators) {
                frames[i].style.outline = "15px dashed rgba(255,0,0,0.2)";
                frames[i].style.outlineOffset = "-15px";
                frames[i].style.background = "rgba(0,0,0,0.1)";
            }
            frames[i].addEventListener("mousemove", getInfo, false);
        }
    }

}());