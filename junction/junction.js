var JunctionMaker = function()
{
	var _hostURL;

	
	function getXMPPConnection(onConnect) {
		var _jid='junction';
		var _pw='junction';

		var connection = new Strophe.Connection('http://' + _hostURL + '/http-bind');
		connection.connect(_jid,_pw,onConnect);
		return connection;
	}

	function Junction(activity,actor) {
		var _activityDesc = activity;
		if (_activityDesc.sessionID) {
			var _sessionID = _activityDesc.sessionID;
		} else {
			var _sessionID = randomUUID();
		}
		if (_activityDesc.host) {
			_hostURL = _activityDesc.host;
		} else {
			_hostURL = "prpl.stanford.edu";
		}
		var _actorID = randomUUID();

		var MUC_ROOM = _sessionID;
		var MUC_COMPONENT = 'conference.'+_hostURL;
		

		function onPresence(msg){
			var user = Strophe.getResourceFromJid(msg.getAttribute('from'));
			var type = msg.getAttribute('type');

			// TODO: build up roster for room.
			if (type == null && user == _actorID) {
				if (actor && actor.onConnect) {
					actor.onConnect();
				}
				return false;
			}
			return true;
		}

		function onConnect(status){
			if (status == Strophe.Status.CONNECTED) {
				_xmppConnection.send(
					$pres({to: MUC_ROOM + "@" + MUC_COMPONENT + "/" + _actorID})
					  .c("x", {xmlns: "http://jabber.org/protocol/muc"}).tree());


				_xmppConnection.addHandler(onPresence, 
							null, 
							'presence',
							null,null,null); 

				if (actor && actor.onMessageReceived) {
					var f = function(msg) {

						//var from = msg.getAttribute('from');
						var type = msg.getAttribute('type');
						var body = msg.getElementsByTagName("body")[0].childNodes[0];
						//var user = Strophe.getResourceFromJid(from);

						if (type == "groupchat" && body) {
							try {
								var content = JSON.parse(body.nodeValue);
								actor.onMessageReceived(content);
							} catch (e) {
								return true;
							}
						}
						return true;
					};
					_xmppConnection.addHandler(f, 
							null, 
							'message',
							null,null,null); 
				}
			}
		}


		var _xmppConnection = getXMPPConnection(onConnect);

		return  {
			  activityDesc : _activityDesc,
			  getSessionID : function() { return _sessionID },

			  sendMessageToActor: function (actorID, msg) {

			  },
			  sendMessageToRole: function (role, msg) {

			  },
			  sendMessageToSession: function (msg) {
				if (!(typeof msg == 'object')) {
					msg = {v:msg};
				}
				msg = JSON.stringify(msg);
				_xmppConnection.send($msg({to: MUC_ROOM + "@" + MUC_COMPONENT, 
					type: "groupchat", id: _xmppConnection.getUniqueId
				}).c("body")
				  .t(msg).up()
				  .c("nick", {xmlns: "http://jabber.org/protocol/nick"})
				  .t(_actorID).tree())
			  },

			  getInvitationURL : function () {
				var url = '';
				if (arguments.length == 0) {
					url = _hostURL + "?session="+_sessionID;
				} else if (arguments[0] != false) {
					url = _hostURL + "?session="+_sessionID+"&requestedRole="+arguments[0];
				}
				return url;
			  },
			  getInvitationQR : function () {
				var url;
				var size;
				if (arguments.length == 0) {
					url = _hostURL + "?session="+_sessionID;
				} else if (arguments[0] != false) {
					url = _hostURL + "?session="+_sessionID+"&requestedRole="+arguments[0];
				}
				if (arguments.length == 2) {
					size = arguments[1]+'x'+arguments[1];
				} else {
					size = '250x250';
				}

				return 'http://chart.apis.google.com/chart?cht=qr&chs='+size+'&chl='+encodeURIComponent('{jxref:"'+url+'"}');
				
			  },

			  getActorsForRole : function() { },
			  getRoles : function() { },

			};

	}

	return {
		create: function()
		{
			if (arguments.length == 1) {
				_hostURL = arguments[0];
			}

			return {
				newJunction: function()
				{
					if (arguments.length == 1) {
						return Junction(arguments[0],false);
					} else if (arguments.length == 2) {
						var jx = Junction(arguments[0],arguments[1]);
						arguments[1].junction = jx;
						return jx;
					} else {
						return false;
					}
				}
			};
		}
	}
}();


// TODO: Use JQuery to load this script from another file

/* randomUUID.js - Version 1.0
 * 
 * Copyright 2008, Robert Kieffer
 * 
 * This software is made available under the terms of the Open Software License
 * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
 *
 * The latest version of this file can be found at:
 * http://www.broofa.com/Tools/randomUUID.js
 *
 * For more information, or to comment on this, please go to:
 * http://www.broofa.com/blog/?p=151
 */

/**
 * Create and return a "version 4" RFC-4122 UUID string.
 */

function randomUUID() {
  var s = [], itoh = '0123456789ABCDEF';
  // Make array of random hex digits. The UUID only has 32 digits in it, but we
  // allocate an extra items to make room for the '-'s we'll be inserting.
  for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

  // Conform to RFC-4122, section 4.4
  s[14] = 4;  // Set 4 high bits of time_high field to version
  s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

  // Convert to hex chars
  for (var i = 0; i <36; i++) s[i] = itoh[s[i]];

  // Insert '-'s
  s[8] = s[13] = s[18] = s[23] = '-';

  return s.join('');
}
