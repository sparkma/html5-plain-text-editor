describe('undo-redo-spec', function(){
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
   });
   
   /**
   * Removes newly added div after each test
   */
   afterEach(function() {
      $("#" + _id ).remove();
   });
   
   /**
   * Tests are listed below:
   */
   it("when no actions nothing is changed by undo", function() {
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var txt = pte.undo();
      
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });

   it("when no actions nothing is changed by redo", function() {
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var txt = pte.redo();
      
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });
   
   it("undo-redo for first symbol being typed", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      var akey = 65;
      var keyDownEv = $.Event('keydown', { keyCode: akey, which: akey, charCode: akey }) ;
      var keyPressEv = $.Event('keypress', { keyCode: akey, which: akey, charCode: akey }) ;
      
      /**
      * Event occurs for PlainTextEditor, 
      * but internally no character is typed
      * into an element, so it's content
      * remains the same
      */
      $(document).trigger( keyDownEv );
      $(document).trigger( keyPressEv );
      
      
      
      var txt = pte.undo();
      var txt = pte.redo();
      var changedContent = "A'est \n tres belle";
      
      var txt = pte.getText();
      
      expect(txt).toBe(changedContent);
      expect(txt).not.toBe(_emptyString);
   });
   
   it("undo for replace", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.replace("s'", "c'");
      
      var txt = pte.undo();
      
      var changedContent = "s'est \n tres belle";
      
      var txt = pte.getText();
      
      expect(txt).toBe(changedContent);
      expect(txt).not.toBe(_emptyString);
   });

   it("redo for replace", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.replace("s'", "c'");
      
      
      pte.undo();
      pte.redo();
            
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });

   it("undo for replaceAll", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.replaceAll("es", "ui");
      
      pte.undo();
      
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });
   
   it("undo for replaceInSel", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.setSelection(0, 5);
      pte.replaceInSel("es", "NEW");      
      pte.undo();
      
            
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });     
   
   it("redo for replaceInSel", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.setSelection(0, 5);
      pte.replaceInSel("es", "NEW");      
      pte.undo();
      pte.redo();
            
      var txt = pte.getText();
      var newContent = "c'NEWt \n tres belle";;
      expect(txt).toBe(newContent);
      expect(txt).not.toBe(_emptyString);
   });
   
   it("undo for cut", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.replace("s'", "c'");
      
      
      pte.setSelection(0, 3);
      pte.cut();
      pte.undo();
      
      
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });
 
   it("redo for cut", function() {
      var el = $("#" + _id).get(0);
      
      pte.bindToElem(el);
      
      pte.replace("s'", "c'");
      
      
      pte.setSelection(0, 3);
      pte.cut();
      pte.undo();
      pte.redo();
      
      
      var txt = pte.getText();
      var editedContent = "st \n tres belle";
      
      expect(txt).toBe(editedContent);
      expect(txt).not.toBe(_emptyString);
   });
      
});
