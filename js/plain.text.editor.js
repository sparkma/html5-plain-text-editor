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
      /**
      * content of clipboard
      */
      this._clipboard = "";
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
      this.focusEl();
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
     if(startPos > endPos
         || startPos < 0
         || endPos > this.getText().length) {
      return null;
     }    
     
     var r = document.createRange();
     
     
     var startNode = this._el.firstChild;
     var endNode = this._el.firstChild;

     /**
     * Checking type of node
     */
     var TEXT_NODE = 3;
     if(startNode.nodeType != TEXT_NODE
         || endNode.nodeType != TEXT_NODE) {     
        /**
        * in case it isn't a text find 
        * text node from element
        */
        var childNodes = this._el.childNodes;
        var positionCounter = 0;
        for(var index in childNodes) {
         
         var currentNode = childNodes[index];
         if(currentNode.nodeType == TEXT_NODE) {
            /**
            * set correct text node
            */
               startNode = currentNode;
               endNode = currentNode;
            
         }      
        }
     }
     
     
     r.setStart(startNode, startPos);
     r.setEnd(endNode, endPos);
     
     this.clearSelection();
     
     var selection = window.getSelection();
     selection.addRange(r);
     
     this.focusEl();
   },
   
   clearSelection: function() {
     var selection = window.getSelection();
     if(selection.rangeCount > 0) {
      selection.removeAllRanges();
     }
   },
   
   getCursorPos: function() {
      this.focusEl();
      var range = window.getSelection().getRangeAt(0);
      return range.endOffset;
   },

   setCursorPos: function(position) {
      this.setSelection(position, position);
      this.focusEl();
   },
   
   /**
   *
   * There are two strategies to implement
   * this function: 
   *
   *   - first is to insert a new text 
   *     node into current element, but it will
   *     produce not an unpleasent result
   *     while one element holds two or more Text node
   *     that is inconvenient to use
   *
   *   - second (shown below) is simply manipulates
   *     text content through default String functions,
   *     this approach allows to keep number of 
   *     elements Text nodes to only one.
   *
   */
   insertBeforeCursor: function(txt) {
      /**
      * find current cursor position,
      * collapsing the selection if such appears
      */
      var range = window.getSelection().getRangeAt(0);      
      range.collapse(false);
      var position = range.startOffset;
      
      var elVal = this._elQ.text();
      var newContent = elVal.slice(0, position) 
                        + txt 
                        + elVal.slice(position);

      this._elQ.text(newContent);

      /**
      * setting new cursor position
      */
      var newPos = position + txt.length;
      this.setCursorPos(newPos);
   },

   undo: function(position) {
      document.execCommand("undo", false, null);
      this.focusEl();
   },

   redo: function(position) {
      document.execCommand("Redo", false, null);
      this.focusEl();
   },
   
   focusEl: function() {
      this._elQ.focus();
   },
   
   /**
   * Copies to temporary clipboard
   * the content of selection
   */
   copy: function() {
      this._clipboard = this.getSelection();
   },
   
   cut: function() {
      this.copy();
      this.focusEl();
      window.getSelection().getRangeAt(0).deleteContents();
   },
   
   paste: function() {
      this.insertBeforeCursor(this._clipboard);
   }
};