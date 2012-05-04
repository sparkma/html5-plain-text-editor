editorHistory = {
   
   /**
    * Actions being made
    */
   _actions: [],
   
   /**
   * Last action
   */
   _redoActions: [],
   
   /**
    * PlainTextEditor obj associated 
    * with current history object
    */
   _pte : null,
   
   /**
    * Initialization function
    */
   init: function(plainTextEditor) {
      this._pte = plainTextEditor;
      this.bindHandlers();
      
      this._actions = [];
      this._redoActions = [];
      
      return this;
   },
  
   bindHandlers: function() {
      var _editorHistory = this;
      
      $(document).keypress(function(ev) {
         _editorHistory.keyDownHandler(ev);         
      });
      
     
      
   },   
   
   keyDownHandler: function(ev) {
      
      if(this._pte._elQ.is(":focus") && this._pte.getSelection().length  == 0) {
      
         var cursorPos = this._pte.getCursorPos();
            
         var chr = String.fromCharCode(ev.charCode);
         
         /**
         * enter
         */
         if(13 == ev.which) {
            chr = "\n";
         }
         
         
         if(13 != ev.which
            && ( "" == chr 
               || null === chr 
               || chr.length == 0 
               || chr.charCodeAt(0) < 32 
               || chr.charCodeAt(0) == 127) ) {
            return;
         }
         
         
         
         /**
         * backspace, del
         */
         if(46 == ev.which || 8 == ev.which || ev.ctrlKey || ev.altKey) {
            return;
         }
         
         this.trackTypeAction(chr, cursorPos);
      }
      
   },
   
   trackOverwriteSelection: function(selContent, newContent, cursorPos) {

      this._actions.push({ _type: "OverwriteSelection",
                           _selContent: selContent,
                           _newContent: newContent,
                           _cursorPos: cursorPos } );
   
   },
   
   trackActionBackspace: function(content, cursorPos) {

      this._actions.push({ _type: "ActionBackspace",
                           _content: content,
                           _cursorPos: cursorPos } );

   },
   
   trackActionDelete: function(content, cursorPos) {

      this._actions.push({ _type: "ActionDelete",
                           _content: content,
                           _cursorPos: cursorPos } );
   
   },
   
   trackTypeAction: function(character, cursorPos) {

      this._actions.push({ _type: "Type",
                           _character: character,
                           _cursorPos: cursorPos });

   },
   
   trackReplace: function(oldStr, newStr) {
      
      this._actions.push({ _type: "Replace",
                           _oldStr: oldStr,
                           _newStr: newStr });
                           
   },

   trackReplaceAll: function(oldStr, newStr) {
   
      this._actions.push({ _type: "ReplaceAll",
                           _oldStr: oldStr,
                           _newStr: newStr });
                           
   },

   trackCut: function(cursorPos, str) {

      this._actions.push({ _type: "Cut",
                           _cursorPos: cursorPos,
                           _str: str });

   },

   trackPaste: function(clipboard, cursorPos) {

      this._actions.push({ _type: "Paste",
                           _clipboard: clipboard,
                           _cursorPos: cursorPos });

   },

   stepBack: function() {
   
      if(this._actions.length > 0) {
         var action = this._actions.pop();
         
         var methodName = "stepBack" + action._type;
         this[methodName](action);
         
         this._redoActions.push( action ) ;
      }
   },

   stepForward: function() {
      if(this._redoActions.length > 0) {
         var action = this._redoActions[this._redoActions.length -1];
      
         var methodName = "stepForward" + action._type;
         this[methodName](action);
         
         
         this._redoActions = this._redoActions.splice(0, this._redoActions.length - 1);
         this._actions.push(action);
      }
   },

   stepBackType: function(action) {
      this._pte.setCursorPos(action._cursorPos + 1);
      this._pte.removeBeforeCursor();

      if("\n" == action._character) {
         var pos = this._pte.getCursorPos();
         this._pte.setCursorPos(pos-1);
      }         
   },

   stepForwardType: function(action) {
      this._pte.setCursorPos(action._cursorPos);
      this._pte.insertBeforeCursor(action._character);
      
      if("\n" == action._character) {
         var pos = this._pte.getCursorPos();
         this._pte.setCursorPos(pos);
      }
   },

   stepBackReplace: function(action) {
      this._pte.replace(action._newStr, action._oldStr, true);
   },

   stepForwardReplace: function(action) {
      this._pte.replace(action._oldStr, action._newStr, true);
   },
   
   stepBackReplaceAll: function(action) {
      var cp = this._pte.getCursorPos();
      
      this._pte.setText(action._oldStr);
      
      this._pte.setCursorPos(cp);
   },

   stepForwardReplaceAll: function(action) {
       var cp = this._pte.getCursorPos();
      
      this._pte.setText(action._newStr);
      
      this._pte.setCursorPos(cp);
   },

   stepBackCut: function(action) {
      this._pte.setCursorPos(action._cursorPos);
      this._pte.insertBeforeCursor(action._str);
   },

   stepForwardCut: function(action) {
      this._pte.setSelection(action._cursorPos, action._cursorPos + action._str.length);
      this._pte.cut(true);
   },

   stepBackPaste: function(action) {
      this._pte.setSelection(action._cursorPos, action._cursorPos + action._clipboard.length);
      this._pte.cut(true);
   },

   stepForwardPaste: function(action) {
      this._pte.setCursorPos(action._cursorPos);
      this._pte._clipboard = action._clipboard;
      this._pte.paste(true);
   },
   
   stepForwardActionBackspace: function(action) {
      var startPos = action._cursorPos - action._content.length;
      var endPos = action._cursorPos;
      
      this._pte.setSelection(startPos, endPos);
      this._pte.deleteSelected();
   },
   
   stepBackActionBackspace: function(action) {
      this._pte.setCursorPos(action._cursorPos - action._content.length);
      this._pte.insertBeforeCursor(action._content);   
   },
   
   stepForwardActionDelete: function(action) {      
      var startPos = action._cursorPos - action._content.length;
      var endPos = action._cursorPos;
      
      this._pte.setSelection(startPos, endPos);
      this._pte.deleteSelected();
   },
   
   stepBackActionDelete: function(action) {
      this._pte.setCursorPos(action._cursorPos - action._content.length);
      this._pte.insertBeforeCursor(action._content);   
   },
   
   stepForwardOverwriteSelection: function(action) {
      var startSel = action._cursorPos - action._selContent.length;
      var endSel = action._cursorPos;
      
      this._pte.setSelection(startSel, endSel);
      this._pte.deleteSelected();
      
      this._pte.insertBeforeCursor(action._newContent);
   },

   /**
   * The action holds following:
   *  _selContent
   *  _newContent
   *  _cursorPos 
   */
   stepBackOverwriteSelection: function(action) {
      
      var startSel = action._cursorPos - action._selContent.length;
      var endSel = startSel + action._newContent.length;
      
      this._pte.setSelection(startSel, endSel);
      this._pte.deleteSelected();
      this._pte.insertBeforeCursor(action._selContent);
   }
};
