describe('draft-undo-redo-spec', function(){
   /**
    * Shortcut to PlainTextEditor obj
    */
   var pte = window.plainTextEditor;

   /**
    * Properties for a target div
    */
   var _content = "c'est \n tres belle";
   var _id = "test-target-el";
   var _emptyString = "";

   /**
    * Adds a new div that is a target for
    * PlainText editor before each test
    */
   beforeEach(function() {
      $("body")
         .first()
         .append("<div id=\""
         + _id
         + "\">"
         + _content
         + "</div>");

      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
   });

   /**
    * Removes newly added div after each test
    */
   afterEach(function() {
      $("#" + _id ).remove();
   });

   /**
    * Motivation: to 'undo' any command editor.hitory.js should call command which do opposite action.
    * Here
    *
    * Tests are listed below:
    */
   it("changes cursor position and returns back", function() {
      var oldPos = pte.getCursorPos();
      var newPos = 5;

      pte.setCursorPos(newPos);
      var cursorPos = pte.getCursorPos();
      expect(cursorPos).toBe(newPos);

      //TODO: replace with 'undo' command
      //'undo' will do this:
      pte.setCursorPos(oldPos);

      cursorPos = pte.getCursorPos();
      expect(cursorPos).toBe(oldPos);
   });

   it("cut removes text being selected and posts back", function() {
      var cut = "c' \n tres belle";
      var originalContent = pte.getText();

      //precondition
      pte.setSelection(2, 5);

      pte.cut();
      var content = pte.getText();
      expect(content).toBe(cut);

      //TODO: replace with 'undo' command
      //'undo' will do this:
      pte.setCursorPos(2);
      pte.insertBeforeCursor("est");

      content = pte.getText();
      expect(content).toBe(originalContent);
   });

   it("paste inserts text extracted by cut and roll back", function() {
      var changed = "c' \n esttres belle";
      var originalContent = pte.getText();

      //precondition
      pte.setSelection(2, 5);

      pte.cut();
      pte.setCursorPos(5);
      pte.paste();

      var content = pte.getText();
      expect(content).toBe(changed);

      //TODO: replace with 'undo' command
      //'undo' will do this:
      //undo pasting
      pte.setSelection(5, 5 + (5 - 2));
      pte.cut();

      //undo setting cursor position
      pte.setCursorPos(2);

      //undo cutting
      pte.paste();

      content = pte.getText();
      expect(content).toBe(originalContent);
   });

   it("paste inserts text extracted by copy and roll back", function() {
      var changed = "c'estest \n tres belle";
      var originalContent = pte.getText();

      //precondition
      pte.setSelection(2, 5);

      pte.copy();
      pte.setCursorPos(5);
      pte.paste();

      var content = pte.getText();
      expect(content).toBe(changed);

      //TODO: replace with 'undo' command
      //'undo' will do this:
      //undo pasting
      pte.setSelection(5, 5 + (5 - 2));
      pte.cut();

      //undo setting cursor position
      pte.setSelection(2, 5);

      //undo copying
      //TODO: clear clipboard

      content = pte.getText();
      expect(content).toBe(originalContent);
   });

   it("while found selects content and rool it back", function() {
      var searchTarget = "tres";
      var positionOfTarget = 8;
      var originalContent = pte.getText();
      var originalCursorPos = pte.getCursorPos();

      var pos = pte.find(searchTarget);
      var sel = pte.getSelection();
      expect(pos).toBe(positionOfTarget);
      expect(sel).toBe(searchTarget);

      //TODO: replace with 'undo' command
      //'undo' will do this:
      //move cursor to prev position
      pte.setCursorPos(originalCursorPos);

      pos = pte.getCursorPos();
      sel = pte.getSelection();
      expect(pos).toBe(originalCursorPos);
      expect(sel).toBe("");
   });



});
