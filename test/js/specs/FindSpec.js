describe('find-spec', function(){   /**   * Shortcut to PlainTextEditor obj   */   var pte = window.plainTextEditor;    /**   * Properties for a target div   */   var _content = "c'est \n tres belle";   var _id = "test-target-el";      /**   * Adds a new div that is a target for   * PlainText editor before each test   */   beforeEach(function() {            $("body")            .first()            .append("<div id=\""                      + _id                      + "\">"                      + _content                      + "</div>");   });      /**   * Removes newly added div after each test   */   afterEach(function() {      $("#" + _id ).remove();   });      /**   * Tests are listed below:   */   it("find without params returns -1 val", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var pos = pte.find();            expect(pos).toBe(-1);      var sel = pte.getSelection()      expect(sel).toBe(emptyString);         });      it("while not found result is -1", function() {      var emptyString = "";      var searchTarget = "obviously no such string";            var el = $("#" + _id).get(0);      pte.bindToElem(el);            var pos = pte.find(searchTarget);      expect(pos).toBe(-1);            var sel = pte.getSelection()      expect(sel).toBe(emptyString);   });      it("while found selects content and returns startPos", function() {            var el = $("#" + _id).get(0);      pte.bindToElem(el);            var emptyString = "";      var searchTarget = "tres";            var pos = pte.find(searchTarget);      expect(pos).toBe(8);                  var sel = pte.getSelection();                  expect(sel).toBe(searchTarget);   });});