"use strict";

function Game() {}

Game.w      = 0;
Game.h      = 0;
Game.bg     = null;
Game.fg     = null;
Game.frame  = 0;
Game.fps    = 0;
Game.dur    = 0;
Game.count  = 0;

Game.prototype =
{
    // @param {Number} [bForeGroundCanvas=3] Bitmask of which canvas to create. 1=Background, 2=Foreground
    // ========================================================================
    init: function( bCanvasMask )
    {
        Widget.prototype.init.call( this, "Game" );

        // setup for focusRequest()
        var self = this;
        Widget.focus = self;

        // Don't add scrollbars
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0px 0px 0px 0px';

        Game.w = window.innerWidth ; // document.body.width;
        Game.h = window.innerHeight; // document.body.height;

        if( bCanvasMask === undefined )
            bCanvasMask = 3;

        // Background Canvas
        if( bCanvasMask & 1 )
            this.createCanvasContext( 'bg' );

        // root attachment point for all widgets
        this.createDiv();
        this.applyDiv();
        var div = this._div;
            div.id = 'root';
            document.body.appendChild( div );
        this._rootDiv = div;

        // Foreground Canvas
        if( bCanvasMask & 2 )
            this.createCanvasContext( 'fg' );

        // Allow input once all children are created
        // @param {KeyboardEvent} keyEvent - data
        var onKeyDown = function( keyEvent )
        {
            self.input( true, keyEvent.keyCode );
        };
        var onKeyUp = function( keyEvent )
        {
            self.input( false, keyEvent.keyCode );
        };

        document.body.onkeyup   = onKeyUp;
        document.body.onkeydown = onKeyDown;

        var onResize = function()
        {
            Game.w = window.innerWidth ; // document.body.width;
            Game.h = window.innerHeight; // document.body.height;
            self.resize();
        };
        window.addEventListener( 'resize', onResize );

        return this;
    },

    // ========================================================================
    createCanvasContext: function( id )
    {
        // Normally
        //      var canvas  = document.getElementById( 'canvas' );
        //      var context = canvas.getContext('2d');
        // But we are creating the canvas programmatically
        var canvas                = document.createElement( 'canvas' );
            canvas.id             = id;
            canvas.width          = Game.w;
            canvas.height         = Game.h;
            canvas.style.left     = 0;
            canvas.style.top      = 0;
            canvas.style.position = 'absolute';
            canvas.style.margin   = '0px';

        document.body.appendChild( canvas );
        var context      = canvas.getContext('2d'); // Game.fg, Game.bg
        var image        = context.createImageData( Game.w, Game.h );
        var data         = image.data;

        Game[ id ]       = context;
        Game[ id ].image = image;
        Game[ id ].data  = data;
    },

    // @param {Widget} className - screen to create and switch focus to
    // @param {Object} [params]  - Additional configuration
    // ========================================================================
    pushScreen: function( className, params )
    {
        var screen = new className().init( params );

        this.addXY( screen, 0, 0 );
        screen.createChildren();
        this._rootDiv.appendChild( screen._div );

        this.focusRequest( screen );
    },

    // @param DOMHighResTimeStamp
    // ========================================================================
    run: function( timestamp )
    {
        if( Game.bg ) Game.bg.clearRect( 0, 0, Game.w, Game.h );
        if( Game.fg ) Game.fg.clearRect( 0, 0, Game.w, Game.h );

        var dT = timestamp - Widget.time;
        Widget.time = timestamp;

        this.update( dT );

        ++Game.count;
        ++Game.frame
        Game.dur += dT;

        if( Game.dur >= 1000 )
        {
            Game.fps   = Game.count / (Game.dur / 1000);
            Game.count = 0;
            Game.dur  -= 1000;
        }
    },
};

