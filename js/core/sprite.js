"use strict";

function Sprite() {}

Sprite.prototype =
{
    /**
     * @param {String} [params.url] - Where to fetch image from
     * @param {Number} [param.w]    - Width
     * @param {Number} [param.h]    - Height
     */
    // ========================================================================
    init: function( params )
    {
        var self = this;
        Widget.prototype.init.call( this, "Sprite" );

        var img        = new Image( params.w, params.h );
            img.onload = function() { self.onLoad(); };
            img.src    = params.url;

        this._img = img;

        return this;
    },

    // ========================================================================
    onCreate: function()
    {
        this._div.appendChild( this._img );
    },

    onLoad: function()
    {
        this.setW( this._img.width  );
        this.setH( this._img.height );
    }
};

