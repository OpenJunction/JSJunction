A quickstart example for using JSJunction:

&lt;html&gt;
  &lt;head&gt;
    &lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"&gt;&lt;/script&gt;   
    &lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"&gt;&lt;/script&gt;    

    &lt;script language='javascript' type='text/javascript' src='http://openjunction.github.com/JSJunction/json2.js'&gt;&lt;/script&gt;
    &lt;script language='javascript' type='text/javascript' src='http://openjunction.github.com/JSJunction/strophejs/1.0.1/strophe.js'&gt;&lt;/script&gt;
    &lt;script language='javascript' type='text/javascript' src='http://openjunction.github.com/JSJunction/junction/0.6.8/junction.js'&gt;&lt;/script&gt;
    
    &lt;script type="text/javascript"&gt;

var activity = {ad:"my.test.app"};
var actor = {
    onMessageReceived: function(msg) { alert("got a message: " + msg.text); }
  , onActivityJoin: function() { alert("joined!"); this.sendMessageToSession({text: "first post!"}); }
};
JX.getInstance("openjunction.org").newJunction(activity,actor);

    &lt;/script&gt;    
  &lt;/head&gt;
  &lt;body&gt;
  &lt;/body&gt;
&lt;/html&gt;
