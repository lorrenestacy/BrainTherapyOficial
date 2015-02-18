/*
* @license Copyright © 2014 Intel Corporation. All rights reserved
*/

(function()
 {
  "use strict";
  
   var networkConfig = {
    iceServers: [{
      urls: "turn:180.153.223.233:4478?transport=udp",
      credential: "master",
      username: "woogeen"
    }, {
      urls: "turn:180.153.223.233:443?transport=udp",
      credential: "master",
      username: "woogeen"
    }, {
      urls: "turn:180.153.223.233:4478?transport=tcp",
      credential: "master",
      username: "woogeen"
    }, {
      urls: "turn:180.153.223.233:443?transport=tcp",
      credential: "master",
      username: "woogeen"
    }, {
      urls: "stun:stun.l.google.com:19302"
    }]
  }; // Set stun/turn servers.
  
   function toggle_buttons($dn, show_class, hide_class)
   {
     $dn.find(show_class).removeClass("hidden");
     $dn.find(hide_class).addClass("hidden");
   }
   
   function init_webrtc()
   {
     //console.log('HOLA init_webrtc');
     var all_webrtc = $(".ad_webrtc");
     all_webrtc.each(function(index){ 
       var $dn = $(this);
       var name = $dn.find(".chatwidget").attr("id");
       if(name)
       {
         var chat_widget = new Woogeen.ChatWidget(name, networkConfig); 
         chat_widget.addEventListener('chat-started',function(){
           toggle_buttons($dn, ".target-disconnect", ".target-connect");
         });
         chat_widget.addEventListener('chat-stopped',function(){
           toggle_buttons($dn, ".target-connect", ".target-disconnect");
         });
         window[name] = chat_widget;
         
         var serverAddress = $dn.attr("data-server"); //'http://180.153.223.233:8095/webrtc';
         chat_widget.setServerAddress(serverAddress);

         var always_connect_from = $dn.attr("data-connect-from");
         if(always_connect_from)
         {
           chat_widget.connect({token:always_connect_from});
         }
         //hook up login and logout
         var $webrtc_login = $('[data-uib="widgets/webrtc-login"]');
         var authentication = $webrtc_login.data("auth"); //authentication => "peer server" || "yahoo" || "custom"
         $webrtc_login.find(".login button").click(function(){
        
           console.log('Login button clicked.');
             
           if(authentication==='peer server'){
             var token = $webrtc_login.find("input").val();
             chat_widget.connect({token:token});
           }
           else if(authentication==='yahoo'){
             getRequestToken(function(loginInfo){
               chat_widget.connect(loginInfo);
             });
           }
           else{
            console.log('Customized authentication has not been implemented.');
             //do something with customized authentication ?
           }
           
           toggle_buttons($webrtc_login, ".disconnect", ".login");
         });
         $webrtc_login.find(".disconnect button").click(function(){
           chat_widget.disconnect();
           toggle_buttons($webrtc_login, ".login", ".disconnect");
         });
         
         //hook up start/end 
         var $webrtc_connect = $('[data-uib="widgets/webrtc-connect-to"]');
         $dn.find(".target-connect button").click(function() {
          var connect_to = $webrtc_connect.find("input").val() || $dn.data("data-connect-to");
           
          //do something with authentication? 
           
          chat_widget.startChat(connect_to);
          toggle_buttons($dn, ".target-disconnect", ".target-connect");
        });
        $dn.find(".target-disconnect button").click(function() {
          chat_widget.stopChat();
          toggle_buttons($dn, ".target-connect", ".target-disconnect");
        });
       }
     });
   }
   
   
   document.addEventListener("app.Ready", init_webrtc, false);
         
       
 })();