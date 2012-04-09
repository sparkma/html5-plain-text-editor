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
  
   _cursorPositionBuffer: null,
   
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
      
      $(document).keydown(function(ev) {         
         alert("down");
         _editorHistory.keyPressHandler(ev);         
      });
      
      $(document).keypress(function(ev) {         
         alert("press");
         _editorHistory.keyPressHandler(ev);         
      });
      
      $(document).keyup(function(ev) {         
         alert("up");
         _editorHistory.keyUpHandler(ev);         
      });      
   },   
   
   keyPressHandler: function(ev) {
      if(this._pte._elQ.is(":focus")) {
         this._cursorPositionBuffer = this._pte.getCursorPos();
      }
   },
   
   keyUpHandler: function(ev) {
      if(this._pte._elQ.is(":focus")) {
         var cursorPos = this._pte.getCursorPos();
         
         if ( null !== this._cursorPositionBuffer 
               && cursorPos !== this._cursorPositionBuffer ) {
            
            var chr = String.fromCharCode(ev.which);
            this.trackTypeAction(chr, cursorPos);
            this._cursorPositionBuffer = null;
         }
      }
   },
   
   trackTypeAction: function(character, cursorPos) {
      
      this._actions.push({ _type: "type",
                           _character: character,
                           _cursorPos: cursorPos });
      
   },
   
   stepBack: function() {
      if(this._actions.length > 0) {
         this._lastAction = this._actions.pop();
         
         if( "type" == this._lastAction._type ) {
            console.log(this._actions);
            alert(this._lastAction._cursorPos);
            this._pte.setCursorPos(this._lastAction._cursorPos);
            this._pte.removeBeforeCursor();
         }
         
      }
   },
   
   stepForward: function() {
      if(null !== this._lastAction) {
         if("type" == this._lastAction._type) {
            
            this._pte.setCursorPos(this._lastAction._cursorPos-1);
            this._pte.insertBeforeCursor(this._lastAction._character);
            this._lastAction = null;
         }
      }
   }
   
};