/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _autocomplete = __webpack_require__(1);

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _initmap = __webpack_require__(3);

var _initmap2 = _interopRequireDefault(_initmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
    $('.button-collapse').sideNav();
    $('select').material_select();
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });

    scrollMagic();
});

(0, _autocomplete2.default)(document.getElementById("address"), document.getElementById("lat"), document.getElementById("lng"));

scaleVideoContainer();

initBannerVideoSize('.video-container .poster img');
initBannerVideoSize('.video-container .filter');
initBannerVideoSize('.video-container video');

$(window).on('resize', function () {
    scaleVideoContainer();
    scaleBannerVideoSize('.video-container .poster img');
    scaleBannerVideoSize('.video-container .filter');
    scaleBannerVideoSize('.video-container video');
});

(0, _initmap2.default)();
checkScroll();

function scaleVideoContainer() {

    var height = $(window).height() + 5;
    var unitHeight = parseInt(height) + 'px';
    $('.homepage-hero-module').css('height', unitHeight);
}

function initBannerVideoSize(element) {

    $(element).each(function () {
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);
}

function scaleBannerVideoSize(element) {

    var windowWidth = $(window).width(),
        windowHeight = $(window).height() + 5,
        videoWidth,
        videoHeight;

    // console.log(windowHeight);

    $(element).each(function () {
        var videoAspectRatio = $(this).data('height') / $(this).data('width');

        $(this).width(windowWidth);

        if (windowWidth < 1000) {
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({ 'margin-top': 0, 'margin-left': -(videoWidth - windowWidth) / 2 + 'px' });

            $(this).width(videoWidth).height(videoHeight);
        }

        $('.homepage-hero-module .video-container video').addClass('fadeIn animated');
    });
}

// var text = ["happy", "healthy", "mindful", "fit"];
// var counter = 0;
// var elem = document.getElementById("text-change");
// setInterval(change, 1500);
// function change() {
//  elem.innerHTML = text[counter];
//     counter++;
//     if(counter >= text.length) { counter = 0; }
// }

function checkScroll() {
    var startY = $('.nav-wrapper-landing').height() * 1; //The point where the nav-wrapper changes in px

    if ($(window).scrollTop() > startY) {
        $('.nav-wrapper-landing').addClass("scrolled");
        document.getElementById("nav-landing-logo").src = "https://res.cloudinary.com/dx1s7kdgz/image/upload/v1495057462/compundBlack_mlkuff.png";
    } else {
        $('.nav-wrapper-landing').removeClass("scrolled");
        document.getElementById("nav-landing-logo").src = "https://res.cloudinary.com/dx1s7kdgz/image/upload/v1494986580/outventure_white-01_gofmj3.png";
    }
}

if ($('.nav-wrapper-landing').length > 0) {
    $(window).on("scroll load resize", function () {
        checkScroll();
    });
}

function scrollMagic() {
    var controller = new ScrollMagic.Controller();

    var sceneSearchNav = new ScrollMagic.Scene({ triggerElement: "#search-nav" }).setPin("#search-nav").addTo(controller);

    var offset = sceneSearchNav.offset();
    sceneSearchNav.offset(286);

    var mapFix = new ScrollMagic.Scene({
        triggerElement: ".listings-wrapper",
        triggerHook: "onLeave",
        duration: 0
    }).setClassToggle(".map-container", "fixed").addTo(controller);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function autocomplete(input, latInput, lngInput) {

  if (!input) return; // skip this fn from running if there is not input on the page
  var dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', function () {
    var place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // if someone hits enter on the address field, don't submit the form
  input.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) e.preventDefault();
  });
}

exports.default = autocomplete;

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function initMap() {
  var uluru = { lat: -25.363, lng: 131.044 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

exports.default = initMap;

/***/ })
/******/ ]);
//# sourceMappingURL=App.bundle.js.map