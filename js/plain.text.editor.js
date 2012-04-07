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
   * initializes PlainTextEditor
   */
   init: function() {
      this.attachDocumentHdlrs();
      window.plainTextEditorInitialized = true;
   },
   
   /**
   * Attaches an editor to 
   * particular HTML element
   * passed as an argument.
   * Pay attention that an argument
   * should be DOM element (not a jQuery wrapper on it)
   */
   bindToElem: function(elem) {
      /**
      * Checks whether PlainTextEditor is initialized
      * in case it doesn't triggers the initialization
      */
      if(!window.hasOwnProperty('plainTextEditorInitialized')) {
         this.init();
      }
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
      /**
      * Holds lexema to search
      */      
      this._findTxt = "";
      /**
      * An offset for findNext, findPrev operations
      */
      this._findNext = 0;      
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
            plainTextEditor.insertBeforeCursor("\n");
         }         
      });
   },

   /**
   * Returns full text inside current 
   * element without HTML formatting
   */
   getText: function() {
      var cn = this._el.childNodes;
      var TEXT_NODE = 3;
      var content = "";
      for( var i in cn ) {
         var current = cn[i];
         if( current.nodeType == TEXT_NODE ) {
            content += current.nodeValue;
         }
      }
      
      return content;
   }, 

   /**
   * Substitutes the content of active element
   * with a new one passed as an argument
   */
   setText: function(formattedTxt) {
      this._elQ.html(formattedTxt);
      this.focusEl();
   }, 

   /**
   * Retrieves the content of current selection
   */
   getSelection: function() {
      var userSelection = window.getSelection();
      
      var docFrag = userSelection.getRangeAt(0).cloneContents();
      if( null == docFrag ) {
         return "";
      }
      var cn = docFrag.childNodes;
      var TEXT_NODE = 3;
      var content = "";
      for( var i in cn ) {
         var current = cn[i];
         if( current.nodeType == TEXT_NODE ) {
            content += current.nodeValue;
         }
      }
      
      return content;
   },

   /**
   * Selects a range in a text of active element
   */
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
   
   /**
   * Removes the selection
   */
   clearSelection: function() {
     var selection = window.getSelection();
     if(selection.rangeCount > 0) {
      selection.removeAllRanges();
     }
   },
   
   /**
   * Gives a position of cursor starting from zero
   */
   getCursorPos: function() {
      this.focusEl();
      var range = window.getSelection().getRangeAt(0);
      return range.endOffset;
   },

   /**
   * Set cursor to position, position is calculated from zero
   */
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

   /**
   * Undo last action. Currently is under construction
   */
   undo: function(position) {
      document.execCommand("undo", false, null);
      this.focusEl();
   },

   /**
   * Undo the undo. Currently is under construction.
   */
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
   
   /**
   * Cuts the selected area into clipboard
   */
   cut: function() {
      this.copy();
      this.focusEl();
      window.getSelection().getRangeAt(0).deleteContents();
   },
   
   /**
   * Inserts the content of clipboard to current
   * cursor position
   */
   paste: function() {
      this.insertBeforeCursor(this._clipboard);
   },
   
   /**
   * Selects first occurence of a string provided as a
   * an argument 
   */
   find: function(txt) {
      this.focusEl();
      
      this._findTxt = txt;
      var content = this.getText();
      var startPos = content.indexOf(txt);
      
      this.setSelection(startPos, startPos+txt.length);
      if(startPos > -1) {
         this._findNext = startPos + txt.length;
      }
   },
   
   /**
   * Selects the next occurance of a string
   * provided as an argument to function 'find'
   */
   findNext: function() {
      if(this._findNext < 0) {
         this._findNext = 0;
      }
      
      this.focusEl();
      
      var txt = this._findTxt;
      var content = this.getText();
      
      var startPos = content.indexOf(txt, this._findNext);
      
      this.setSelection(startPos, startPos+txt.length);
      if(startPos > -1) {
         this._findNext = startPos + txt.length;
      }
   },
   
   /**
   * Selects previous occurance of a string
   * (previous to the one selected by 'findNext' function) 
   * provided as an argument to function 'find'
   */
   findPrev: function() {
      this.focusEl();
      
      var txt = this._findTxt;
      var content = this.getText();
      
      var startPos = content.lastIndexOf(txt, (this._findNext - txt.length -1));
      
      this.setSelection(startPos, startPos+txt.length);
      if(startPos > -1) {
         this._findNext = startPos + txt.length;
      }
   },
   
   /**
   * Scrolls browser viewport to cursor/selection
   * that is shown at a top of a viewport
   */
   scroll: function() {
      this.scrollToSelection(0);
   },
   
   /**
   * Scrolls browser viewport to cursor/selection
   * that is shown in a center of a viewport
   */
   scrollCenter: function() {
      var centerPx = -1 * parseInt($(window).height() / 2);
      this.scrollToSelection(centerPx);
   },
   
   /**
   * Scrolls browser viewport to cursor/selection 
   * plus specific offset in pixels given as an argument
   */
   scrollToSelection: function(offsetPx) {
      var id = "tmp_span_element_to_delete";
      var tmpEl = document.createElement("span");
      tmpEl.id = id;
      var range = window.getSelection().getRangeAt(0);

      var startOffset = range.startOffset;
      var endOffset = range.endOffset;
      
      range.insertNode( tmpEl );
      
      $('html, body').animate({
         scrollTop: $(tmpEl).offset().top + offsetPx
         }, 500);
      
      var parentEl = range.startContainer;
      var childNodes = parentEl.childNodes
      for( var i in childNodes ) {
         var c = childNodes[i];
         if(c.id == id) {
            parentEl.removeChild(c);
            break;
         }
      }
      
      var t = this._elQ.text();
      this._elQ.text(t);
      this.setSelection(startOffset, endOffset);   
   },
   
   /**
   * Substitutes first occurance of a string in a 
   * content of an active element to new value
   */
   replace: function(oldtxt, newtxt) {
      var cp = this.getCursorPos();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt);
      var content = this.getText();
      var newContent = content.replace(regex, newtxt);
      this.setText(newContent);
      
      this.setCursorPos(cp);
   },
   
   /**
   * Substitutes all occurances of a string in a 
   * content of an active element to new value
   */
   replaceAll: function(oldtxt, newtxt) {
      var cp = this.getCursorPos();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt, "gi");
      var content = this.getText();
      var newContent = content.replace(regex, newtxt);
      this.setText(newContent);
      
      this.setCursorPos(cp);   
   },
   
   /**
   * Replaces all occurances of a string in a 
   * content of selection 
   */
   replaceInSel: function(oldtxt, newtxt) {
      var cp = this.getCursorPos();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt, "gi");
      var content = this.getSelection();
      cp -= content.length;
      var newContent = content.replace(regex, newtxt);
      
      window.getSelection().getRangeAt(0).deleteContents();
      
      this.insertBeforeCursor(newContent);
      
      this.setSelection(cp, cp + newContent.length);  
   }
   
};