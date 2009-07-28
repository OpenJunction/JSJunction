$(function() {
  var activity = {
		   sessionID:'sqlQuerySession'
		  ,host:'prpl.stanford.edu'
		};
  var actor = {
		onConnect: 
		  function() {
			this.junction.sendMessageToSession({msg:'did it!!!'});
		 }

		, onMessageReceived: function(msg) {
			alert('I got: ' + msg.msg);
		 }



		};


  var jm = JunctionMaker.create('prpl.stanford.edu');
  var jx = jm.newJunction(activity,actor);

});
