$(function() {
  var activity = {
		   sessionID:'sqlQuerySession'
		  ,host:'prpl.stanford.edu'
		};
  var actor = {
	          roles: ['role1','role2']
		, onConnect: 
		  function() {
			this.junction.sendMessageToSession({msg:'did it!!!'});
		 }

		, onMessageReceived: function(msg) {
			alert('I got: ' + msg.msg);
			this.junction.sendMessageToActor('bjdodson',{msg:"hey man"});
		 }



		};


  var jm = JunctionMaker.create('prpl.stanford.edu');
  var jx = jm.newJunction(activity,actor);

});
