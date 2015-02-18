/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

/**
 * @class Gab
 * @classDesc Network module for WooGeen P2P video chat
 */
function Gab(loginInfo){

  var self=this;
  var sc=new SignalingChannel();

  // Event handlers.
  /**
   * @property {function} onConnected
   * @memberOf Gab#
   */
  this.onConnected=null;
  /**
   * @property {function} onDisconnect
   * @memberOf Gab#
   */
  this.onDisconnected=null;
  /**
   * @property {function} onConnectFailed This function will be executed after connect to server failed. Parameter: errorCode for error code.
   * @memberOf Gab#
   */
  this.onConnectFailed=null;
  /**
   * @property {function} onChatInvitation Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatInvitation=null;
  /**
   * @property {function} onChatDenied Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatDenied=null;
  /**
   * @property {function} onChatStopped Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatStopped=null;
  /**
   * @property {function} onChatAccepted Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatAccepted=null;
  /**
   * @property {function} onChatError Parameter: errorCode.
   * @memberOf Gab#
   */
  this.onChatError=null;
  /**
   * @property {function} onChatSignal Parameter: senderId, signaling message.
   * @memberOf Gab#
   */
  this.onChatSignal=null;
  /**
   * @property {function} onChatReady Parameter: a list of uid in current chat
   * @memberOf Gab#
   */
  this.onChatReady=null;
  /**
   * @property {function} onChatWait
   * @memberOf Gab#
   */
  this.onChatWait=null;

  /**
   * @property {function} onAuthenticated
   * @memberOf Gab#
   */
  this.onAuthenticated=null;

  this.onStreamType=null;

  var handleMessage=function(from,rawMessage){
    var message=JSON.parse(rawMessage);
    if(from && message.type){
      switch(message.type){
        case 'chat-invitation':
          if(self.onChatInvitation)
            self.onChatInvitation(from);
          break;
        case 'chat-denied':
          if(self.onChatDenied)
            self.onChatDenied(from);
          break;
        case 'chat-closed':
          if(self.onChatStopped)
            self.onChatStopped(from);
          break;
        case 'chat-accepted':
          if(self.onChatAccepted)
            self.onChatAccepted(from);
          break;
        case 'chat-stopped':
          if(self.onChatStopped)
            self.onChatStopped(from);
          break;
        case 'chat-signal':
          if(self.onChatSignal)
            self.onChatSignal(from, message.data);
          break;
        case 'stream-type':
          if(self.onChatType)
            self.onChatType(from,message.data);
          break;
        case 'chat-negotiation-needed':
          if(self.onNegotiationNeeded)
            self.onNegotiationNeeded(from);
          break;
        case 'chat-negotiation-accepted':
          if(self.onNegotiationAccepted)
            self.onNegotiationAccepted(from);
          break;
        default:
          console.log('Received other type messages ' + JSON.stringify(message));
      }
    }
    else {
      console.log("Received other messages " + JSON.stringify(message));
    }
  };

  var handleAuthenticated=function(uid){
    console.log('Authenticated '+uid);
    if(self.onAuthenticated)
      self.onAuthenticated(uid);
  };


  /**
   * Send a video invitation to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatInvitation= function(uid){
    var message = JSON.stringify({"type" : "chat-invitation"});
    sc.sendMessage(uid,message,function(){
      console.log("sendChatInvitation error!");
    });
    console.log("send video invitation");
  };

  /**
   * Send video agreed message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatAccepted=function(uid){
    var message = JSON.stringify({"type" : "chat-accepted"});
    sc.sendMessage(uid,message,function(){
      console.log("send message error!");
    });
    console.log("send chat-accepted");
  };

  /**
   * Send video denied message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatDenied=function(uid){
    var message = JSON.stringify({"type" : "chat-denied"});
    sc.sendMessage(uid,message,function(){
      console.log("send message error!");
    });
    console.log("send chat-denied");
  };

  /**
   * Send video stopped message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatStopped=function(uid){
    var message = JSON.stringify({"type" : "chat-stopped"});
    sc.sendMessage(uid,message,function(){
      console.log("send message error!");
    });
    console.log("send chat-stopped");
  };

  this.sendStreamType=function(uid, streamId){
    var message = JSON.stringify({"type" : "stream-type", "data":streamId});
    sc.sendMessage(uid,message,function(){
      console.log("send message error!");
    });
    console.log("send chat-denied");
  };

  /**
   * Send signal message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} message Signal message
   */
  this.sendSignalMessage=function(uid, msg){
    console.log('Send signal message: '+msg);
    var message = JSON.stringify({"type" : "chat-signal","data" : msg});
    sc.sendMessage(uid,message,function(){
      console.log("send message error!");
    });
  };

  this.sendNegotiationNeeded=function(uid, successCallback, failureCallback){
    var message = JSON.stringify({"type" : "chat-negotiation-needed"});
    sc.sendMessage(uid, message, function(){
      console.log("send message error!");
    });
  };

  this.sendNegotiationAccepted=function(uid, successCallback, failureCallback){
    var message = JSON.stringify({"type" : "chat-negotiation-accepted"});
    sc.sendMessage(uid, message, function(){
      console.log("send message error!");
    });
  };

  /**
   * Finalize
   * @memberOf Gab#
   */
  this.finalize=function(){
    sc.disconnect();
  };

  sc.onMessageReceived=handleMessage;
  sc.onAuthenticated=handleAuthenticated;
  sc.connect(loginInfo);
}
