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

      this.initDebugger();
      this.log.group("window.plainTextEditor: init:");
      this.attachDocumentHdlrs();

      window.plainTextEditorInitialized = true;
      this.log.groupEnd();
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
      this.log.group("window.plainTextEditor: bindToElem:");

      /**
      * DOM element
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

      /**
      * History tracking object with undo/redo operations
      */
      this._editorHistory = editorHistory.init(this);
            
      this.setCursorPos(0);
      this.log.groupEnd();
   },
   
   attachDocumentHdlrs: function() {
      this.log.group("window.plainTextEditor: attachDocumentHdlrs:");

      $(document).keypress(function(ev) {
         plainTextEditor.log.group("window.plainTextEditor: keypress:", ev);
         if(ev.ctrlKey && plainTextEditor._elQ && plainTextEditor._elQ.is(":focus")) {
            ev.preventDefault();
            plainTextEditor.log.groupEnd();
            return;
         }
         
         if( plainTextEditor._elQ
            && plainTextEditor._elQ.is(":focus")
            && plainTextEditor.getSelection().length > 0
            && 0 != ev.which
            && 5 != ev.which
            && String.fromCharCode(ev.keyCode).length > 0 ) {

            var sel = plainTextEditor.getSelection();
            var newCont = String.fromCharCode(ev.which);
            var pos = plainTextEditor.getCursorPos();
            plainTextEditor.log.debug("window.plainTextEditor: keypress: call trackOverwriteSelection(%s %s %s)", sel, newCont, pos);
            plainTextEditor._editorHistory.trackOverwriteSelection(sel, newCont, pos);
         }

         plainTextEditor.log.groupEnd();
      });
      
      $(document).keydown(function(ev) {
         plainTextEditor.log.group("window.plainTextEditor: keydown:", ev);
         if(!plainTextEditor._elQ || !plainTextEditor._elQ.is(":focus")) {
            plainTextEditor.log.groupEnd();
            return;
         }
                  
         /**
          * 13 is a key code for 'enter'
          */
         var enterKeyCode = 13;
         if(enterKeyCode == ev.which) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: KeyCode==#13");
            ev.preventDefault();
            plainTextEditor.insertBeforeCursor("\n");
         }     

         /**
          * 8 is a key code for 'backspace'
          */
         var backspaceKeyCode = 8;
         if(backspaceKeyCode == ev.which) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: KeyCode==#8");
            ev.preventDefault();
            var historyTracking = true;
            plainTextEditor.removeBeforeCursor(historyTracking);
         }

         /**
         * is a key code for 'del'
         */
         var deleteKeyCode = 46;
         if(deleteKeyCode === ev.keyCode && !ev.shiftKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: KeyCode==#46");
            ev.preventDefault();
            var historyTracking = true;
            plainTextEditor.removeAfterCursor(historyTracking);
         }
         
         /**
          * shift + del
          */
         if(deleteKeyCode === ev.keyCode && ev.shiftKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Shift && KeyCode==#46");
            ev.preventDefault();
            plainTextEditor.cut();
         }         

         /**
          * ctrl + a
          */
         if("a" == String.fromCharCode(ev.which).toLowerCase() && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && A");
            ev.preventDefault();
            plainTextEditor.setSelection(0, plainTextEditor.getText().length);
         }
         
         /**
          * ctrl + y
          */
         if("y" == String.fromCharCode(ev.which).toLowerCase() && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && Y");
            ev.preventDefault();
            plainTextEditor.redo();
         }
         
         /**
          * ctrl + z
          */
         if("z" == String.fromCharCode(ev.which).toLowerCase()  && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && Z");
            ev.preventDefault();
            plainTextEditor.undo();
         }
                  
         /**
         * ctrl + c
         */
         if("c" == String.fromCharCode(ev.which).toLowerCase() && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && C");
            ev.preventDefault();
            plainTextEditor.copy();
         }
         
         /**
         * ctrl + v
         */
         if("v" == String.fromCharCode(ev.which).toLowerCase()  && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && V");
            ev.preventDefault();
            plainTextEditor.paste();
         }
         
         /**
          * ctrl + x
          */
         if("x" == String.fromCharCode(ev.which).toLowerCase()  && ev.ctrlKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ctrl && X");
            ev.preventDefault();
            plainTextEditor.cut();
         }
         
         /**
          * shift + ins
          */
         var insKeyCode = 45;
         if(insKeyCode === ev.keyCode && ev.shiftKey) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Shift && Ins");
            ev.preventDefault();
            plainTextEditor.paste();
         }         
         /**
          * ins, disabled
          */       
         if(insKeyCode === ev.keyCode) {
            plainTextEditor.log.debug("window.plainTextEditor: keydown: Ins");
            ev.preventDefault();
         }
         plainTextEditor.log.groupEnd();
      });
   },
   
   /**
   * Returns full text inside current 
   * element without HTML formatting
   */
   getText: function() {
      this.log.group("window.plainTextEditor: getText:");
      var cn = this._elQ.get(0).childNodes;
      var TEXT_NODE = 3;
      var content = "";
      for( var i in cn ) {
         var current = cn[i];
         if( current && current.nodeType == TEXT_NODE ) {
            content += current.nodeValue;
         }
      }
      this.log.debug("content: [%s]", content)
      this.log.groupEnd();
      return content;
   },

   /**
   * Substitutes the content of active element
   * with a new one passed as an argument
   */
   setText: function(formattedTxt) {
      this.log.group("window.plainTextEditor: setText:");
      this.log.debug("formattedTxt=%s", formattedTxt);
      var tn = document.createTextNode(formattedTxt);
      
      var node = this._el;
      while (node.hasChildNodes()) {
         node.removeChild(node.lastChild);
      }
      node.appendChild(tn); 
      //this._elQ.text(formattedTxt + "\n");
      this.focusEl();
      this.log.groupEnd();
   }, 
   
   /**
   * compatibility function for diff browsers
   */
   getSelectedRangeObj: function(selectionObject) {
      this.log.group("window.plainTextEditor: getSelectedRangeObj");
      var range = null;
      if (selectionObject.getRangeAt) {
         try {
            range = selectionObject.getRangeAt(0);
         }
         catch(e) {
            /**
            * For Safari: that is the way to handle
            * the situation while no selection occurs
            */
            range = null;
         }
      }
      this.log.groupEnd();
      return range;
   },
   
   /**
   * Retrieves the content of current selection
   */
   getSelection: function() {
      this.log.group("window.plainTextEditor: getSelection:");
      var userSelection = window.getSelection();
      if(userSelection == null) {
         this.log.groupEnd();
         return "";
      }
      var selectedRange = this.getSelectedRangeObj(userSelection);
      if(selectedRange == null) {
         this.log.groupEnd();
         return "";
      }
      
      var docFrag = selectedRange.cloneContents();
      if( null == docFrag ) {
         this.log.groupEnd();
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

      this.log.debug("content: [%s]", content);
      this.log.groupEnd();
      return content;
   },

   /**
   * Selects a range in a text of active element
   * range is selected starting from start pos 
   * (inculding startPos) and ending before
   * end pos (excluding endPos)
   */
   setSelection: function(startPos, endPos) {
      this.log.group("window.plainTextEditor: setSelection:");
      this.log.debug("startPos=%s, endPos=%s", startPos, endPos);
      this.focusEl();

      if(arguments.length < 2) {
         this.log.groupEnd();
         return null;
      }
     
      if(startPos > endPos
         || startPos < 0
         || endPos > this.getText().length ) {

         this.log.groupEnd();
         return null;
      }
     
      var  r = document.createRange();

      var startNode = this._elQ.get(0).firstChild;
      var endNode = this._elQ.get(0).firstChild;

      /**
      * Checking type of node
      */
      var TEXT_NODE = 3;

      if( startNode.nodeType != TEXT_NODE
         || startPos > startNode.nodeValue.length
         || endNode.nodeType != TEXT_NODE
         || endPos > endNode.nodeValue.length ) {
        
         endNode = null;
         startNode = null;
         /**
         * in case it isn't a text find
         * text node from element
         */
         var childNodes = this._elQ.get(0).childNodes;
         var positionCounter = 0;
         var tempContent = "";
         for(var index in childNodes) {
        
            var currentNode = childNodes[index];
            if(currentNode.nodeType == TEXT_NODE) {
               tempContent += currentNode.nodeValue;
               /**
               * set correct text node
               */
               if(startPos < tempContent.length && startNode === null) {
                  startNode = currentNode;
                  /**
                  * updating startPos
                  */
                  var offset = tempContent.length - currentNode.nodeValue.length;
                  startPos = startPos - offset;
               }
               if(endPos <= tempContent.length && endNode === null) {
                  endNode = currentNode;
                  /**
                  * updating endPos
                  */
                  var offset = tempContent.length - currentNode.nodeValue.length;
                  endPos = endPos - offset;
               }
            }
         }
      }
     
      if(endNode === null || startNode === null) {
         this.log.groupEnd();
         return;
      }
     
      r.setStart(startNode, startPos);
      r.setEnd(endNode, endPos);

      this.clearSelection();

      var selection = window.getSelection();

      selection.addRange(r);
      this.log.groupEnd();
   },
   
   /**
   * Removes the selection
   */
   clearSelection: function() {
      this.log.group("window.plainTextEditor: clearSelection:");
      var selection = window.getSelection();
      if(selection.rangeCount > 0) {
         selection.removeAllRanges();
      }
      this.log.groupEnd();
   },
   
   /**
   * Gives a position of cursor starting from zero
   */
   getCursorPos: function() {
      this.log.group("window.plainTextEditor: getCursorPos:");
      this.focusEl();
      var range = window.getSelection().getRangeAt(0);
      
      var container = range.endContainer.previousSibling;
      var cursorPos = range.endOffset;
      var TEXT_NODE = 3;
      
      while(container !== null) {
         if(container.nodeType == TEXT_NODE) {
            cursorPos += container.nodeValue.length;
         }
         container = container.previousSibling;
      }
      
      if(cursorPos >= this.getText().length) {
         var fixPos = this.getText().length;
         cursorPos = fixPos;
      }
      this.log.debug("cursorPos=%s", cursorPos);
      this.log.groupEnd();
      return cursorPos;
   },

   /**
   * Set cursor to position, position is calculated from zero
   */
   setCursorPos: function(position) {
      this.log.group("window.plainTextEditor: setCursorPos:");
      if(position > this.getText().length) {
         position = this.getText().length;
      }
      this.setSelection(position, position);
      this.log.groupEnd();
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
      this.log.group("window.plainTextEditor: insertBeforeCursor:");
      /**
      * find current cursor position,
      * collapsing the selection if such appears
      */
      var userSelection = window.getSelection();
      if(userSelection == null) {
         this.log.groupEnd();
         return "";
      }
      var range = this.getSelectedRangeObj(userSelection);
      if(range == null) {
         this.log.groupEnd();
         return "";
      }
      
      range.collapse(false);
      var position = this.getCursorPos();
      
      var elVal = this.getText();
      var newContent = elVal.slice(0, position) 
                        + txt 
                        + elVal.slice(position);

      this.setText(newContent);

      /**
      * setting new cursor position
      */
      var newPos = position + txt.length;
      this.setCursorPos(newPos);
      this.log.groupEnd();
   },
   
   /**
    * An analog of backspace button 
    * acting without selection
    */
   removeBeforeCursor: function(addToHistory) {
      this.log.group("window.plainTextEditor: removeBeforeCursor:");
      this.focusEl();
      
      if(this.getSelection().length > 0) {
         /**
          * adding to history
          */      
         if(arguments.length > 0 && addToHistory) {
            var sel = this.getSelection();
            var cp = this.getCursorPos();
            this._editorHistory.trackActionBackspace(sel, cp);
         }
         /**
          * actually removing
          */
         this.deleteSelected();
         this.log.groupEnd();
         return;
      }
      
      var cursorPos = this.getCursorPos();
      if(0 != cursorPos) {
         /**
         * setting the selection
         */
         this.setSelection(cursorPos-1,cursorPos);
         /**
          * adding to history
          */      
          if(arguments.length > 0 && addToHistory) {
             var sel = this.getSelection();
             var cp = this.getCursorPos();
             this._editorHistory.trackActionBackspace(sel, cp);
          }            
         /**
          * actually deleting
          */
         this.deleteSelected();
      }
      this.log.groupEnd();
   },

   /**
    * An analog of del button
    * acting without selection
    */
   removeAfterCursor: function(addToHistory) {
      this.log.group("window.plainTextEditor: removeAfterCursor:");
      this.focusEl();
      
      if(this.getSelection().length > 0) {
         /**
          * adding to history
          */      
         if(arguments.length > 0 && addToHistory) {
            var sel = this.getSelection();
            var cp = this.getCursorPos();
            this._editorHistory.trackActionDelete(sel, cp);
         }
         /**
         * removing
         */
         this.deleteSelected();
         this.log.groupEnd();
         return;
      }
      
      var selStartPos = this.getCursorPos();
      var maxPos = this.getText().length - 1; 
      var selEndPos = selStartPos + 1;
      if( selEndPos <= maxPos ) {
         /**
          * setting the selection
          */
         this.setSelection( selStartPos, selEndPos );
         /**
          * adding to history
          */      
         if(arguments.length > 0 && addToHistory) {
            var sel = this.getSelection();
            var cp = this.getCursorPos();
            this._editorHistory.trackActionDelete(sel, cp);
         }
         /**
          * actually deleting
          */
         this.deleteSelected();
      }
   },

   
   /**
   * Undo last action. Currently is under construction
   */
   undo: function(position) {
      this.log.group("window.plainTextEditor: undo:");
      //document.execCommand("undo", false, null);
      this._editorHistory.stepBack();
      //this.focusEl();
      this.log.groupEnd();
   },

   /**
   * Undo the undo. Currently is under construction.
   */
   redo: function(position) {
      this.log.group("window.plainTextEditor: redo:");
      //document.execCommand("Redo", false, null);
      this._editorHistory.stepForward();
      //this.focusEl();
      this.log.groupEnd();
   },
   
   focusEl: function() {
      this.log.group("window.plainTextEditor: focusEl:");
      this._elQ.focus();
      this.log.groupEnd();
   },
   
   /**
   * Copies to temporary clipboard
   * the content of selection
   */
   copy: function() {
      this.log.group("window.plainTextEditor: copy:");
      this._clipboard = this.getSelection();
      this.log.groupEnd();
   },
   
   /**
   * Cuts the selected area into clipboard
   */
   cut: function(stopTracking) {
      this.log.group("window.plainTextEditor: cut:");
      this.copy();
      this.focusEl();
      var content = this.getSelection();
      
      this.deleteSelected();
      
      if(arguments.length >= 1 && stopTracking) {
         this.log.groupEnd();
         return;
      }
      /**
      * Adding into history
      */
      var cursorPos = this.getCursorPos();
      this._editorHistory.trackCut(cursorPos, content);
      this.log.groupEnd();
   },
   
   deleteSelected: function() {
      this.log.group("window.plainTextEditor: deleteSelected:");
      var sel = this.getSelection();
      var cp = this.getCursorPos();
      if(null !== sel && sel.length > 0) {
         var newCp = cp - sel.length;
         window.getSelection().getRangeAt(0).deleteContents();
         /**
         * overriding a cursor position
         */
         this.setCursorPos(newCp);
      }
      this.log.groupEnd();
   },
   
   /**
   * Inserts the content of clipboard to current
   * cursor position
   */
   paste: function(stopTracking) {
      this.log.group("window.plainTextEditor: paste:");
      var cursorPos = this.getCursorPos();
      
      this.insertBeforeCursor(this._clipboard);
      
      if(arguments.length >= 1 && stopTracking) {
         return;
      }
      /**
      * Adding into history
      */      
      this._editorHistory.trackPaste(this._clipboard, cursorPos);
      this.log.groupEnd();
   },
   
   /**
   * Selects first occurence of a string provided as a
   * an argument 
   */
   find: function(txt) {
      this.log.group("window.plainTextEditor: find:");
      if(arguments.length < 1) {
         return -1;
      }
      this.focusEl();
      
      this._findTxt = txt;
      var content = this.getText();
      var startPos = content.indexOf(txt);
      
      this.setSelection(startPos, startPos+txt.length);
      if(startPos > -1) {
         this._findNext = startPos + txt.length;
      }
      this.log.debug("startPos=%s", startPos);
      this.log.groupEnd();
      return startPos;
   },
   
   /**
   * Selects the next occurance of a string
   * provided as an argument to function 'find'
   */
   findNext: function() {
      this.log.group("window.plainTextEditor: findNext:");
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
      this.log.debug("startPos=%s", startPos);
      this.log.groupEnd();
      return startPos;
   },
   
   /**
   * Selects previous occurance of a string
   * (previous to the one selected by 'findNext' function) 
   * provided as an argument to function 'find'
   */
   findPrev: function() {
      this.log.group("window.plainTextEditor: findPrev:");
      this.focusEl();
      
      var txt = this._findTxt;
      var content = this.getText();
      
      var startPos = content.lastIndexOf(txt, (this._findNext - txt.length - 1));
      
      this.setSelection(startPos, startPos+txt.length);
      if(startPos > -1) {
         this._findNext = startPos + txt.length;
      }

      this.log.debug("startPos=%s", startPos);
      this.log.groupEnd();
      return startPos;
   },
   
   /**
   * Scrolls browser viewport to cursor/selection
   * that is shown at a top of a viewport
   */
   scroll: function() {
      this.log.group("window.plainTextEditor: scroll:");
      this.scrollToSelection(0);
      this.log.groupEnd();
   },
   
   /**
   * Scrolls browser viewport to cursor/selection
   * that is shown in a center of a viewport
   */
   scrollCenter: function() {
      this.log.group("window.plainTextEditor: scrollCenter:");
      var centerPx = -1 * parseInt($(window).height() / 2);
      this.scrollToSelection(centerPx);
      this.log.groupEnd();
   },
   
   /**
   * Scrolls browser viewport to cursor/selection 
   * plus specific offset in pixels given as an argument
   */
   scrollToSelection: function(offsetPx) {
      this.log.group("window.plainTextEditor: scrollToSelection:");
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
      this.log.groupEnd();
   },
   
   /**
   * Substitutes first occurance of a string in a 
   * content of an active element to new value
   */
   replace: function(oldtxt, newtxt, stopTracking) {
      this.log.group("window.plainTextEditor: replace:");
      if(arguments.length < 2) {
         this.log.groupEnd();
         return;
      }
      var cp = this.getCursorPos();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt);
      var content = this.getText();
      var newContent = content.replace(regex, newtxt);
      this.setText(newContent);
      
      this.setCursorPos(cp);
      
      if(arguments.length >= 3 && stopTracking) {
         this.log.groupEnd();
         return;
      }
      /**
       * Adding an action to history
       */
      this._editorHistory.trackReplace(oldtxt, newtxt);
      this.log.groupEnd();
   },
   
   /**
   * Substitutes all occurances of a string in a 
   * content of an active element to new value
   */
   replaceAll: function(oldtxt, newtxt, stopTracking) {
      this.log.group("window.plainTextEditor: replaceAll:");
      if(arguments.length < 2) {
         this.log.groupEnd();
         return;
      }
      var cp = this.getCursorPos();
      
      var originalTxt = this.getText();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt, "g");
      var content = this.getText();
      var newContent = content.replace(regex, newtxt);
      this.setText(newContent);
      
      this.setCursorPos(cp); 

      if(arguments.length >= 3 && stopTracking) {
         this.log.groupEnd();
         return;
      }
      /**
       * Adding an action to history
       */
      this._editorHistory.trackReplaceAll(originalTxt, this.getText());
      this.log.groupEnd();
   },
   
   /**
   * Replaces all occurances of a string in a 
   * content of selection 
   */
   replaceInSel: function(oldtxt, newtxt, stopTracking) {
      this.log.group("window.plainTextEditor: replaceInSel:");
      if(arguments.length < 2) {
         this.log.groupEnd();
         return;
      }
      var cp = this.getCursorPos();
      
      var originalTxt = this.getText();
      
      var securedOldTxt = oldtxt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var regex = new RegExp(securedOldTxt, "g");
      var content = this.getSelection();
      cp -= content.length;
      var newContent = content.replace(regex, newtxt);
      
      window.getSelection().getRangeAt(0).deleteContents();
      
      this.insertBeforeCursor(newContent);
      
      this.setSelection(cp, cp + newContent.length);  

      if(arguments.length >= 3 && stopTracking) {
         this.log.groupEnd();
         return;
      }
      /**
       * Adding an action to history
       */

      this._editorHistory.trackReplaceAll(originalTxt, this.getText());
      this.log.groupEnd();
   },
   
   /**
   * Aligning to left
   */
   alignLeft: function() {
      this.log.group("window.plainTextEditor: alignLeft:");
      this._elQ.css("direction", "ltr");
      this.log.groupEnd();
   },
   
   /**
   * Aligning to right
   */
   alignRight: function() {
      this.log.group("window.plainTextEditor: alignRight:");
      this._elQ.css("direction", "rtl");
      this.log.groupEnd();
   },

   /**
   * Debug
   * only firebug is supported
   */
   initDebugger: function() {
      if (this.log == undefined) {
         this.log = {};
         var binder = function(debug, localName, consoleName)
         {
            if (debug == undefined)
            {
               throw new Error("error in initDebugger.binder. first argument is undefined.");
            }
            var result;
            if (debug[localName] != undefined) { // left it as is
               result = debug[localName];
            } else if (window.console != undefined && window.console[consoleName] != undefined) { //binding to firebug
               result = window.console[consoleName];
            } else {
               result = function() {};
            }
            return result;
         }

         this.log.debug = binder(this.log, 'debug', 'debug');
         this.log.info = binder(this.log, 'info', 'info');
         this.log.warn = binder(this.log, 'warn', 'warn');
         this.log.error = binder(this.log, 'error', 'error');
         this.log.group = binder(this.log, 'group', 'group');
         this.log.groupEnd = binder(this.log, 'groupEnd', 'groupEnd');
      }
      this.initDebug = null;
   }
};