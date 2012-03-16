/**
* Executes code after document is fully loaded
*/
$(document).ready(function() {
   
   /**
   * General pointer to the current PlainTextEditor
   * initialized with particular HTML element
   */
   var contentEditor = null;
   
   /**
   * Provides an initialization 
   * of content editor for paragraph 
   * or heading
   */
   $("p,h1,h2").mousedown(function(ev) {
      contentEditor = new plainTextEditor(ev.target);
   });
   
   /**
   * API functions of PlainTextEditor 
   * are binded below
   */
   $("#getTextBtn").click(function() {
     alert(
      contentEditor.getText()
     );
   });
   
   $("#setTextBtn").click(function() {
      var txt = prompt("Pleas type a content to put into element below");
      contentEditor.setText(txt);
   });      
   
   $("#getSelectionBtn").click(function() {
      alert(
         contentEditor.getSelection()
      );
   });   
   
   $("#undoBtn").click(function() {
         contentEditor.undo();
   });
   
   $("#redoBtn").click(function() {
         contentEditor.redo();
   });
});