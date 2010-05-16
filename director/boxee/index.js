
var cur_app = 0;
var num_apps = 1;

function showApp(i) {
  $(".homewrapper").hide();
  $(".appframe").hide();
  if (i<num_apps-1){
    $(".appwrapper").show();
    $($(".appframe")[i]).show();
  } else {
    $(".homewrapper").show();
  }
}

function nextApp() {
  cur_app = (cur_app+1)%num_apps;
  showApp(cur_app);
}

function prevApp() {
  cur_app = (num_apps+cur_app-1)%num_apps;
  showApp(cur_app);
}

$(function() {

var keycodes = {};
keycodes.RIGHT = 39;
keycodes.LEFT = 37;

$(document).bind('keyup',function(e){
  if (e.keyCode == keycodes.RIGHT) {
    nextApp();
    return false;
  } else if (e.keyCode == keycodes.LEFT) {
    prevApp();
    return false;
  }
});

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
  //activity.sessionID='80339570-2B87-494A-870C-50269C13693C';

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

  var firstlaunch=true;
  function openURL(url) {

/*    if (firstlaunch) {
      $(".homewrapper").hide();
      $(".appwrapper").show();
      firstlaunch=false;
    } else {
      $(".appframe").hide();
    }
*/
    var iframe = '<iframe class="appframe" src="'+url+'" style="display:block"></iframe>';
    $(".appwrapper").append(iframe);
    num_apps = $(".appframe").length+1;
    cur_app = num_apps-2;
    showApp(cur_app);
  }

//openURL("http://digg.com");
//openURL("http://cnn.com");
//openURL("http://cnet.com");

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
