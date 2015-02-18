/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false*/
/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 15 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */


var springboard = {
    
    /* bookkeeping for device orientation */
    rotated: false,
    
    /* constant padding around springboard elements */
    PADDING: 12,
        
    /* set up springboard dynamic sizing capabilities */
    init: function() {
        /* initialize viewport dimensions */
        springboard.VH1 = window.innerHeight;  
        springboard.VH2 = window.innerWidth - 25; 
        /* calculate size for initial orientation */
        springboard.calcSize();
        /* resize based on calculations */
        springboard.resize();
        /* keep track of screen orientation */
        $(window).on('orientationchange', springboard.updateRotation);
        /* calculate size for rotated orientation upon next rotation */
        $(window).one('orientationchange', springboard.calcSize2); 
    },
    
    /* calculate size of springboard to fit in viewport */
    calcSize: function() {
        
        /* calculate bottom boundary of default-sized springboard */
        var bottomLeftElem = $('.springboard p').filter(':eq(2)');		
        var bottom = bottomLeftElem.offset().top + bottomLeftElem.height();
        
        /* calculate if there is any overflow of springboard elements past effective viewport */
        var vh = springboard.getVh();
        var overflow = bottom - (vh - springboard.PADDING);	
        
        /* shrink springboard icons to fit, if necessary */
        var maxHeight;
        if (overflow > 0) {
            /* determine current height of all icons */
            var iconHeight = $('.springboard img').filter(':eq(2)').height();
            /* adjust both rows of icons, each by their share (half) of total overflow */
            maxHeight = (iconHeight - overflow / 2) + 'px';
        } else {
            /* allow icons to take up entire grid (<= native icon size) if not overflowing viewport  */
            maxHeight = '100%';
        }
        
        /* remember max height for initial orientation */
        if (!springboard.rotated) {
            springboard.maxHeight = maxHeight;
        }         
        /* remember max height for rotate orientation */
        else {
            springboard.maxHeight2 = maxHeight;
        }
    },
    
    /* try to calculate size of springboard in rotated orientation */
    calcSize2: function() {
        /* determine whether the home page is being displayed */
        var home = $.mobile.activePage.attr('id') == 'home';
        /* calculate & update dimensions when rotated on home page */
        if (springboard.rotated && home) {
            /* calculate size for rotated orientation */            
            springboard.calcSize();
            /* resize based on calculations */
            springboard.resize();
            /* done with calculations, just adjust upon orientation change from now on */
            $(window).bind('orientationchange', springboard.resize);
        }         
        /* else try again to calculate rotated dimensions */
        else {
            if (home) {
                $(window).one('orientationchange', springboard.calcSize2); 
            } else {
                $(document).one('pageshow', ':jqmData(role=page)', springboard.calcSize2);
            }
        }
    },
    
    /* apply appropriate icon size depending on current orientation */
    resize: function() {
        if (!springboard.rotated) {
            $('.springboard img').css('max-height', springboard.maxHeight);
        } else {
            $('.springboard img').css('max-height', springboard.maxHeight2);
        }
    },
    
    /* update bookkeeping state of screen orientation */
    updateRotation: function() {
        springboard.rotated = !springboard.rotated;
    },
    
    /* get viewport height based on current orientation */
    getVh: function() {
        if (!springboard.rotated) {
            return springboard.VH1;
        } else {
            return springboard.VH2;
        }
    }
};


/* wait until images loaded to determine default layout coordinates */
$(window).load(springboard.init);