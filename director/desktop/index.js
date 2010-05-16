$(function() {

  // user-entered URI
  $('#goButton').click(function(){
    var uri = $('#userURI').val();
    handleURI(uri);
  });

  $('#userURI').keyup(function(e) {
    if (e.keyCode==13){
      $('#goButton').click();
    }
  });


  // activity can be left blank, if you don't need any auto-code downloading.
  var activity = { ad: "edu.stanford.junction.director", friendlyName: "Activity Director" };
  var actor = {
	          roles: ['director']
		, onMessageReceived: function(msg) {
			if (msg.action) {
				var action = msg.action;
				if (action == "cast"){
					if (msg.activity) {
						handleURI(msg.activity);
					}
				}
			}
		 }
		};

  function openURL(url) {
    //window.open(url);
    //window.location=url;

    var win = "<div class=\"popup ui-widget-content\"><h3>New Window</h3>";
    win += '<iframe src="'+url+'" style="width:90%;height:90%"/>';
    win += "</div>";
    $("body").append(win);
    $(".popup").resizable().draggable();
  }

  function handleURI(uri) {
    var parsed = parseUri(uri);
    var session = parsed.path.substring(1);
    var switchboard = parsed.host;
    if (uri.substring(0,4) == 'http') {
	openURL(uri);
	return;
    }

    if (uri.substring(0,11) == 'junction://')
	jm.activityScriptCallback(uri,function(ad){
		var role = '';
		if ((d = uri.indexOf('role=')) >= 0) {
			role = uri.substring(d+5);
			if ((d=role.indexOf('&'))>=0) {
				role = role.substring(0,d);
			}
		}
			if (role == '' || !ad.roles || !ad.roles[role]) return;
			platforms = ad.roles[role].platforms;
			if (platforms['web']) {
				var launch = platforms['web'].url;
				if (launch.indexOf('?') >= 0) {
					launch += '&';
				} else {
					launch += '?';
				}
				launch += 'jxinvite='+escape(uri);
				openURL(launch);
			}
	});
 }

  var jm = JunctionMaker.getInstance('prpl.stanford.edu');
  var jx = jm.newJunction(activity,actor);

  size=400;
  $('#qr').attr('src',jx.getInvitationQR('inviter',size));
  $('#userURI').css('width',size);
  $('#uribar').html(jx.getInvitationURI());
  $('#userURI').val('junction://');
});