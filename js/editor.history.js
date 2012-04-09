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

      this._actions.push({ _type: "type",
                           _character: character,
                           _cursorPos: cursorPos });

   },
   
   trackReplace: function(oldStr, newStr) {
   },
   
   trackReplaceAll: function(oldStr, newStr) {
   },
   
   trackReplaceInSel: function(startSel, endSel, oldStr, newStr) {
   },
   
   trackCut: function() {
   },
   
   trackPaste: function() {
   },
   
   stepBack: function() {
      if(this._actions.length > 0) {
         this._lastAction = this._actions.pop();
         
         if( "type" == this._lastAction._type ) {            
            this._pte.setCursorPos(this._lastAction._cursorPos + 1);
            this._pte.removeBeforeCursor();
            
            if("\n" == this._lastAction._character) {
               var pos = this._pte.getCursorPos();
               this._pte.setCursorPos(pos-1);
            }
            
         }
         
      }
   },
   
   stepForward: function() {
      if(null !== this._lastAction) {
         if("type" == this._lastAction._type) {
            
            this._pte.setCursorPos(this._lastAction._cursorPos);
            this._pte.insertBeforeCursor(this._lastAction._character);
            this._actions.push(this._lastAction);
            
            if("\n" == this._lastAction._character) {
               var pos = this._pte.getCursorPos();
               this._pte.setCursorPos(pos-1);
            }
            
            this._lastAction = null;
         }
      }
   }
   
};