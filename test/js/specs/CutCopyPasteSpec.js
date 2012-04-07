describe('cut-copy-paste-spec', function(){   /**   * Shortcut to PlainTextEditor obj   */   var pte = window.plainTextEditor;    /**   * Properties for a target div   */   var _content = "c'est \n tres belle";   var _id = "test-target-el";      /**   * Adds a new div that is a target for   * PlainText editor before each test   */   beforeEach(function() {            $("body")            .first()            .append("<div id=\""                      + _id                      + "\">"                      + _content                      + "</div>");   });      /**   * Removes newly added div after each test   */   afterEach(function() {      $("#" + _id ).remove();   });      /**   * Tests are listed below:   */   it("cut removes text being selected", function() {      var cutted = "c' \n tres belle";      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.setSelection(2, 5);      pte.cut();      var content = pte.getText();      expect(content).toBe(cutted);   });    });