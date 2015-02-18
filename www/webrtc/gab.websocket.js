/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

/**
 * @class Gab
 * @classDesc Network module for WooGeen P2P video chat
 */
function Gab(loginInfo){

  var serverAddress = loginInfo.host;
  var token = loginInfo.token;

  var clientType='Web';
  var clientVersion='1.5';

  var self=this;
  var wsServer=null;

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
   * @property {function} onStreamType Parameter: senderId, video type message.
   * @memberOf Gab#
   */
  this.onStreamType=null;
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

  /**
   * Connect to the signaling server
   * @memberOf Gab#
   * @param {string} uid Current user's ID.
   * @param {string} token Token for authentication.
   * @param {callback} successCallback Callback function to be executed after connect to server successfully.
   * @param {callback} failureCallback Callback function to be executed after connect to server failed.
   */
  var connect=function(serverAddress, token){
    var paramters=[];
    var queryString=null;
    paramters.push('clientType='+clientType);
    paramters.push('clientVersion='+clientVersion);
    if(token)
      paramters.push('token='+token);
    if(paramters)
      queryString=paramters.join('&');
    Woogeen.Logger.debug('Query string: '+queryString);
    wsServer=io.connect(serverAddress,{query : queryString, 'force new connection': true});


    wsServer.on('connect',function(){
      Woogeen.Logger.info('Connected to websocket server.');
      if(self.onConnected)
        self.onConnected();
    });

    wsServer.on('disconnect',function(){
      Woogeen.Logger.info('Disconnected from websocket server.');
      if(self.onDisconnected)
        self.onDisconnected();
    });

    wsServer.on('connect_failed',function(errorCode){
      Woogeen.Logger.error('Connect to websocket server failed, error:'+errorCode+'.');
      if(self.onConnectFailed)
        self.onConnectFailed(parseInt(errorCode));
    });

    wsServer.on('error', function(err){
      Woogeen.Logger.error('Socket.IO error:'+err);
      if(err=='2103'&&self.onConnectFailed)
        self.onConnectFailed(err);
    });

    wsServer.on('chat-invitation',function(data){
      Woogeen.Logger.info('Received a video invitation.');
      if(self.onChatInvitation)
        self.onChatInvitation(data.from);
    });

    wsServer.on('chat-denied',function(data){
      Woogeen.Logger.info('Remote user denied your invitation.');
      if(self.onChatDenied)
        self.onChatDenied(data.from);
    });

    wsServer.on('chat-closed',function(data){
      Woogeen.Logger.info('Remote user stopped video chat.');
      if(self.onChatStopped)
        self.onChatStopped(data.from);
    });

    wsServer.on('chat-accepted',function(data){
      Woogeen.Logger.info('Remote user agreed your invitation.');
      if(self.onChatAccepted)
        self.onChatAccepted(data.from);
    });

    wsServer.on('chat-error',function(data){
      Woogeen.Logger.info('Video error: '+data.code);
      if(self.onChatError)
        self.onChatError(data.code);
    });

    wsServer.on('chat-signal',function(data){
      Woogeen.Logger.debug('Received signal message');
      if(self.onChatSignal)
        self.onChatSignal(data.from, data.data);
    });

    wsServer.on('stream-type',function(data){
      Woogeen.Logger.debug('Received video type message');
      if(self.onStreamType)
        self.onStreamType(data.from, data.data);
    });

    wsServer.on('chat-stopped',function(data){
      Woogeen.Logger.debug('Remote user stopped video chat.');
      if(self.onChatStopped)
        self.onChatStopped(data.from);
    });

    wsServer.on('chat-negotiation-needed', function(data){
      Woogeen.Logger.debug('Remote user want renegotiation.');
      if(self.onNegotiationNeeded)
        self.onNegotiationNeeded(data.from);
    });

    wsServer.on('chat-negotiation-accepted', function(data){
      Woogeen.Logger.debug('Remote user accepted renegotiation.');
      if(self.onNegotiationAccepted)
        self.onNegotiationAccepted(data.from);
    });

    wsServer.on('chat-wait',function(){
      Woogeen.Logger.debug('Waiting for a peer.');
      if(self.onChatWait)
        self.onChatWait();
    });

    wsServer.on('chat-ready',function(data){
      Woogeen.Logger.debug('Received chat ready with '+data.peerId+' , room ID:' +data.roomId+', offer:'+data.offer);
      if(self.onChatReady)
        self.onChatReady(data.peerId, data.roomId, data.offer);
    });

    wsServer.on('server-authenticated',function(data){
      Woogeen.Logger.debug('Authentication passed. User ID: '+data.uid);
      if(self.onAuthenticated)
        self.onAuthenticated(data.uid);
    });
  };

  connect(serverAddress, token);

  var sendChatEvent = function(uid, eventName, successCallback, failureCallback){
    sendChatData(eventName, {to:uid}, successCallback, failureCallback);
  };

  var sendChatData = function(eventName, data, successCallback, failureCallback){
    wsServer.emit(eventName, data, function(err){
      if(err && failureCallback)
        failureCallback(err);
      else if(successCallback)
        successCallback();
    });
  };

  /**
   * Send a video invitation to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatInvitation= function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-invitation', successCallback, failureCallback);
  };

  /**
   * Send video agreed message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatAccepted=function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-accepted', successCallback, failureCallback);
  };

  /**
   * Send video denied message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatDenied=function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-denied', successCallback, failureCallback);
  };

  /**
   * Send video stopped message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatStopped=function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-stopped', successCallback, failureCallback);
  };

  /**
   * Send video type message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} stream to Remote user, it is like: {streamId:'label of stream', type:'audio'} or {streamId:'label of stream', type:'video'} or {streamId:'label of stream', type:'screen'}
   */
  this.sendStreamType=function(uid, stream, successCallback, failureCallback){
    sendChatData('stream-type',{to:uid, data:stream}, successCallback, failureCallback);
  };

  /**
   * Send negotiation needed message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendNegotiationNeeded=function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-negotiation-needed', successCallback, failureCallback);
  };

  /**
   * Send negotiation accept message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendNegotiationAccepted=function(uid, successCallback, failureCallback){
    sendChatEvent(uid, 'chat-negotiation-accepted', successCallback, failureCallback);
  };

  /**
   * Send signal message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} message Signal message
   */
  this.sendSignalMessage=function(uid, message, successCallback, failureCallback){
    Woogeen.Logger.debug('C->S: '+JSON.stringify(message));
    sendChatData('chat-signal',{to:uid, data:message}, successCallback, failureCallback);
  };

  /**
   * Send room join message to server
   * @memberOf Gab#
   * @param {string} Room token.
   */
  this.sendJoinRoom=function(roomId, successCallback, failureCallback){
    sendChatData('chatroom-join',{roomId:roomId}, successCallback, failureCallback);
  };

  /**
   * Send leave room message to server
   * @memberOf Gab#
   */
  this.sendLeaveRoom=function(roomId, successCallback, failureCallback){
    sendChatData('chatroom-leave',{roomId:roomId}, successCallback, failureCallback);
  };

  /**
   * Finalize
   * @memberOf Gab#
   */
  this.finalize=function(){
    wsServer.close();
  };
}
