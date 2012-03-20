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
window.plainTextEditor = {
   
   /**
   */
   init: function() {
      this.attachDocumentHdlrs();
   },
   
   /**
   * Attaches an editor to 
   * particular HTML element
   */
   bindToElem: function(elem) {
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
   },
   
   /**
   * Attaches general document handlers
   */
   attachDocumentHdlrs : function() {
      $(document).keypress(function(ev) {
         /**
         * 13 is a key code for 'enter'
         */
         if(13 == ev.which) {
            ev.preventDefault();
            
         }
      });
   },

   /**
   * Returns full text inside current 
   * element without HTML formatting
   */
   getText: function() {
      return this._elQ.text();
   }, 

   setText: function(formattedTxt) {
      this._elQ.html(formattedTxt);
   }, 

   getSelection: function() {
      var userSelection = null;
      if (window.getSelection) {
         userSelection = window.getSelection();
      }
      else if (document.selection) { // should come last; Opera!
         userSelection = document.selection.createRange();
      }
      return userSelection.toString();
   },

   setSelection: function(startPos, endPos) {
     var r = document.createRange();
     r.setStart(this._el.firstChild, startPos);
     r.setEnd(this._el.firstChild, endPos);
     
     var selection = window.getSelection();
     if(selection.rangeCount > 0) {
      selection.removeAllRanges();
     }
     
     selection.addRange(r);

   },

   getCursorPos: function() {
      alert("under construction"); 
   },

   setCursorPos: function(position) {
      alert("under construction"); 
   },

   undo: function(position) {
      document.execCommand("undo", false, null);
   },

   redo: function(position) {
      document.execCommand("Redo", false, null);
   }
};