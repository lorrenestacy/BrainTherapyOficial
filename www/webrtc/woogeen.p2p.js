/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/
var Woogeen=Woogeen||{};
Woogeen.EventDispatcher=function(d){var c={};d.dispatcher={};d.dispatcher.eventListeners={};c.addEventListener=function(c,e){void 0===d.dispatcher.eventListeners[c]&&(d.dispatcher.eventListeners[c]=[]);d.dispatcher.eventListeners[c].push(e)};c.removeEventListener=function(c,e){var i;i=d.dispatcher.eventListeners[c].indexOf(e);-1!==i&&d.dispatcher.eventListeners[c].splice(i,1)};c.dispatchEvent=function(c){for(var e in d.dispatcher.eventListeners[c.type])if(d.dispatcher.eventListeners[c.type].hasOwnProperty(e))d.dispatcher.eventListeners[c.type][e](c)};return c};
Woogeen.WoogeenEvent=function(d){var c={};c.type=d.type;return c};Woogeen.RoomEvent=function(d){var c=Woogeen.WoogeenEvent(d);c.streams=d.streams;return c};Woogeen.StreamEvent=function(d){var c=Woogeen.WoogeenEvent(d);c.stream=d.stream;c.msg=d.msg;return c};Woogeen.PublisherEvent=function(d){return Woogeen.WoogeenEvent(d)};Woogeen.ServerEvent=function(d){return Woogeen.WoogeenEvent(d)};Woogeen.ChatEvent=function(d){var c=Woogeen.WoogeenEvent(d);c.senderId=d.senderId;c.peerId=d.peerId;return c};
Woogeen.DataEvent=function(d){var c=Woogeen.WoogeenEvent(d);d.data&&(c.data=d.data);d.senderId&&(c.senderId=d.senderId);d.peerId&&(c.peerId=d.peerId);return c};Woogeen.RecorderEvent=function(d){var c=Woogeen.WoogeenEvent(d);d.audio&&(c.audio=d.audio);return c};Woogeen=Woogeen||{};
Woogeen.Error={STREAM_LOCAL_ACCESS_DENIED:{code:1101,message:"Cannot access to camera or micphone."},P2P_CONN_SERVER_UNKNOWN:{code:2100,message:"Server unknown error."},P2P_CONN_SERVER_UNAVAILABLE:{code:2101,message:"Server is unavaliable."},P2P_CONN_SERVER_BUSY:{code:2102,message:"Server is too busy."},P2P_CONN_SERVER_NOT_SUPPORTED:{code:2103,message:"Method has not been supported by server"},P2P_CONN_CLIENT_UNKNOWN:{code:2110,message:"Client unknown error."},P2P_CONN_CLIENT_NOT_INITIALIZED:{code:2111,message:"Connection is not initialized."},
P2P_CONN_AUTH_UNKNOWN:{code:2120,message:"Authentication unknown error."},P2P_CONN_AUTH_FAILED:{code:2121,message:"Wrong username or token."},P2P_MESSAGING_TARGET_UNREACHABLE:{code:2201,message:"Remote user cannot be reached."},P2P_CHATROOM_ATTENDEE_EXCEED:{code:2301,message:"Exceed room's limitation"},P2P_CHATROOM_PEER_NOT_FOUND:{code:2302,message:"Peer not found. Only one client in the room."},P2P_CLIENT_UNKNOWN:{code:2400,message:"Unknown errors."},P2P_CLIENT_UNSUPPORTED_METHOD:{code:2401,message:"This method is unsupported in current browser."},
P2P_CLIENT_ILLEGAL_ARGUMENT:{code:2402,message:"Illegal argument."},P2P_CLIENT_INVALID_STATE:{code:2403,message:"Invalid peer state."},getErrorByCode:function(d){return{1101:Woogeen.Error.STREAM_LOCAL_ACCESS_DENIED,2100:Woogeen.Error.P2P_CONN_SERVER_UNKNOWN,2101:Woogeen.Error.P2P_CONN_SERVER_UNAVAILABLE,2102:Woogeen.Error.P2P_CONN_SERVER_BUSY,2103:Woogeen.Error.P2P_CONN_SERVER_NOT_SUPPORTED,2110:Woogeen.Error.P2P_CONN_CLIENT_UNKNOWN,2111:Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED,2120:Woogeen.Error.P2P_CONN_AUTH_UNKNOWN,
2121:Woogeen.Error.P2P_CONN_AUTH_FAILED,2201:Woogeen.Error.P2P_MESSAGING_TARGET_UNREACHABLE,2301:Woogeen.Error.P2P_CHATROOM_ATTENDEE_EXCEED,2302:Woogeen.Error.P2P_CHATROOM_PEER_NOT_FOUND,2400:Woogeen.Error.P2P_CLIENT_UNKNOWN,2401:Woogeen.Error.P2P_CLIENT_UNSUPPORTED_METHOD,2402:Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT,2403:Woogeen.Error.P2P_CLIENT_INVALID_STATE}[d]}};Woogeen=Woogeen||{};
Woogeen.PeerClient=function(d){var c=Woogeen.EventDispatcher({}),g=null,e={},i={},h={},j=null,G={optional:[{DtlsSrtpKeyAgreement:"true"}]},q=null;d&&(q={},d.iceServers&&(q.iceServers=function(a){for(var b=[],f=0;f<a.length;f++){var c=a[f];if("[object Array]"===Object.prototype.toString.call(c.urls))for(var e=0;e<c.urls.length;e++)b.push({url:c.urls[e],username:c.username,credential:c.credential});else b.push({url:c.urls,username:c.username,credential:c.credential})}return b}(d.iceServers)));var n=
function(a){var b;b=null;try{b=r(a)}catch(f){}if(b=b&&b.host&&b.id?b:null){a=b.id;a=h[a]?h[a].peer:void 0;return a?a.id:null}return a},k=function(a,b){if(a.state==6||a.state==5){a.sendDataChannel&&a.sendDataChannel.close();a.receiveDataChannel&&a.receiveDataChannel.close();a.connection&&a.connection.iceConnectionState!=="closed"&&a.connection.close();if(a.state!==1){a.state=1;c.dispatchEvent(Woogeen.ChatEvent({type:"chat-stopped",peerId:a.id,senderId:b}))}}},H=function(){c.dispatchEvent(Woogeen.ServerEvent({type:"server-connected"}))},
I=function(){for(var a in e){k(e[a],j);delete e[a]}c.dispatchEvent(Woogeen.ServerEvent({type:"server-disconnected"}))},J=function(a){var b=e[a];if(!b){m(a);b=e[a]}if(b.state===1||b.state===4){e[a].state=4;c.dispatchEvent(Woogeen.ChatEvent({type:"chat-invited",senderId:a}))}else if(b.state===3&&j.localeCompare(a)<0){b.state=4;s(a,function(){c.dispatchEvent(Woogeen.ChatEvent({type:"chat-accepted",senderId:a}))})}},K=function(a){var b=e[a];if(b&&b.connection){b.sendDataChannel&&b.sendDataChannel.close();
b.receiveDataChannel&&b.receiveDataChannel.close();b.connection.close();delete e[a]}c.dispatchEvent(Woogeen.ChatEvent({type:"chat-denied",senderId:a}))},L=function(a){Woogeen.Logger.debug("Received chat accepted.");var b=e[a];if(b){b.state=2;o(b);b.state=5;t(b);c.dispatchEvent(Woogeen.ChatEvent({type:"chat-accepted",senderId:a}))}},M=function(a){var b=e[a];if(b&&b.connection){k(b,a);delete e[a]}},P=function(a,b){var f=e[a];f&&f.state===5&&(f.connection||o(f));Woogeen.Logger.debug("S->C: "+JSON.stringify(b));
if(b.type==="offer")N(f,{message:b});else if(b.type==="answer")O(f,{message:b});else if(b.type==="candidate"){f&&Woogeen.Logger.debug("On remote ice candidate from peer "+f.id);if(f&&(f.state===3||f.state===5||f.state===6)){var c=new RTCIceCandidate({candidate:b.candidate,sdpMid:b.sdpMid,sdpMLineIndex:b.sdpMLineIndex});if(f.connection){Woogeen.Logger.debug("Add remote ice candidates.");f.connection.addIceCandidate(c,u,v)}else{Woogeen.Logger.debug("Cache remote ice candidates.");f.remoteIceCandidates?
f.remoteIceCandidates=[]:f.remoteIceCandidates.push(c)}}}},Q=function(a,b){i[b.streamId]=b.type;Woogeen.Logger.debug("remote stream label:"+b.streamId+",type:"+i[b.streamId])},R=function(a,b,f){e[a]||m(a);var l=e[a];if(l.state===1&&o(l)){l.state=2;l.roomId=b;h[room.id]={peer:l};c.dispatchEvent(Woogeen.ChatEvent({type:"chat-ready",roomId:b,peerId:a}))}f&&w(null,a)},S=function(){c.dispatchEvent(Woogeen.ChatEvent({type:"chat-wait"}))},T=function(a){j=a},N=function(a,b){if(a)switch(a.state){case 3:case 2:a.state=
5;o(a);case 5:case 6:Woogeen.Logger.debug("About to set remote description. Signaling state: "+a.connection.signalingState);a.connection.setRemoteDescription(new RTCSessionDescription(b.message),function(){U(a);x(a)},function(a){Woogeen.Logger.debug("Set remote description failed. Message: "+JSON.stringify(a))});break;default:Woogeen.Logger.debug("Unexpected peer state: "+a.state)}else Woogeen.Logger.debug('"peer" cannot be null or undefined')},O=function(a,b){if(a&&(a.state===5||a.state===6)){Woogeen.Logger.debug("About to set remote description. Signaling state: "+
a.connection.signalingState);a.connection.setRemoteDescription(new RTCSessionDescription(b.message),function(){Woogeen.Logger.debug("Set remote descripiton successfully.");x(a);y(a)},function(a){Woogeen.Logger.debug("Set remote description failed. Message: "+a)})}},u=function(){Woogeen.Logger.debug("Add ice candidate success.")},v=function(a){Woogeen.Logger.debug("Add ice candidate failed. Error: "+a)},o=function(a){if(!a||a.connection)return true;try{a.connection=new RTCPeerConnection(q,G);a.connection.onicecandidate=
function(b){b.candidate&&g.sendSignalMessage(a.id,{type:"candidate",candidate:b.candidate.candidate,sdpMid:b.candidate.sdpMid,sdpMLineIndex:b.candidate.sdpMLineIndex})};a.connection.onaddstream=function(a){Woogeen.Logger.debug("Remote stream added.");a=Woogeen.StreamEvent({type:"stream-subscribed",stream:{stream:a.stream,type:i[a.stream.label]||"video"}});c.dispatchEvent(a)};a.connection.onremovestream=function(){Woogeen.Logger.debug("Remote stream removed.");var a=Woogeen.StreamEvent({type:"stream-removed"});
c.dispatchEvent(a)};a.connection.oniceconnectionstatechange=function(){if(a){Woogeen.Logger.debug("Ice connection state changed. State: "+a.connection.iceConnectionState);if(a.connection.iceConnectionState==="closed"&&a.state===6){k(a,a.id);g.sendChatStopped(a.id);delete e[a.id]}if(a.connection.iceConnectionState==="connected"&&a.state!==6){a.state=6;c.dispatchEvent(Woogeen.ChatEvent({type:"chat-started",peerId:a.id}))}if(a.connection.iceConnectionState==="completed"&&a.state!==6){a.state=6;c.dispatchEvent(Woogeen.ChatEvent({type:"chat-started",
peerId:a.id}))}}};a.connection.onnegotiationneeded=function(){Woogeen.Logger.debug("On negotiation needed.");if(!a.isNegotiationNeeded){a.isNegotiationNeeded=true;g.sendNegotiationNeeded(a.id)}};a.connection.onsignalingstatechange=function(){Woogeen.Logger.debug("Signaling state changed: "+a.connection.signalingState);if(a.connection.signalingState==="closed"){k(a,a.id);delete e[a.id]}else if(a.connection.signalingState==="stable"&&a.isRemoteNegotiationNeeded){g.sendNegotiationAccepted(a.id);a.isRemoteNegotiationNeeded=
false}else a.connection.signalingState==="stable"&&p(a)};a.connection.ondatachannel=function(b){Woogeen.Logger.debug(j+": On data channel");if(!a.dataChannels[b.channel.label]){a.dataChannels[b.channel.label]=b.channel;Woogeen.Logger.debug("Save remote created data channel.")}z(b.channel,a)}}catch(b){Woogeen.Logger.debug("Failed to create PeerConnection, exception: "+b.message);return false}return true},z=function(a,b){a.onmessage=function(a){a=Woogeen.DataEvent({type:"data-received",senderId:b.id,
data:a.data});c.dispatchEvent(a)};a.onopen=function(a){Woogeen.Logger.debug("Data Channel is opened");var e=Woogeen.DataEvent({type:"data-opened",senderId:b.id});c.dispatchEvent(e);if(a.target.label=="message"){Woogeen.Logger.debug("Data channel for messages is opened.");y(b)}};a.onclose=function(){Woogeen.Logger.debug("Data Channel is closed")};a.onerror=function(a){Woogeen.Logger.debug("Data Channel Error:",a)}},B=function(a,b){b||(b="message");A(n(a),b)},A=function(a,b){var f=e[a];if(f&&!f.dataChannels[b]){Woogeen.Logger.debug("Do create data channel.");
try{var c=f.connection.createDataChannel(b,null);z(c,f);f.dataChannels.message=c}catch(d){Woogeen.Logger.debug("Failed to create SendDataChannel, exception: "+d.message)}}},m=function(a){e[a]||(e[a]={state:1,id:a,pendingStreams:[],pendingUnpublishStreams:[],remoteIceCandidates:[],dataChannels:{},pendingMessages:[]});return e[a]},r=function(a){return room=JSON.parse(a)},V=function(a){var b=e[a];if(b)b.isNegotiationNeeded&&j.localeCompare(a)<0&&b.connection.signalingState==="stable"?b.isRemoteNegotiationNeeded=
true:g.sendNegotiationAccepted(a)},W=function(a){if(a=e[a]){t(a);a.isNegotiationNeeded=false}},s=function(a,b,f){g||f(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);e[a]||m(a);var c=e[a];if(c.state===4){c.state=2;g.sendChatAccepted(a,b,function(a){c.state=4;f(Woogeen.Error.getErrorByCode(a))})}else{Woogeen.Logger.debug("Invalid state. Will not send acceptance.");f(Woogeen.Error.P2P_CLIENT_INVALID_STATE)}},t=function(a){if(a.connection){p(a);a.pendingMessages.length&&A(a);navigator.mozGetUserMedia&&
!a.pendingStreams.length&&!a.connection.getLocalStreams().length&&B(a.id);a.connection.createOffer(function(b){b.sdp=C(b.sdp);a.connection.setLocalDescription(b,function(){Woogeen.Logger.debug("Set local descripiton successfully.");g.sendSignalMessage(a.id,b)},function(a){Woogeen.Logger.debug("Set local description failed. Message: "+JSON.stringify(a))})},function(a){Woogeen.Logger.debug("Create offer failed. Error info: "+JSON.stringify(a))});a.isNegotiationNeeded=false}else Woogeen.Logger.error("Peer connection have not been created.")},
x=function(a){if(a&&a.connection&&a.remoteIceCandidates&&a.remoteIceCandidates.length!==0){for(var b=0;b<a.remoteIceCandidates.length;b++){Woogeen.Logger.debug("remoteIce, length:"+remoteIceCandidates.length+", current:"+b);(a.state===6||a.state===5)&&a.connection.addIceCandidate(remoteIceCandidates[b],u,v)}a.remoteIceCandidates=[]}},p=function(a){Woogeen.Logger.debug("Draining pending streams.");if(a.connection){Woogeen.Logger.debug("Peer connection is ready for draining pending streams.");for(var b=
0;b<a.pendingStreams.length;b++){D(a.pendingStreams[b],a);Woogeen.Logger.debug("Sent stream type.");a.connection.addStream(a.pendingStreams[b].stream);Woogeen.Logger.debug("Added stream to peer connection.")}a.pendingStreams=[];for(b=0;b<a.pendingUnpublishStreams.length;b++){a.connection.removeStream(a.pendingUnpublishStreams[b].stream);Woogeen.Logger.debug("Remove stream.")}a.pendingUnpublishStreams=[]}},y=function(a){Woogeen.Logger.debug("Draining pendding messages.");var b=a.dataChannels.message;
if(b&&b.readyState==="open"){for(var f=0;f<a.pendingMessages.length;f++)b.send(a.pendingMessages[f]);a.pendingMessages=[]}},U=function(a){a.connection?a.connection.createAnswer(function(b){b.sdp=C(b.sdp);a.connection.setLocalDescription(b,function(){Woogeen.Logger.debug("Set local description successfully.");g.sendSignalMessage(a.id,b);Woogeen.Logger.debug("Sent answer.")},function(a){Woogeen.Logger.error("Error occurred while setting local description. Error message:"+a)})},function(a){Woogeen.Logger.error("Create answer failed. Message: "+
a)}):Woogeen.Logger.error("Peer connection have not been created.")},w=function(a,b,f,c){b=n(b);Woogeen.Logger.debug("Publish to: "+b);if(b){e[b]||m(b);b=e[b];Object.prototype.toString.call(a)==="[object Array]"?b.pendingStreams.concat(a):a&&b.pendingStreams.push(a);switch(b.state){case 5:case 6:b.pendingStreams.length>0&&p(b);break;default:Woogeen.Logger.debug("Unexpected peer state: "+b.state);c&&c(Woogeen.Error.P2P_CLIENT_INVALID_STATE);return}f&&f()}else c&&c(Woogeen.Error.P2P_CHATROOM_PEER_NOT_FOUND)},
D=function(a,b){if(a!==null){var f="audio";a.hasVideo()?f="video":a.hasScreen()&&(f="screen");g.sendStreamType(b.id,{streamId:a.stream.label,type:f})}},E=function(a,b,f){if(g){if(a){f=e[a];if(!f)return;g.sendChatStopped(f.id);k(f,j);delete e[a]}else for(var c in e){f=e[c];g.sendChatStopped(f.id);k(f,j);delete e[f.id]}b&&b()}else f&&f(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED)},F=function(a,b,f){var c=h[a];if(c){E(c.peer.id);if(!g){f&&f(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);return}g.sendLeaveRoom(a);
delete h[a]}b&&b()},C=function(a){var b=/video \d*? RTP\/SAVPF( \d*?)* 96/ig,c=a.match(b);if(c&&c.length){c[0]=c[0].replace(" 96","");a=a.replace(b,c[0]);a=a.replace(/a=rtpmap:96 rtx\/90000\r\n/ig,"");a=a.replace(/a=fmtp:96 apt=100\r\n/ig,"")}return a};c.connect=function(a){g=new Gab(a);g.onConnected=H;g.onDisconnected=I;g.onChatStopped=M;g.onChatAccepted=L;g.onChatDenied=K;g.onChatInvitation=J;g.onChatSignal=P;g.onStreamType=Q;g.onNegotiationNeeded=V;g.onNegotiationAccepted=W;g.onChatWait=S;g.onChatReady=
R;g.onAuthenticated=T};c.disconnect=function(){g&&g.finalize();g=null};c.invite=function(a,b,c){if(g){e[a]||m(a);var d=e[a];if(d.state===1||d.state===3){Woogeen.Logger.debug("Send invitation to "+a);d.state=3;g.sendChatInvitation(a,function(){b&&b()},function(a){d.state=1;c&&c(Woogeen.Error.getErrorByCode(a))})}else{Woogeen.Logger.debug("Invalid state. Will not send invitation.");c(Woogeen.Error.P2P_CLIENT_INVALID_STATE)}}else c(new Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED)};c.publish=function(a,
b,c,e){!a||!b?e&&e(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT):w(a,b,c,e)};c.unpublish=function(a,b,c,d){Woogeen.Logger.debug("Unpublish stream.");if(b=n(b)){if(e[b]){b=e[b];b.pendingUnpublishStreams.push(a);b.state===6&&p(b);c&&c()}}else d&&d(Woogeen.Error.P2P_CHATROOM_PEER_NOT_FOUND)};c.deny=function(a,b,c){if(e[a]&&e[a].state===4)if(g){g.sendChatDenied(a,b,function(a){c&&c(Woogeen.Error.getErrorByCode(a))});delete e[a]}else c(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED)};c.accept=s;c.stop=E;c.joinRoom=
function(a,b,c){a=r(a);h[a.id]||(g?g.sendJoinRoom(a.id,b,function(a){c&&c(Woogeen.Error.getErrorByCode(a))}):c&&c(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED))};c.leaveRoom=function(a,b,c){if(a){room=r(a);F(room.id,b,c)}else for(var e in h)F(h[e],b,c)};c.sendData=function(a,b,c,d){var b=n(b),g=e[b];if(g)if((d=g.dataChannels.message)&&d.readyState==="open")d.send(a);else{g.pendingMessages.push(a);B(b)}else d&&d(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);c&&c()};c.switchStream=function(a,b,c,d){c=
e[c];a!==null&&c.connection.removeStream(a.stream);D(b,c);c.connection.addStream(b.stream);d&&d()};return c};
