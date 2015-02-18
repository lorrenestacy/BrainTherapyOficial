/*
 * Copyright (C) 2014 Intel Corporation. All rights reserved.
 */

 /*
  * This script initalizes Galleria image galleries within your application
  *
  * You can get to any instantiated Galleria object by directly querying for 
  * the DOM node and checking whether it has .data('galleria') information.
  * This will contain the object needed to call additional API methods against
  * a particular gallery.
  *
  * After getting the object you may use any of the normal Galleria API calls.  
  * Example:
  *
  * var gallery = $('#myGallery').data('galleria');
  * gallery.play(1000);
  *
  * For more information about the Galleria API visit:
  * http://www.galleria.io/docs/
  *
  */

(function() {

	'use strict';
	window.ADGalleria = {};

	/**
	 *	galleria-startup.js - Generic code for folder or data-feed driven gallery
	 *
	 *	@exports getGalleries()
	 *
	 */

	var imageGalleries = [];

    /**
     * Waits for deviceready event from Cordova and then calls init to create
     * maps and set event handlers for service calls.  We then initiate any service
     * call that needs to happen after initalize is done if a trigger is present.
     *
     */
	var deferred = function(){
		init();
        callService();
	};
	document.addEventListener('app.Ready', deferred, false);

    /**
     * Initalize finds all the galleries on the page and gathers the relevant data attributes.
     * It then initalizes all the galleries with the gathered data depending on whether
     * the data source is a datafeed or a list of images in a JSON file
     *
     */
	function init() {
		findImageGalleries();
		initalizeGalleries();

	};

    /**
     * Queries the document for all data-uib matching googleMaps.  It then loops through
     * the results and gatheres all the data attributes and pushes then to the imageGalleries array.
     *
     */
	function findImageGalleries() {
		var imageGalleryQuery = document.querySelectorAll('[data-uib="media/image_gallery"]');

		for(var i = 0; i < imageGalleryQuery.length; i++) {
		    var imageGalleryData = {};
		    var elem = imageGalleryQuery[i];
		    imageGalleryData.imageGalleryDOMNode = elem;
		    imageGalleryData.dataEvent = elem.getAttribute('data-sm');
		    imageGalleryData.callEvent = elem.getAttribute('data-sm-trigger');
		    imageGalleryData.dataRpath = elem.getAttribute('data-rpath');
		    imageGalleryData.imagePath = elem.getAttribute('data-image-path');
		    imageGalleryData.imageDescription = elem.getAttribute('data-image-description');
		    imageGalleryData.imageTitle = elem.getAttribute('data-image-title');
		    imageGalleryData.imageJson = elem.getAttribute('images-json');
		    imageGalleries.push(imageGalleryData);
        }
	}

    /**
     * initalizeGalleries creates a base gallery for all nodes found and then determines whether the
     * data will be feed through a service or as a JSON file.
     *
     */
	function initalizeGalleries(){
		imageGalleries.forEach(function(gallery){
			runGallery(gallery);
			if(gallery.dataEvent){
				$(document).on('intel.xdk.services.' + gallery.dataEvent, function(evt, data){
					parseData(gallery, data);
					loadData(gallery);
				});
			} else if (gallery.imageJson) {
				setTimeout(function(){
					$.ajax(gallery.imageJson).done(function(data){
						loadData(gallery, data);
					});
				}, 1000);
			}
		});
	}

    /**
     *  Configures the gallery to have the default settings, or any modified settings provided
     *  by the user.  It will then run the initial instantiation of the Gallery on the given
     *  DOM node.
     *
     * @param {Object} gallery - Gallery Data
     */
	function runGallery(gallery){
		Galleria.configure({ thumbnails: false });
		Galleria.run(gallery.imageGalleryDOMNode);
	}

    /**
     * Create Markers is used when a service is creating the locations.  It will determine the correct
     * path for gathering the data and then loop through each one gathering certain values for creating
     * the marker.
     *
     * @param {Object} gallery - Gallery Data
     * @param {Object} data - Data returned from datafeed
     */
	function parseData(gallery, data){
		gallery.images = [];

		var dataRpath = JSON.parse(gallery.dataRpath);
        var newData = data;
		dataRpath.forEach(function(d){ newData = newData[d]; });
		newData = filter(newData, isObject);

		for( var i = 0; i < newData.length; i++ ) {
			var galleryImage = { image : null };
			var dataItem 		= newData[i];
			galleryImage.image 	= getImagePath(gallery, dataItem);
			galleryImage.description = getImageDescription(gallery, dataItem);
			galleryImage.title = getImageTitle(gallery, dataItem);

			gallery.images.push(galleryImage);
		}
	}

	/**
	 * Determines whether the gallery has an image path to pull from the data feed.  If it
	 * does have one it will attempt to strip the entry of the {} syntax and get the object
	 * from the dataItem
	 * @param  {Object} gallery  - Gallery Data
	 * @param  {Object} dataItem - Single instance of repeated data from datafeed
	 * @return {Object}          - Empty object, null, or fully qualified object path
	 */
	function getImagePath(gallery, dataItem){
		if(!!gallery && !!gallery.imagePath && !!dataItem) {
			var strippedImagePath = stripEntry(gallery.imagePath);
			var imagePath = getNamespacedObject(strippedImagePath.split('.'), dataItem);
			return imagePath;
		} else {
			return null;
		}
	}

	/**
	 * Determines whether the gallery has an image description to pull from the data feed.  If it
	 * does have one it will attempt to strip the entry of the {} syntax and get the object
	 * from the dataItem
	 * @param  {Object} gallery  - Gallery Data
	 * @param  {Object} dataItem - Single instance of repeated data from datafeed
	 * @return {Object}          - Empty object, null, or fully qualified object path
	 */
	function getImageDescription(gallery, dataItem){
		if(!!gallery && !!gallery.imageDescription && !!dataItem) {
			var strippedImageDescription = stripEntry(gallery.imageDescription);
			var imageDescription = getNamespacedObject(strippedImageDescription.split('.'), dataItem);
			return imageDescription;
		} else {
			return null;
		}
	}

	/**
	 * Determines whether the gallery has an image title to pull from the data feed.  If it
	 * does have one it will attempt to strip the entry of the {} syntax and get the object
	 * from the dataItem
	 * @param  {Object} gallery  - Gallery Data
	 * @param  {Object} dataItem - Single instance of repeated data from datafeed
	 * @return {Object}          - Empty object, null, or fully qualified object path
	 */
	function getImageTitle(gallery, dataItem){
		if(!!gallery && !!gallery.imageTitle && !!dataItem) {
			var strippedImageTitle = stripEntry(gallery.imageTitle);
			var imageTitle = getNamespacedObject(strippedImageTitle.split('.'), dataItem);
			return imageTitle;
		} else {
			return null;
		}
	}

	/**
	 * Takes a data object and determines whether a Gallery has already been instantiated.
	 * If one already exists it uses the load method, otherwise it initalizes it with 
	 * the default run method and a dataSource
	 * @param  {Object} gallery - Gallery Data
	 * @param  {Object} data    - String or Object of images data
	 */
	function loadData(gallery, data){
        if (typeof data == 'string' || data instanceof String) {
            data = JSON.parse(data);
        }
		data = data || gallery.images;
        var $gallery = $(gallery.imageGalleryDOMNode);
        var galleryData = $gallery.data('galleria');
        if(galleryData){
            galleryData.load(data);
        } else {
            Galleria.run(gallery.imageGalleryDOMNode, {
                dataSource: data
            });
        }
	}

    /**
     *	Filter function that
	 *
	 * @param [Array] arr - Objects that are gathered from service data path
	 * @param {function} predicate - Data must pass through this conditional or will be filtered
     */
    function filter(arr, predicate) {
        var i, res = [];
        for(i=0; i < arr.length; i++){ if(predicate(arr[i])){ res.push(arr[i]); } }
        return res;
    }

    /**
     *	Determines whether an item is an object
     *
     * @param {Object} e - element that will be compared to an object
     */
    function isObject(e) {
    	return typeof(e) == "object";
    }

    /**
     * Attemps to trim off the mustache style syntax from an entry.  If the syntax is not correctly used
     * it will return the original string; otherwise, it will return the inner value.
     *
     * @param {Object} mapObject - Contains data about map for creation
     * @returns {String} - Either a trimmed mustache entry or original entry depending on match
     */
	function stripEntry(entry) {
		var match = entry.match(/\{\{(?:entry.)?([\w\W]*)\}\}/);
		return !!match && match.length == 2 ? match[1] : entry;
	}

	/**
	* Takes an array of parts, a string split by '.', and attempts to look through
	* data and find the corresondping object
	*
	* @param {Array} - Array of strings split by '.'
	* @param {Object} - Base path to search in data feed response
	* @return {Object} - Empty object or fully qualified object path
	*/
	function getNamespacedObject(parts, data) {
	  for (var i = 0, len = parts.length, obj = data[0] || data; i < len; ++i) {
	    obj = obj[parts[i]];
	  }
	  return obj || {};
	}

    /**
     * Call Service will look through all the galleries on the page and find whether any of them have
     * a data event and whether the user wants it to trigger automatically.  It will then go through all 
     * of the namespaces and add it to 'intel.xdk.services' to create a function call.
     */
    function callService(){
		for(var i = 0; i < imageGalleries.length; i++){
			var currentGallery = imageGalleries[i];
			if(!!currentGallery.dataEvent && !!currentGallery.callEvent) {
				var splitString = currentGallery.dataEvent.split(".")
				var func = window.intel.xdk.services;
				for(var j = 0; j < splitString.length; j++){
					func = func[splitString[j]];
				}
				func();
			}
		}
    }

    /**
     * Returns an array of all of image galleries on the page with their parsed data.
     * @return {Array} - Gallery data Objects
     */
	ADGalleria.getGalleries = function(){
		return imageGalleries;
	}

})();