describe('replace-spec', function(){   /**   * Shortcut to PlainTextEditor obj   */   var pte = window.plainTextEditor;    /**   * Properties for a target div   */   var _content = "c'est \n tres belle";   var _id = "test-target-el";      /**   * Adds a new div that is a target for   * PlainText editor before each test   */   beforeEach(function() {            $("body")            .first()            .append("<div id=\""                      + _id                      + "\">"                      + _content                      + "</div>");   });      /**   * Removes newly added div after each test   */   afterEach(function() {      $("#" + _id ).remove();   });      /**   * Tests are listed below:   */   it("replace first occurance with new value", function() {      var changed = "c'est \n peu belle";      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.replace("tres", "peu");      var content = pte.getText();            expect(content).toBe(changed);      expect(content).not.toBe(emptyString);   });      it("replaces all occurances with new value", function() {      var changed = "c'yest \n tryes belle";      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.replaceAll("es", "yes");      var content = pte.getText();                  expect(content).toBe(changed);      expect(content).not.toBe(emptyString);         });      it("replaces all occurances in selection", function() {      var changed = "c'yest \n tryes belle";      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.setSelection(2, 18);      pte.replaceInSel("es", "yes");      var content = pte.getText();                  expect(content).toBe(changed);      expect(content).not.toBe(emptyString);   });      it("replaces occurance in selection if there is one present", function() {      var changed = "c'yest \n tres belle";      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.setSelection(2, 8);      pte.replaceInSel("es", "yes");      var content = pte.getText();                  expect(content).toBe(changed);      expect(content).not.toBe(emptyString);   });      it("replaces nothing in selection if there is no selection", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.replaceInSel("es", "yes");      var content = pte.getText();                  expect(content).toBe(_content);      expect(content).not.toBe(emptyString);   });      it("replaces nothing in selection if there match is not found", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.setSelection(4,7);      pte.replaceInSel("es", "yes");      var content = pte.getText();                  expect(content).toBe(_content);      expect(content).not.toBe(emptyString);   });   it("replace first occurance is case sensitive", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.replace("Es", "yes");      var content = pte.getText();                  expect(content).toBe(_content);      expect(content).not.toBe(emptyString);   });         it("replace all occurances is case sensitive", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.replaceAll("Es", "yes");      var content = pte.getText();                  expect(content).toBe(_content);      expect(content).not.toBe(emptyString);   });         it("replace occurances in selection is case sensitive", function() {      var emptyString = "";      var el = $("#" + _id).get(0);      pte.bindToElem(el);            pte.setSelection(2, 18);      pte.replaceInSel("Es", "yes");      var content = pte.getText();                  expect(content).toBe(_content);      expect(content).not.toBe(emptyString);   });   });