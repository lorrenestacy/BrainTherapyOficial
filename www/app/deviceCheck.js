/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */

/*
* Copyright (c) 2012, Intel Corporation. All rights reserved.
* File revision: 04 October 2012
* Please see http://software.intel.com/html5/license/samples 
* and the included README.md file for license terms and conditions.
*/

// detect device
var ua = navigator.userAgent.toLowerCase();

var deviceCheck = {
    ios: ua.match(/(iphone|ipod|ipad)/i),
    blackberry: ua.match(/blackberry/i),
    android: ua.match(/android/i),
    windowsphone: ua.match(/windows phone/i),
    windows8: ua.match(/msapphost/i)
};

// detect browser
var browserCheck = {
    chrome: ua.match(/chrome/i),
    ie: ua.match(/msie/i),
    firefox: ua.match(/firefox/i),
    safari: ua.match(/safari/i), //this one is the same as chrome. 
    opera: ua.match(/opera/i)
};

// detect HTML5 tag support
var myDeviceSupport = {
    HTML5_audio: !!(document.createElement('audio').canPlayType),
    HTML5_audio_mp3: !!(document.createElement('audio').canPlayType) && document.createElement('audio').canPlayType('audio/mpeg') !== "",
    HTML5_audio_wav: !!(document.createElement('audio').canPlayType) && document.createElement('audio').canPlayType('audio/wav') !== "",
    HTML5_geolocation: navigator.geolocation
};
