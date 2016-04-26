/* Include custom settings in HTML file before calling spot.js
   The script WILL work by just including this file in the HTML - without
   user settings. In case you want to do that, the default classes are:

   - Target class (element that will track the mouse): "spot"
   - Target area class (element where mouse events will be listened to): "spot-area"
   - Default setting for debugging on-screen helpers: false

function setUserOpt() {
    var userOpt = {
        // General settings
        // targetClass: "shadowthis",
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
*/
/*global window */

var spotInstances = [];

var frames = document.getElementsByClassName("spot-area");

var spotShadow = document.getElementsByClassName("spot-shadow");
var spotRotate = document.getElementsByClassName("spot-rotate");

var mouseX,
    mouseY;

function getMousePosition(event) {
    event = event || window.event;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

var self;

function Spot(opt) {

    'use strict';

        this.elem = document.getElementsByClassName(opt.targetClass);
        this.elemHeight = [];
        this.elemWidth = [];
        this.elemX = [];
        this.elemY = [];
        this.deltaX = [];
        this.deltaY = [];
        this.mouseRad = [];
        this.mouseDeg = [];
        this.mouseDist = [];
        this.indicator = [];
        this.theInfo = [];
        this.shadowDist = [];

        var self = this;

        this.getElemDimensions = function() {
            for (var i = 0; i < self.elem.length; i += 1) {
                self.elemHeight[i] = self.elem[i].clientHeight;
                self.elemWidth[i] = self.elem[i].clientWidth;
                self.elemX[i] = 0;
                self.elemY[i] = 0;
            }
        }

        this.getElemPosition = function() {
            for (var i = 0; i < self.elem.length; i += 1) {
                self.elemX[i] = self.elem[i].getBoundingClientRect().left + (self.elemWidth[i] / 2);
                self.elemY[i] = self.elem[i].getBoundingClientRect().top + (self.elemHeight[i] / 2);
            }
        }

        this.getIndicator = function() {
            if (opt.showIndicators) {
                for (var i = 0; i < self.elem.length; i += 1) {
                    self.indicator[i] = document.createElement("div");
                    self.indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + self.elem[i].getBoundingClientRect().left) + "px; top:" + (window.scrollY + self.elem[i].getBoundingClientRect().top) + "px; height:" + self.elemHeight[i] + "px; width:" + self.elemWidth[i] + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
                    document.body.appendChild(self.indicator[i]);
                }
            }
        }

        this.updateIndicator = function() {
            for (var i = 0; i < self.elem.length; i += 1) {
                self.indicator[i].style.cssText = "display:table; position:absolute; pointer-events:none; left:" + (window.scrollX + self.elem[i].getBoundingClientRect().left) + "px; top:" + (window.scrollY + self.elem[i].getBoundingClientRect().top) + "px; height:" + self.elemHeight[i] + "px; width:" + self.elemWidth[i] + "px; color:white; text-align:center; font-weight:600; font-family:Arial; z-index:999999; outline:15px solid rgba(0,200,0,0.3); outline-offset:-15px; background:rgba(0,0,0,0.2);";
            }
        }

        this.getAngle = function(event) {

            getMousePosition(event);

            for (var i = 0; i < self.elem.length; i += 1) {
                self.deltaX[i] = mouseX - self.elemX[i];
                self.deltaY[i] = self.elemY[i] - mouseY;
                self.mouseRad[i] = Math.atan2(self.deltaY[i], self.deltaX[i]);
                self.mouseDeg[i] = -Math.round(self.mouseRad[i] * 18000 / Math.PI) / 100;
                if (self.mouseDeg[i] <= 0) {
                    self.mouseDeg[i] += 360;
                }
                if (opt.showIndicators && self.indicator[i] !== undefined) {
                    self.indicator[i].innerHTML = "<p style='display:table-cell; vertical-align:middle;'>" + self.mouseDeg[i] + "º<br>" + self.mouseDist[i] + "px</p>";
                }
            }

        }

        this.getDistance = function() {

            for (var i = 0; i < self.elem.length; i += 1) {
                self.mouseDist[i] = Math.round(Math.sqrt(Math.pow(self.deltaX[i], 2) + Math.pow(self.deltaY[i], 2)));
            }

        }

        this.initiateSpot = function(event) {
            self.getAngle(event);
            self.getDistance();
            if (opt.shadowOn) {
                self.getShadow();
            }
            if (opt.rotationOn) {
                self.getRotation();
            }
        }

        window.addEventListener("load", function () {
            self.getElemDimensions();
            self.getElemPosition();
            if (opt.showIndicators) {
                self.getIndicator();
            }
        }, false);

        window.addEventListener("resize", function () {
            self.getElemDimensions();
            self.getElemPosition();
            if (opt.showIndicators) {
                self.updateIndicator();
            }
        }, false);

        window.addEventListener("scroll", self.getElemPosition, false);

        if (opt.activeAreaClass === undefined || opt.activeAreaClass === window || opt.activeAreaClass === "window" || frames.length === 0) {
            window.onmousemove = function(event) {
                    self.initiateSpot(event);
            }
        } else {
            for (var i = 0; i < frames.length; i += 1) {
                if (opt.showIndicators) {
                    frames[i].style.outline = "15px dashed rgba(255,0,0,0.2)";
                    frames[i].style.outlineOffset = "-15px";
                    frames[i].style.background = "rgba(0,0,0,0.1)";
                }
                frames[i].onmousemove = function(event) {
                    self.initiateSpot(event);
                }
            }
        }

        this.getShadow = function() {
            for (var i = 0; i < self.elem.length; i += 1) {
                self.shadowDist[i] = Math.round(self.mouseDist[i] / opt.shadowBlur);
                if (self.mouseDist[i] > 15) {
                    self.elem[i].style.webkitFilter = "drop-shadow(" + self.shadowDist[i] * -Math.round(Math.cos(self.mouseRad[i]) * 10) / 10 + "px " + self.shadowDist[i] * Math.round(Math.sin(self.mouseRad[i]) * 10) / 10 + "px " + self.shadowDist[i] + "px " + opt.shadowColor + ")";
                } else {
                    self.elem[i].style.webkitFilter = "none";
                }
            }
        }

        this.getRotation = function() {
            for (var i = 0; i < self.elem.length; i += 1) {
                self.elem[i].style.transform = "rotate(" + self.mouseDeg[i] + "deg)";
            }
        }
};

(function spotRotateApp() {

    if (spotRotate.length != 0) {
        spotInstances.push(spotRotate);    
        var rotateConfig = {
            // General settings
            targetClass: "spot-rotate",
            showIndicators: false,

            //Shadow settings
            shadowOn: false,

            //Rotation settings
            rotationOn: true
        }
        var spotRotateInstance = new Spot(rotateConfig);
    }

}());

(function spotShadowApp() {

    if (spotShadow.length != 0) {
        spotInstances.push(spotShadow);
        var shadowConfig = {
            // General settings
            targetClass: "spot-shadow",
            showIndicators: false,

            //Shadow settings
            shadowOn: true,
            shadowBlur: 30,
            shadowColor: "rgba(0,0,0,0.8)",

            //Rotation settings
            rotationOn: false
        }
        var spotShadowInstance = new Spot(shadowConfig);
    }

}());