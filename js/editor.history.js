editorHistory = {
   
   /**
    * Actions being made
    */
   _actions: [],
   
   /**
   * Last action
   */
   _lastAction: null,
   
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
      
      return this;
   },
  
   bindHandlers: function() {
      var _editorHistory = this;
      
      $(document).keypress(function(ev) {         
         _editorHistory.keyPressHandler(ev);         
      });
      
   },   
   
   keyPressHandler: function(ev) {
      
      if(this._pte._elQ.is(":focus")) {
      
         var cursorPos = this._pte.getCursorPos();
            
         var chr = String.fromCharCode(ev.which);
         if("" == chr || null === chr || chr.length == 0) {
            return;
         }
         
         if(13 == ev.which) {
            chr = "\n";
         }
         
         this.trackTypeAction(chr, cursorPos);
         this._cursorPositionBuffer = null;
         
         this._isFocused = false;
         
      }
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
   
   trackReplaceInSel: function(startSel, endSel, oldStr, newStr) {

      this._actions.push({ _type: "ReplaceInSel",
                           _startSel: startSel,
                           _endSel: endSel,
                           _oldStr: oldStr,
                           _newStr: newStr });

   },
   
   trackCut: function(startSel, endSel, str) {

      this._actions.push({ _type: "Cut",
                           _startSel: startSel,
                           _endSel: endSel,
                           _str: str });

   },
   
   trackPaste: function(clipboard, cursorPos) {

      this._actions.push({ _type: "Paste",
                           _clipboard: clipboard,
                           _cursorPos: cursorPos });

   },
   
   stepBack: function() {
      if(this._actions.length > 0) {
         this._lastAction = this._actions.pop();
         var methodName = "stepBack" + this._lastAction._type;
         this[methodName](this._lastAction);         
      }
   },
      
   stepForward: function() {
      if(null !== this._lastAction) {
         var methodName = "stepForward" + this._lastAction._type;
         this[methodName](this._lastAction);
         
         this._actions.push(this._lastAction);
         this._lastAction = null;
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
         this._pte.setCursorPos(pos-1);
      }
   },
   
   stepBackReplace: function(action) {
      this._pte.replace(action._newStr, action._oldStr, true);
   },
   
   stepForwardReplace: function(action) {
      this._pte.replace(action._oldStr, action._newStr, true);
   },
   
   stepBackReplaceAll: function(action) {
      this._pte.replaceAll(action._newStr, action._oldStr, true);
   },
   
   stepForwardReplaceAll: function(action) {
      this._pte.replaceAll(action._oldStr, action._newStr, true);
   }, 

   stepBackReplaceInSel: function(action) {
      this._pte.setSelection(action._startSel, action._endSel);
      this._pte.replaceInSel(action._newStr, action._oldStr, true);
      action._endSel = this._pte.getCursorPos();
   },
   
   stepForwardReplaceInSel: function(action) {
      this._pte.setSelection(action._startSel, action._endSel);
      this._pte.replaceInSel(action._oldStr, action._newStr, true);
      action._endSel = this._pte.getCursorPos();
   },      
};