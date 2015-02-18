/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

/**
 * @class SignalingChannel
 * @classDesc Network module for WooGeen P2P chat
 */
function SignalingChannel(){

  this.onMessageReceived=null;
  this.onAuthenticated=null

 
  // message should a string.
  this.sendMessage=function(targetId, message){
    // TODO: send message.
  };

  /* TODO: Do remember to trigger onMessageReceived when new message is received.
     if(this.onMessageReceived)
       this.onMessageReceived(from, message);
   */

  

  this.connect=function(loginInfo){
    // TODO: implement connect
  };

  
  this.disconnect=function(){
    // TODO: disconnect
  };

}
