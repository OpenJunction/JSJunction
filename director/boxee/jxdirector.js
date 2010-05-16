boxee.browserWidth=1280;
boxee.browserHeight=720;

boxee.enableLog(true);
boxee.renderBrowser=true;
boxee.autoChoosePlayer=false;

boxee.setMode(boxee.BROWSER_MODE);

requestedURL = boxee.getParam("src");
boxee.log(requestedURL);

boxee.onDocumentLoaded = function()
{
  boxee.log("Loaded document.");
}

boxee.onUp = function() {
	browser.execute('window.scrollBy(0,-50);');
}

boxee.onDown = function() {
	browser.execute('window.scrollBy(0,50);');
}

boxee.onLeft = function()
{
  browser.execute("prevApp()");
}

boxee.onRight = function()
{
  browser.execute("nextApp()");
}

boxee.onEnter = function()
{

}

boxee.onBack = function() {

}
