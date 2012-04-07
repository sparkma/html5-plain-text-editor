describe('selection-spec', function(){
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
   it("by default no selection is being shown", function() {
      var emptyString = "";
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      var selContent = pte.getSelection();
      expect(selContent).toBe(emptyString);
      expect(selContent).not.toBe(_content);
   });
   
   it("selects first word from the content", function() {
      var firstWordInContent = "c'est";
      var emptyStr = "";
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      /**
      * selection first word of the content
      */
      pte.setSelection( 0,
                        firstWordInContent.length );
      selTxt = pte.getSelection();
      expect(selTxt).toBe(firstWordInContent);
      expect(selTxt).not.toBe(emptyStr);
   });
   
   it("selects text from the middle of the content", function() {
      
      var partStr = "es";
      var emptyStr = "";
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      /**
      * selection string in the middle of the content
      */
      pte.setSelection(10, 12);
      var selTxt = pte.getSelection();
      expect(selTxt).toBe(partStr);
      expect(selTxt).not.toBe(emptyStr);
      
   });
   
   it("selects last word from the content", function() {
      var emptyStr = "";
      var lastWordInContent = "belle";      
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      
      /**
      * selection last word of the content
      */
      pte.setSelection( _content.length - lastWordInContent.length,
                        _content.length );
      selTxt = pte.getSelection();
      expect(selTxt).toBe(lastWordInContent);
      expect(selTxt).not.toBe(emptyStr);
   });
   
   
   it("selects last word from the content", function() {
      var emptyStr = "";
      var lastWordInContent = "belle";      
      
      var el = $("#" + _id).get(0);
      pte.bindToElem(el);
      
      
      /**
      * selection last word of the content
      */
      pte.setSelection( _content.length - lastWordInContent.length,
                        _content.length );
      selTxt = pte.getSelection();
      expect(selTxt).toBe(lastWordInContent);
      expect(selTxt).not.toBe(emptyStr);
   });
});