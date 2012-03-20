/**
* Executes code after document is fully loaded
*/
$(document).ready(function() {
      
   plainTextEditor.init();
   plainTextEditor.bindToElem($(".page").get(0));
   
   /**
   * API functions of PlainTextEditor 
   * are binded below
   */
   $("#getTextBtn").click(function() {
     alert(
      plainTextEditor.getText()
     );
   });
   
   $("#setTextBtn").click(function() {
      var txt = prompt("Pleas type a content to put into element below");
      plainTextEditor.setText(txt);
   });      
   
   $("#getSelectionBtn").click(function() {
      alert(
         plainTextEditor.getSelection()
      );
   });

   $("#setSelectionBtn").click(function() {
      var startIndex = prompt("Pleas type a Start index for a new selection");
      var endIndex = prompt("Pleas type an End index for a new selection");
      plainTextEditor.setSelection(startIndex, endIndex);
   });   
   
   $("#undoBtn").click(function() {
         plainTextEditor.undo();
   });
   
   $("#redoBtn").click(function() {
         plainTextEditor.redo();
   });
});