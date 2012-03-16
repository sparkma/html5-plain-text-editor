/**
*
* HTML5 Plain Text Editor
*
* @author Serj Ryabokon
* @date March 15, 2012
*/

/**
* Constructs PlainTextEditor object
* being binded to particular element
* set as an argument
*/
var plainTextEditor = function(elem) {
   /**
   * Holds DOM elem
   */
   this._el = elem;
   /**
   * jQuery wrapper for a DOM element
   */
   this._elQ = $(elem);
   /**
   * Turns an element to editable state
   */
   this._elQ.attr("contenteditable", "true");
}

/**
* Returns full text inside current 
* element without HTML formatting
*/
plainTextEditor.prototype.getText = function() {
   return this._elQ.text();
}; 

plainTextEditor.prototype.setText = function(formattedTxt) {
   this._elQ.html(formattedTxt);
}; 

plainTextEditor.prototype.getSelection = function() {
   var userSelection = null;
   if (window.getSelection) {
      userSelection = window.getSelection();
   }
   else if (document.selection) { // should come last; Opera!
      userSelection = document.selection.createRange();
   }
   return userSelection.toString();
};

plainTextEditor.prototype.setSelection = function(startPos, endPos) {
  var r = document.createRange();
  r.setStart(this._el.firstChild, startPos);
  r.setEnd(this._el.firstChild, endPos);
  
  var selection = window.getSelection();
  if(selection.rangeCount > 0) {
   selection.removeAllRanges();
  }
  
  selection.addRange(r);

};

plainTextEditor.prototype.getCursorPos = function() {
   alert("under construction"); 
};

plainTextEditor.prototype.setCursorPos = function(position) {
   alert("under construction"); 
};

plainTextEditor.prototype.undo = function(position) {
   document.execCommand("undo", false, null);
};

plainTextEditor.prototype.redo = function(position) {
   document.execCommand("Redo", false, null);
};