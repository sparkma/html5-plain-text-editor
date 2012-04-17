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
   it("when no actions nothing is changed by undo/redo", function() {
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var txt = pte.undo();
      
      var txt = pte.getText();
      
      expect(txt).toBe(_content);
      expect(txt).not.toBe(_emptyString);
   });
   
});
