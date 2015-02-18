(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  Button */
    
    
        /* button  clique aqui */
    
    
        /* button  Vamos começar? */
    
    
        /* button  Anotar */
    $(document).on("click", ".uib_w_39", function(evt)
    {
        /* your code goes here */ 
    });
    
        /* button  Button */
    $(document).on("click", ".uib_w_40", function(evt)
    {
         activate_subpage("#page_3_27"); 
    });
    
        /* button  VAMOS CONTRUIR */
    $(document).on("click", ".uib_w_107", function(evt)
    {
         /* Other possible functions are: 
           uib_sb.open_sidebar($sb)
           uib_sb.close_sidebar($sb)
           uib_sb.toggle_sidebar($sb)
            uib_sb.close_all_sidebars()
          See js/sidebar.js for the full sidebar API */
        
         uib_sb.toggle_sidebar($("#menu_lateral_memorias"));  
    });
    
        /* button  PESSOAS */
    
    
        /* button  #link_abraz */
    $(document).on("click", "#link_abraz", function(evt)
    {
        location.href="http://www.abraz.org.br/orientacao-a-cuidadores/cuidados-com-o-familiar-cuidador";
        /* your code goes here */ 
    });
    
        /* button  BICHOS DE ESTIMAÇÃO */
    
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
