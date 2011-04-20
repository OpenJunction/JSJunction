A quickstart example for using JSJunction:

<html>
  <head>
    <script type="text/javascript" 
            src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>    

    <script language='javascript' type='text/javascript' 
            src='http://openjunction.github.com/JSJunction/json2.js'></script>
    <script language='javascript' type='text/javascript' 
            src='http://openjunction.github.com/JSJunction/strophejs/1.0.1/strophe.js'></script>
    <script language='javascript' type='text/javascript' 
            src='http://openjunction.github.com/JSJunction/junction/0.7.0/junction.js'></script>
    
    <script type="text/javascript">

var activity = {ad:"my.test.app"};
var actor = {
    onMessageReceived: function(msg) { alert("got a message: " + msg.text); }
  , onActivityJoin: function() { alert("joined!"); this.sendMessageToSession({text: "first post!"}); }
};
JX.getInstance("sb.openjunction.org").newJunction(activity,actor);

    </script>    
  </head>
  <body>
  </body>
</html>
