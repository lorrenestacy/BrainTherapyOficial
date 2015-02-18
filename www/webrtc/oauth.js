/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/


// OAuth start
  var oauth_signature_method = "PLAINTEXT";
  var oauth_version = "1.0";
  var oauth_timestamp = "1219450170";
  var oauth_app_id = "e8c6017d680edcb1ae62d4401a1cff83503fafb0";
  var oauth_consumer_key = "dj0yJmk9MnB1RmRCRFFjclNCJmQ9WVdrOWFVWkxTbGhSTkdFbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0zMg--";
  var oauth_signature_origin = oauth_app_id + "%26";
  var oauth_callback = "http://test.test.com/test.html";
  var loginInfo = {oauthSignatureMethod:oauth_signature_method, oauthVersion:oauth_version, oauthConsumerKey:oauth_consumer_key};
  var oauth_callback_domain = new URL(oauth_callback).hostname;

  /**
   * Create HTTP Request
   */
  var createXMLhttpRequest = function() {
    if (window.ActiveXObject) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
  };

  function _log(ele, e, data) {
    if (ele) {
      ele.innerHTML += "\n" + e + "" + (data || '');
    }
  }

  /**
   * Function to get parameters from url
   */
  function getParam(string) {
    var theRequest = new Object();
    if (string.indexOf("?") != -1) {
      var str = string.substr(1);
      if (str.indexOf("&") != -1) {
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      } else {
        theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
      }
    }
    return theRequest;
  }

  /**
   * Connect to the signaling server
   * @memberOf Gab#
   */
  var getRequestToken = function(callback) {
    var xmlhttp = createXMLhttpRequest();
    var oauth_nonce = "" + (Math.random() * 20000);
    var oauth_timestamp = new Date().getTime();
    var requesturl = "https://api.login.yahoo.com/oauth/v2/get_request_token?oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_consumer_key=" + oauth_consumer_key + "&oauth_signature_method=plaintext&oauth_signature=" + oauth_signature_origin + "&oauth_version=" + oauth_version + "&oauth_callback=" + oauth_callback;
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var resultText = xmlhttp.responseText;
        console.log(resultText);
        var result = getParam('?' + resultText);
        var oauth_token = result.oauth_token;
        oauth_token_secret = result.oauth_token_secret;
        var oauth_expires_in = result.oauth_expires_in;
        var xoauth_request_auth_url = result.xoauth_request_auth_url;
        var loginWindow = window.open(xoauth_request_auth_url, '_blank', 'location=yes');
        $(loginWindow).on('loadstart', function(e) {
          var url = e.originalEvent.url;
          if (url.indexOf(oauth_callback_domain) !== -1) {
            var part = url.slice(url.indexOf('?') + 1);
            var result = getParam('?' + part);
            if (result.oauth_token) {
              var token = result.oauth_token;
              var token_verifier = result.oauth_verifier;
              loginWindow.close();
              getOAuthToken(token, token_verifier,callback);
            }
          }
        })
      }
    }
    xmlhttp.open("GET", requesturl, true);
    xmlhttp.send();
  }

  var getOAuthToken = function(token, token_verifier,callback) {
      //_log(log, 'got token: ' + token + '. verifier: ' + token_verifier);
      var xmlhttp = createXMLhttpRequest();
      var oauth_timestamp = new Date().getTime();
      var oauth_nonce = "" + (Math.random() * 20000);
      var oauth_signature = oauth_signature_origin + oauth_token_secret;
      var oauth_verifier = token_verifier;
      var oauth_token = token;
      var url = "https://api.login.yahoo.com/oauth/v2/get_token?oauth_consumer_key=" + oauth_consumer_key + "&oauth_signature_method=" + oauth_signature_method + "&oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_signature=" + oauth_signature + "&oauth_verifier=" + oauth_verifier + "&oauth_token=" + token + "&oauth_version=" + oauth_version;
      var targeturl = url.replace(/\n/g, '');
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var resultText = xmlhttp.responseText;
          var result = resultText.split("&");
          loginInfo.oauthAccessToken = result[0].slice(result[0].indexOf("=") + 1);
          loginInfo.oauthAccessTokenSecret = result[1].slice(result[1].indexOf("=") + 1);
          loginInfo.oauthSignature=oauth_signature_origin+loginInfo.oauthAccessTokenSecret;
          callback(loginInfo);
        }
      };
      xmlhttp.open("GET", targeturl, true);
      xmlhttp.send();
    }
    // OAuth stop