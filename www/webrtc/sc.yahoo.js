/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

/**
 * @class Gab
 * @classDesc Network module for WooGeen P2P video chat
 */
function SignalingChannel(){

  var self=this;
  var request_token;
  var accessToken, accessTokenSecret, oauthSignature, oauthVersion, oauthSignatureMethod, oauthConsumerKey;
  var sessionId;
  var serveraddress;
  var notifyserveraddress,primaryLoginId;
  var part1,part2;
  var ifgetMessage = false;
  this.onMessageReceived=null;
  this.onAuthenticated=null

  function _log(ele,e,data){
    if(ele){
      ele.innerHTML += "\n" + e + "" + (data || '');
    }
  }


  /**
   * Create HTTP Request
   */
  function createXMLhttpRequest(){
    if(window.ActiveXObject)
      {
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
    else if(window.XMLHttpRequest)
      {
        return new XMLHttpRequest();
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

  var createSession=function(){
    var xmlhttp=createXMLhttpRequest();
    var oauth_nonce="" + (Math.random()*20000);
    var notifyServerToken="1";
    var oauth_timestamp=new Date().getTime();
    var parameters = JSON.stringify({"presenceState" : 0, "presenceMessage" : "I am now logged in"});
    //_log(log,'creating session.');
    var url = "http://developer.messenger.yahooapis.com/v1/session?oauth_consumer_key=" + oauthConsumerKey + "&oauth_signature_method=" + oauthSignatureMethod + "&oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_signature=" + oauthSignature + "&oauth_version=" + oauthVersion + "&notifyServerToken=" + notifyServerToken + "&oauth_token=" + accessToken;
    //_log(log,'get url.'+url);
    var targeturl=url.replace(/\n/g,'');
    xmlhttp.open("POST",targeturl,true);
    xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xmlhttp.onreadystatechange=function(){
      //_log('create session responsed. state: '+xmlhttp.status+', resultText: '+xmlhttp.responseText);
      if(xmlhttp.readyState == 4 && xmlhttp.status==200){
          var resultText = xmlhttp.responseText;
          //_log(log,'create session result: '+resultText);
          console.log(resultText);
          var result = JSON.parse(resultText);
          sessionId = result.sessionId;
          serveraddress = result.server;
          notifyserveraddress = result.notifyServer;
          primaryLoginId = result.primaryLoginId;

          //_log(log,"Login Yahoo Messenger Successfully!")
          if(self.onAuthenticated){
            self.onAuthenticated(primaryLoginId);
          }

          getMessage(0,function(){
            console.log("get message success");
          },function(){
            console.log("get message error");
          });
      }
      else if(xmlhttp.readyState == 4){
          //_log(log,'create session failed: '+resultText);
      }
    };
    //_log(log,'send create session request.');
    xmlhttp.send(parameters);
  };

  // message should a string.
  this.sendMessage=function(targetId, message){
    var data=JSON.parse(message);
    if(data.type==='chat-signal'){
      sendSignalMessage(targetId, data.data);
    }
    else{
      doSendMessage(targetId, message, function(){
        console.log('Send message failed.');
      });
    }
  };

  var doSendMessage=function(userId,message,failureCallback){
    if(!(accessToken && accessTokenSecret && sessionId )){
      if(failureCallback){
        failureCallback();
        return;
      }
    }
    var xmlhttp=createXMLhttpRequest();
    var oauth_nonce="" + (Math.random()*20000);
    var url="http://" + serveraddress + "/v1/message/yahoo/" + userId + "?sid=" + sessionId + "&oauth_consumer_key=" + oauthConsumerKey + "&oauth_signature_method=" + oauthSignatureMethod + "&oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_signature=" + oauthSignature + "&oauth_token=" + accessToken;
    var targeturl=url.replace(/\n/g,'');
    xmlhttp.open("POST",targeturl,true);
    xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xmlhttp.onreadystatechange=function(){
      if(xmlhttp.readyState == 4 && xmlhttp.status==200){
          var resultText = xmlhttp.responseText;
          console.log(resultText);
          //Log
          //_log(log,"send message=",message);
      }
      else{
      }
    };
    xmlhttp.send(JSON.stringify({message:message}));
  };

  var handleMessage=function(from,message){
    var data=JSON.parse(message);
    if(from && data.type){
      if(data.type == "chat-signal") {
        console.log('Received signal message');
        if(data.data.type == "offer" || data.data.type == "answer"){
          if(data.data.num == 1){
            part1 = data.data.sdp;
          }
          if(data.data.num == 2){
            part2 = data.data.sdp;
          }
          if(!(part1 && part2)){
            return;
          }else{
            data.data.sdp = part1 + part2;
            part1=null;
            part2=null;
          }

        }
        if(self.onMessageReceived)
          self.onMessageReceived(from, JSON.stringify(data));
      }
      else{
        if(self.onMessageReceived)
          self.onMessageReceived(from, message);
      }
    }
  };

  var getMessage=function(seq,successCallback,failureCallback){
    if(!(accessToken && accessTokenSecret && sessionId && notifyserveraddress && primaryLoginId)){
      if(failureCallback){
        failureCallback();
        return;
      }
    }

    var xmlhttp=createXMLhttpRequest();
    var oauth_nonce="" + (Math.random()*20000);
    var url="http://" + notifyserveraddress + "/v1/pushchannel/" + primaryLoginId + "?sid=" + sessionId + "&oauth_consumer_key=" + oauthConsumerKey + "&oauth_signature_method=" + oauthSignatureMethod + "&oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_signature=" + oauthSignature + "&oauth_token=" + accessToken + "&format=json&idle=10&count=1&seq=";
    var targeturl=url.replace(/\n/g,'');
    var flag = "none";
    var from;
    ifgetMessage = true;
    xmlhttp.open("GET",targeturl+seq,true);
    xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");

    xmlhttp.onreadystatechange=function(){
      if(xmlhttp.readyState == 4 && xmlhttp.status==200){
        var resultText = xmlhttp.responseText;
        try{
          var result = JSON.parse(resultText);
          //console.log(result);
          //if(result.responses.length !== 1){
          //seq++;
          if(result.responses[0].message){
            flag = result.responses[0].message.msg;
            flag = result.responses[0].message.msg;
            from = result.responses[0].message.sender;
            console.log("receive message = " + flag + " from " + from);
            //_log(log,"receive message=",flag);
            try{
                handleMessage(from,flag);
              }catch(err){
                console.log('Error while sending message. Error: '+err);
                handleOtherMessages(flag);
              }
            }
          }catch(e){
            handleOtherMessages(resultText);
          }

          if(!ifgetMessage) {
            return;
          }
          if(resultText !== ""){
            seq++;
          }
          xmlhttp.open("GET",targeturl+seq,true);
          xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
          xmlhttp.send();
      }
    }
    xmlhttp.send();
  };

  var handleOtherMessages=function(message){
    console.log("Receive other messages= " + message);
  };

  this.connect=function(loginInfo){
    accessToken=loginInfo.oauthAccessToken;
    accessTokenSecret=loginInfo.oauthAccessTokenSecret;
    oauthSignature=loginInfo.oauthSignature;
    oauthVersion=loginInfo.oauthVersion;
    oauthSignatureMethod=loginInfo.oauthSignatureMethod;
    oauthConsumerKey=loginInfo.oauthConsumerKey;
    //_log(log,'access token: '+accessToken+'. access token secret: '+accessTokenSecret);
    createSession();
  };

  /**
   * Send signal message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} message Signal message
   */
  var sendSignalMessage=function(uid, msg){
    console.log('C->S: '+msg);
    // Slice sdp into two parts because of Yahoo messanger's length constraint.
    //_log(log,'get message to be send: '+JSON.stringify(msg));
    if(msg.sdp){
        //_log(log,'send message as sdp.');
        /*
        var sliceParts=2;
        for(var i=0;i<sliceParts;i++){
            var part={sdp:msg.sdp.slice(i*msg.sdp.length/sliceParts,(i+1)*msg.sdp.length/sliceParts),num:i+1, type:msg.sdp.type};
            var tempmsg = JSON.stringify({"name" : "chat-signal","data" : part});
            var message = JSON.stringify({"message" : tempmsg});
            sendMessage(uid,message,function(){
              console.log("send message error!");
            });
        }*/
        var tempmsg;
        var message;
        var part1 = msg.sdp.slice(0,msg.sdp.length /2);
        var part2 = msg.sdp.slice(msg.sdp.length/2);
        msg.sdp = part1;
        msg.num = 1;
        message = JSON.stringify({"type" : "chat-signal","data" : msg});
        //_log(log,'send sdp message: '+message);
        doSendMessage(uid,message,function(){
          console.log("send message error!");
        });
        msg.sdp = part2;
        msg.num = 2;
        message = JSON.stringify({"type" : "chat-signal","data" : msg});
        //_log(log,'send sdp message: '+message);
        doSendMessage(uid,message,function(){
          console.log("send message error!");
        });
    }
    else{
        //_log(log,'send message as other signal.');
        var message = JSON.stringify({"type" : "chat-signal","data" : msg});
        doSendMessage(uid,message,function(){
          console.log("send message error!");
        });
        console.log("send chat-signal");
    }
  };

  /**
   * Finalize
   * @memberOf Gab#
   */
  this.disconnect=function(){
    var xmlhttp=createXMLhttpRequest();
    var oauth_nonce="" + (Math.random()*20000);
    var url="http://" + serveraddress + "/v1/session/?sid=" + sessionId + "&oauth_consumer_key=" + oauthConsumerKey + "&oauth_signature_method=" + oauthSignatureMethod + "&oauth_nonce=" + oauth_nonce + "&oauth_timestamp=" + oauth_timestamp + "&oauth_signature=" + oauthSignature + "&oauth_token=" + accessToken;   
    var targeturl=url.replace(/\n/g,'');
    xmlhttp.onreadystatechange=function(){
      if(xmlhttp.readyState == 4 && xmlhttp.status==200){
          var resultText = xmlhttp.responseText;
          console.log("Log out " + resultText);
          //Log
          //_log(log,"Logout from Yahoo Messenger Successfully!");
          part1=part2=null;
          ifgetMessage = false;
      }
    };
    xmlhttp.open("DELETE",targeturl,true);
    xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xmlhttp.send();
  };

}
