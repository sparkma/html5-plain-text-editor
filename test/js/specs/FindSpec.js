describe('find-spec', function(){   /**   * Shortcut to PlainTextEditor obj   */   var pte = window.plainTextEditor;    /**   * Properties for a target div   */   var _content = "c'est \n tres belle";   var _id = "test-target-el";      /**   * Adds a new div that is a target for   * PlainText editor before each test   */   beforeEach(function() {            $("body")            .first()            .append("<div id=\""                      + _id                      + "\">"                      + _content                      + "</div>");   });      /**   * Removes newly added div after each test   */   afterEach(function() {      $("#" + _id ).remove();   });      /**   * Tests are listed below:   */   it("find without params returns -1 val", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var pos = pte.find();            expect(pos).toBe(defaultNonFoundPos);      var sel = pte.getSelection();      expect(sel).toBe(emptyString);   });      it("while not found result is -1", function() {      var emptyString = "";      var searchTarget = "obviously no such string";            var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var pos = pte.find(searchTarget);      expect(pos).toBe(defaultNonFoundPos);            var sel = pte.getSelection()      expect(sel).toBe(emptyString);         });      it("while found selects content and returns startPos", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var emptyString = "";      var searchTarget = "tres";      var positionOfTarget = 8;            var pos = pte.find(searchTarget);      expect(pos).toBe(positionOfTarget);                  var sel = pte.getSelection();      expect(sel).toBe(searchTarget);      expect(sel).not.toBe(emptyString);   });      it("search is case sensitive", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "Tres";            var pos = pte.find(searchTarget);      expect(pos).toBe(defaultNonFoundPos);            var sel = pte.getSelection();      expect(sel).not.toBe(searchTarget);      expect(sel).toBe(emptyString);   });      it("find next returns next occurance of target", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "es";      var positionOfTarget = 2;      var nextPositionOfTarget = 10;            var pos = pte.find(searchTarget);            expect(pos).toBe(positionOfTarget);            var pos = pte.findNext();      var sel = pte.getSelection()      expect(pos).toBe(nextPositionOfTarget);      expect(sel).toBe(searchTarget);   });         it("find prev returns prev occurance of target", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "es";      var firstTargetPosition = 2;                  pte.find(searchTarget);      pte.findNext();      var pos = pte.findPrev();      var sel = pte.getSelection()            expect(pos).toBe(firstTargetPosition);      expect(pos).not.toBe(defaultNonFoundPos);      expect(sel).toBe(searchTarget);         });     it("mulltiple calls to find prev keeps selection unchanged and returns -1", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "es";            pte.find(searchTarget);      pte.findNext();      pte.findPrev();      pte.findPrev();      pte.findPrev();      pte.findPrev();      var pos = pte.findPrev();      var sel = pte.getSelection();            expect(pos).toBe(defaultNonFoundPos);      expect(sel).toBe(searchTarget);         });      it("find prev after mulltiple calls to find next selects previous to last occurance", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "es";      var firstTargetPosition = 2;            pte.find(searchTarget);      pte.findNext();      pte.findNext();      pte.findNext();      pte.findNext();      pte.findNext();         var pos = pte.findPrev();      var sel = pte.getSelection();            expect(pos).toBe(firstTargetPosition);      expect(sel).toBe(searchTarget);         });    it("find next after mulltiple calls to find prev selects next to the first one occurance", function() {      var el = $("#" + _id).get(0);      pte.bindToElem(el);            var defaultNonFoundPos = -1;      var emptyString = "";      var searchTarget = "es";      var secondTargetPosition = 10;            pte.find(searchTarget);      pte.findPrev();      pte.findPrev();      pte.findPrev();      pte.findPrev();      var pos = pte.findNext();      var sel = pte.getSelection();            expect(pos).toBe(secondTargetPosition);      expect(sel).toBe(searchTarget);         });       });