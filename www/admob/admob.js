(function(document)
 {
     function ad_failure(message)
     {
         /* insert your own ad failure code here */
         console.log(message);
     }
     
     function prepareAds()
     {
         if( window.plugins && window.plugins.AdMob )
         {
            var ad_nodelist = document.querySelectorAll("template.admob");
            var ad_array = Array.prototype.slice.call(ad_nodelist);
            ad_array.forEach(function(domNode)
            {
                var admob_ios_key       = domNode.attributes["data-ios-key"].value; 
                var admob_android_key   = domNode.attributes["data-android-key"].value; 
                var banner_at_top       = (domNode.attributes["data-top"].value === "true");
                var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;
                var am = window.plugins.AdMob;
                
                am.setOptions( {
                    publisherId: adId,
                    bannerAtTop: banner_at_top, // set to true, to put banner at top
                    overlap: false, // set to true, to allow banner overlap webview
                    offsetTopBar: true, // set to true to avoid ios7 status bar overlap
                    isTesting: false // receiving test ad
                });
                am.createBannerView();
            });//each
        }
     }
     
     document.addEventListener("app.Ready",prepareAds,false);
 })(document);