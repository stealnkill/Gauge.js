/* !
 * Gauge.js
 * Cool customizable html gauge
 * //github.com/dsblv/Gauge.js
 * by Dmitry Sobolev
 */


//= intro
//= prefix


/**
 * @param {Element} element
 * @param {Object} options
 * @constructor
 */
function Gauge ( element, options ) {

    // default values
    var defaults = {
        angle       : 240,
        marks       : [0, 1, 2, 3, 4, 5, 6],
        innerMarks  : false,
        position    : 0
    }

    // DOM elements 
    this.el         = element;
    this.handEl     = element.getElementsByClassName('gaugejs-hand-wrap')[0];
    this.captionsEl = element.getElementsByClassName('gaugejs-captions')[0];

    if ( window.jQuery )
        this.$el = window.jQuery( this.el );



    this.attributes = defaults;

    this.extend( options )
        ._calculateAngle()
        ._init();

}

// getter method
Gauge.prototype.get = function ( key ) {
    return this.attributes[key];
}

// setter method
Gauge.prototype.set = function ( key, value ) {
    if ( typeof key === 'object' )
        return this.extend( key );

    this.attributes[key] = value;

    if ( key === 'position' )
        return this._calculateAngle();

    return this;
}

// sets multiple values
Gauge.prototype.extend = function ( obj ) {
    var i = 0;

    if ( typeof obj === 'object' )
        for ( i in obj )
            this.set(i, obj[i]);

    return this;
}

// calculates actual hand angle
Gauge.prototype._calculateAngle = function ( angle, position, getter ) {

    var angle      = angle    || this.get('angle'),
        position   = position || this.get('position'),
        percentage = position / (this.get('marks').length - 1);
        handAngle  = (360 - angle) / 2 + angle * percentage;

    if ( getter )
        return handAngle;

    return this.set('handAngle', handAngle)
               .moveHand();
}

// moves the arrow to specific angle
Gauge.prototype.moveHand = function ( angle ) {
    var angle = angle || this.get('handAngle');

    this.handEl.style.transform = this.handEl.style[prefix.lowercase + 'Transform'] = 'rotate(' + angle + 'deg)';

    return this;
}

// drops custom marks on a gauge
Gauge.prototype.render = function () {
    var marks = this.get( 'marks' ),
        markList = this.captionsEl
                       .getElementsByTagName( 'ul' )[0];

    for ( var i in marks ) {
        var mark  = window.document.createElement( 'li' ),
            angle = this._calculateAngle(null, i, true);

        mark.innerHTML = '<span>' + marks[i] + '</span>';

        mark.style.transform = mark.style[prefix.lowercase + 'Transform'] = 'rotate(' + angle + 'deg)';

        var span = mark.getElementsByTagName( 'span' )[0];

        span.style.transform = span.style[prefix.lowercase + 'Transform'] = 'rotate(-' + angle + 'deg)';

        markList.appendChild(mark);
    }

    return this.moveHand();
}

Gauge.prototype._init = Gauge.prototype.render;

//= outro