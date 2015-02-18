/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

/* Depends on woogeen.js, gab-<signaling channel>.js, WooGeen.Error.js
 * woogeen.p2p.js, woogeen.event.js */

;var Woogeen = Woogeen || {};

// Initialize chat widget with the ID of the html element.
Woogeen.ChatWidget=function(id,pcConfig){

  var that=Woogeen.EventDispatcher({});

  var peerId;
  var pendingPeerId;
  var localStream=Woogeen.Stream({video:true, audio:true});
  var localVideoTag=document.getElementById(id).getElementsByClassName('local')[0];
  var remoteVideoTag=document.getElementById(id).getElementsByClassName('remote')[0];
  var serverAddress;

  // Make sure only one widget in one app.
  if(Woogeen.PeerClient.chatwidget)
    throw "You can use only one chat widget in one app.";
  else
    Woogeen.PeerClient.chatwidget=true;

  var sdk=new Woogeen.PeerClient(pcConfig);

  sdk.addEventListener('chat-invited',function(e){  // Receive invitation from remote client.
    if(!peerId){  // Not chatting
      if(confirm(e.senderId+' invited you to join a chat. Do you accept?')){
        peerId=e.senderId;
        sdk.accept(peerId);
        localStream.init();
      }
      else{
        sdk.deny(e.senderId);
      }
    }
    else{  // Chatting, deny new invitation.
      if(confirm(e.senderId+' invited you to join a chat. Accept this invitation will abort current conversation. Do you want to accept?')){
        pendingPeerId=e.senderId;
        stopChat();
      }
      else{
        sdk.deny(e.senderId);
        pendingPeerId=undefined;
      }
    }
  });

  var setServerAddress=function(sa){
    serverAddress=sa;
  }

  var stopLocal=function(){
    localStream.close();
    peerId=undefined;
    localVideoTag.src=null;
    remoteVideoTag.src=null;
    localVideoTag.style.visibility='hidden';
    remoteVideoTag.style.visibility='hidden';
  };

  sdk.addEventListener('chat-denied', function(e){
    alert('Invitation to '+e.senderId+' has been denied or '+e.senderId+' is chatting with others');
    stopLocal();
  });

  sdk.addEventListener('chat-started', function(e){
    that.dispatchEvent(Woogeen.ChatEvent({type: 'chat-started'}));
  });

  sdk.addEventListener('chat-stopped', function(e){
    stopLocal();
    // The user accepted another invitation.
    if(pendingPeerId){
      peerId=pendingPeerId;
      pendingPeerId=undefined;
      localStream.init();
    }
    that.dispatchEvent(Woogeen.ChatEvent({type: 'chat-stopped'}));
  });

  sdk.addEventListener('stream-subscribed', function(e){
    remoteVideoTag.style.cssText = null;
    localVideoTag.style.cssText = null;
    remoteVideoTag.style.visibility='visible';
    attachMediaStream(remoteVideoTag,e.stream.stream);
  });

  var onAccessAccepted=function(e){
    sdk.publish(localStream,peerId);
    attachMediaStream(localVideoTag,localStream.stream);
    localVideoTag.style.visibility='visible';
  };

  localStream.addEventListener('access-accepted',onAccessAccepted);

  var connect=function(loginInfo){
    loginInfo.host=serverAddress;
    sdk.connect(loginInfo);
  };

  var disconnect=function(){
    sdk.disconnect();
  };

  var startChat=function(targetId){
    peerId=targetId;
    sdk.invite(peerId);
    localStream.init();
  };

  var stopChat=function(){
    sdk.stop(peerId);
  };

  that.connect=connect;
  that.disconnect=disconnect;
  that.startChat=startChat;
  that.stopChat=stopChat;
  that.setServerAddress=setServerAddress;
  return that;
};

console.log('Loaded chat widget.');
