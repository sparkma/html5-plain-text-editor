describe('cursor-spec', function(){
   /**
   * Shortcut to PlainTextEditor obj
   */
   var pte = window.plainTextEditor;
  
  /**
   * Properties for a target div
   */
   var _content = "c'est \n tres belle";
   var _id = "test-target-el";
   
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
   it("def cursor position should be zero", function() {
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var pos = pte.getCursorPos();
      expect(pos).toBe(0);
      

   });
   
   it("changes cursor position", function() {
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var oldPos = pte.getCursorPos();
      var newPos = 5;
      
      pte.setCursorPos(newPos);
      var cursorPos = pte.getCursorPos();
      
      expect(cursorPos).toBe(newPos);
      expect(cursorPos).not.toBe(oldPos);
      
   });
   
   it("check cursor for out of bound", function() {
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      
      var defPos = pte.getCursorPos();
      pte.setCursorPos(-1);
      var pos = pte.getCursorPos();

      expect(pos).toBe(defPos);
      
      pte.setCursorPos(9999);
      var pos = pte.getCursorPos();

      expect(pos).toBe(defPos);
   });
   
});
