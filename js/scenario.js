/**
* Executes code after document is fully loaded
*/
$(document).ready(function() {
   var ptEditor = window.plainTextEditor;
         
   ptEditor.bindToElem($(".page").get(0));
   ptEditor.focusEl();
   
   /**
   * API functions of ptEditor 
   * are binded below
   */
   $("#getTextBtn").click(function() {
     alert(
      ptEditor.getText()
     );
     ptEditor.focusEl();
   });
   
   $("#setTextBtn").click(function() {
      var txt = prompt("Please type a content to put into element below");
      ptEditor.setText(txt);
   });      
   
   $("#getSelectionBtn").click(function() {
      alert(
         ptEditor.getSelection()
      );
      ptEditor.focusEl();
   });

   $("#setSelectionBtn").click(function() {
      var startIndex = prompt("Please type a Start index for a new selection");
      var endIndex = prompt("Please type an End index for a new selection");
      ptEditor.setSelection(startIndex, endIndex);
      
   });
   
   $("#getCursorPos").click(function() {
      alert(
         ptEditor.getCursorPos()
      );
      ptEditor.focusEl(); 
   });   
    
   $("#setCursorPos").click(function() {
      var cursorPos = prompt("Please type a cursor position");
      ptEditor.setCursorPos( cursorPos );
   });   
   
   $("#undoBtn").click(function() {
         ptEditor.undo();
   });
   
   $("#redoBtn").click(function() {
         ptEditor.redo();
   });
   
   $("#cutBtn").click(function() {
         ptEditor.cut();
         ptEditor.focusEl();
   });  
   
   $("#copyBtn").click(function() {
         ptEditor.copy();
         ptEditor.focusEl();
   });
   
   $("#pasteBtn").click(function() {
         ptEditor.paste();
         ptEditor.focusEl();
   });
   
   $("#scrollToCursorBtn").click(function() {
         ptEditor.scroll();
         ptEditor.focusEl();
   });  
   
   $("#scrollCenterBtn").click(function() {
         ptEditor.scrollCenter();
         ptEditor.focusEl();
   }); 

   $("#findBtn").click(function() {
         var t = prompt("Please, type text to search in the content");         
         ptEditor.find(t);
   });
   
   $("#findNextBtn").click(function() {
         ptEditor.findNext();
   }); 
  
   $("#findPrevBtn").click(function() {
         ptEditor.findPrev();
   }); 
  
   $("#replaceBtn").click(function() {
         var oldTxt = prompt("Please, type target text to found for replacement");
         var newTxt = prompt("Please, type text to substitue");
         ptEditor.replace(oldTxt, newTxt);
   });
  
   $("#replaceAllBtn").click(function() {
         var oldTxt = prompt("Please, type target text to found for replacement");
         var newTxt = prompt("Please, type text to substitue");
         ptEditor.replaceAll(oldTxt, newTxt);
   });
   
   $("#repalceInSelBtn").click(function() {
         var oldTxt = prompt("Please, type target text to found for replacement");
         var newTxt = prompt("Please, type text to substitue");
         ptEditor.replaceInSel(oldTxt, newTxt);
   });

   $("#alignLeftBtn").click(function() {
      ptEditor.alignLeft();
   });
   
   $("#alignRightBtn").click(function() {
      ptEditor.alignRight();
   });   
   
});
