TestCase("JIDs", {
    testNormalJid: function () {
        var jid = "darcy@pemberley.lit/library";
        assertEquals("Node should be 'darcy'",
                     "darcy", Strophe.getNodeFromJid(jid));
        assertEquals("Domain should be 'pemberley.lit'",
                     "pemberley.lit", Strophe.getDomainFromJid(jid));
        assertEquals("Resource should be 'library'",
                     "library", Strophe.getResourceFromJid(jid));
        assertEquals("Bare JID should be 'darcy@pemberley.lit'",
                     "darcy@pemberley.lit", Strophe.getBareJidFromJid(jid));
    },

    testWeirdNode: function () {
        var jid = "darcy@netherfield.lit@pemberley.lit/library";
        assertEquals("Node should be 'darcy'",
                     "darcy", Strophe.getNodeFromJid(jid));
        assertEquals("Domain should be 'netherfield.lit@pemberley.lit'",
                     "netherfield.lit@pemberley.lit", 
                     Strophe.getDomainFromJid(jid));
        assertEquals("Resource should be 'library'",
                     "library", Strophe.getResourceFromJid(jid));
        assertEquals("Bare JID should be 'darcy@netherfield.lit@pemberley.lit",
                     "darcy@netherfield.lit@pemberley.lit",
                     Strophe.getBareJidFromJid(jid));
    }
});

function foo() {
    var $ = function () {};

    test("Weird node (escaped)", function () {
        var escapedNode = Strophe.escapeNode("darcy@netherfield.lit");
        var jid = escapedNode + "@pemberley.lit/library";
        equals(Strophe.getNodeFromJid(jid), "darcy\\40netherfield.lit",
               "Node should be 'darcy\\40netherfield.lit'");
        equals(Strophe.getDomainFromJid(jid),
               "pemberley.lit",
               "Domain should be 'pemberley.lit'");
        equals(Strophe.getResourceFromJid(jid), "library",
               "Resource should be 'library'");
        equals(Strophe.getBareJidFromJid(jid),
               "darcy\\40netherfield.lit@pemberley.lit",
               "Bare JID should be 'darcy\\40netherfield.lit@pemberley.lit'");
    });

    test("Weird resource", function () {
        var jid = "books@chat.pemberley.lit/darcy@pemberley.lit/library";
        equals(Strophe.getNodeFromJid(jid), "books",
               "Node should be 'books'");
        equals(Strophe.getDomainFromJid(jid), "chat.pemberley.lit",
               "Domain should be 'chat.pemberley.lit'");
        equals(Strophe.getResourceFromJid(jid),
               "darcy@pemberley.lit/library",
               "Resource should be 'darcy@pemberley.lit/library'");
        equals(Strophe.getBareJidFromJid(jid),
               "books@chat.pemberley.lit",
               "Bare JID should be 'books@chat.pemberley.lit'");
    });

    module("Builder");

    test("Correct namespace (#32)", function () {
        var stanzas = [new Strophe.Builder("message", {foo: "asdf"}).tree(),
                       $build("iq", {}).tree(),
                       $pres().tree()];
        $.each(stanzas, function () {
            equals($(this).attr('xmlns'), Strophe.NS.CLIENT,
                  "Namespace should be '" + Strophe.NS.CLIENT + "'");
        });
    });
    
    test("send() accepts Builders (#27)", function () {
        var stanza = $pres();
        var conn = new Strophe.Connection("");
        // fake connection callback to avoid errors
        conn.connect_callback = function () {};
        
        ok(conn._data.length === 0, "Output queue is clean");
        try {
            conn.send(stanza);
        } catch (e) {}
        ok(conn._data.length === 1, "Output queue contains an element");
    });

    test("send() does not accept strings", function () {
        var stanza = "<presence/>";
        var conn = new Strophe.Connection("");
        // fake connection callback to avoid errors
        conn.connect_callback = function () {};
        expect(1);
        try {
            conn.send(stanza);
        } catch (e) {
            equals(e.name, "StropheError", "send() should throw exception");
        }
    });

    test("Builder with XML attribute escaping test", function () {
        var text = "<b>";
        var expected = "<presence to='&lt;b>' xmlns='jabber:client'/>";
        var pres = $pres({to: text});
        equals(pres.toString(), expected, "< should be escaped");

        text = "foo&bar";
        expected = "<presence to='foo&amp;bar' xmlns='jabber:client'/>";
        pres = $pres({to: text});
        equals(pres.toString(), expected, "& should be escaped");
    });

    module("XML");

    test("XML escaping test", function () {
        var text = "s & p";
	var textNode = Strophe.xmlTextNode(text);
	equals(Strophe.getText(textNode), "s &amp; p", "should be escaped");
	var text0 = "s < & > p";
	var textNode0 = Strophe.xmlTextNode(text0);
	equals(Strophe.getText(textNode0), "s &lt; &amp; &gt; p", "should be escaped");
    });

    test("XML element creation", function () {
        var elem = Strophe.xmlElement("message");
        equals(elem.tagName, "message", "Element name should be the same");
    });

    module("Misc");

    test("Quoting strings", function () {
        var input = '"beep \\40"';
        var conn = new Strophe.Connection();
        var output = conn._quote(input);
        equals(output, "\"\\\"beep \\\\40\\\"\"",
               "string should be quoted and escaped");
    });
}
