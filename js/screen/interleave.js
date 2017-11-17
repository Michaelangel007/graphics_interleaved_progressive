"use strict";

function InterleaveScreen() {}

InterleaveScreen.PAD   = 4; // px

InterleaveScreen.prototype =
{
    init: function()
    {
        Widget.prototype.init.call( this, "InterleaveScreen" );

        var i;
        var x, y;

        var progressive  = new Sprite().init( { url: 'data/checkerboard256x32_sharp.png' } );
        var interleave0  = new Sprite().init( { url: 'data/checkerboard256x32_even.png'  } );
        var interleave1  = new Sprite().init( { url: 'data/checkerboard256x32_odd.png'   } );

        // Normally we would add our images as children
        // but we want these to drawn only on the bg canvas
        //this.addXY( interleave0, 0,  32 );
        //this.addXY( interleave1, 0,  64 );
        //this.addXY( progressive, 0, 256 );

        this._interleave0 = interleave0;
        this._interleave1 = interleave1;
        this._progressive = progressive;

        this._pause = 0;
        this._odd   = 0;
        this._x     = 0;
        this._dx    = 2;

        // FPS Meter
        this._fps = new Text().init( { text: "??", size: fontSize } );

        // Font
        var fontSize = 24;
        var pad      = fontSize/4;

        // Titles
        var title1 = new Text().init( { text: "Interleaved", size: 1.25*fontSize } );
        var title2 = new Text().init( { text: "Progressive", size: 1.25*fontSize } );

        this.addXY( title1, 0, 32 );
        this.addXY( title2, 0, 96 );

        // Instructions
        var textHead = 'Instructions';
        var textKeys =
        [
              '{Space}'
            , '{Enter}'
            , '&larr;'
            , '&uarr;'
            , '&darr;'
        ];
        var textHelp =
        [
              'Toggle start/stop animation'
            , 'Single step when paused'
            , 'Reset position to left edge'
            , 'Set delta X = 2 px'
            , 'Set delta X = 0 px'
        ];
        var textFoot =
            '<a href="http://www.github.com/Michaelangel007/graphics_interleaved_progressive">http://www.github.com/Michaelangel007/graphics_interleaved_progressive</a>';

        var head = new Text().init( { text: textHead, size: 1.5*fontSize } );

        this._instructions = new Widget().init();
        this._instructions.addXY( head,  0, 0 );

        y = fontSize*3;
        for( i = 0; i < textKeys.length; ++i )
        {
            var keys = new Text().init( { text: textKeys[i], size: fontSize } );
            var help = new Text().init( { text: textHelp[i], size: fontSize } );
            this._instructions.addXY( keys,  0, y );
            this._instructions.addXY( help, 96, y );

            y += fontSize * 1.5;
        }

        this._footer = new Text().init( { text: textFoot, size: fontSize*0.75|0 } );

        // layout will re-position to right align
        this.addXY( this._fps         , 0     , 0 );
        this.addXY( this._instructions, Game.w, 0 );
        this.addXY( this._footer      , Game.w, y );

        return this;
    },

    // ========================================================================
    layout: function( delta )
    {
        if( delta < 0 )
            this.resetAnimation();
    },

    // ========================================================================
    onCreate: function()
    {
        this.onResize();
        this.layout( 0 );
        this.resetAnimation();
    },

    // ========================================================================
    onInput: function( isKeyPressed, key )
    {
        if( isKeyPressed )
        {
            if( key === KEY.ENTER ) // Single step when paused
                this._step = true;

            if( key === KEY.SPACE ) // Toggle animation
                this._pause = 1 - this._pause;

            if( key === KEY.UP )
                this._dx = 2;

            if( key === KEY.DOWN )
                this._dx = 0;

            if( key === KEY.LEFT )
                this.layout( -1 );
        }
    },

    // ========================================================================
    onResize: function()
    {
        var dim = this._instructions.getDimensions();
        this._instructions.setX( Game.w - (dim.w               + InterleaveScreen.PAD) ); // right align instructions
        this._footer      .setX( Game.w - (this._footer.getW() + InterleaveScreen.PAD) ); // right align footer
        this._footer      .setY( Game.h - (this._footer.getH() + InterleaveScreen.PAD) );
    },

    // ========================================================================
    resetAnimation: function()
    {
        this._x   = 0;
        this._odd = false;
        this._interleave0.setX( 0 );
        this._interleave1.setX( 0 );
        this._progressive.setX( 0 );
    },

    update: function( dt )
    {
        if( !this._pause || this._step )
        {
            this._x += this._dx;
            this._x %= 512;

            this._odd = 1 - this._odd;

            var x = this._x;

            if( this._odd )
                this._interleave1.setX( x );
            else
                this._interleave0.setX( x );

            this._progressive.setX( x );
        }

        if( Game.bg )
        {
            Game.bg.drawImage( this._interleave0._img, this._interleave0.getX(),  64 );
            Game.bg.drawImage( this._interleave1._img, this._interleave1.getX(),  64 );
            Game.bg.drawImage( this._progressive._img, this._progressive.getX(), 128 );
        }

        var r = (Game.fps <= 30)|0;
        var g = (Game.fps >= 30)|0;
        var b = (Game.fps >= 60)|0;
        var c = ['0','C'];

        var rgb = '#' + c[r] + c[g] + c[b];
        this._fps.setColor( rgb );
        this._fps.setText( Game.fps|0 );

        if( this._step )
        {
            this._pause = true;
            this._step  = false;
        }
    }
};
