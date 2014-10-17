/**
 * jQuery Spotlight
 *
 * Project Page: http://github.com/ricardolohmann/jquery-element-spotlight
 * Copyright (c) 2014 Ricardo Alvaro Lohmann
 * Version 1.0
 */
 
;(function(window, $, undefined) {

    // constants
    var OVERLAY_COLOR = '#000000';
    var OVERLAY_ID = 'spotlight';
    var BOX_ID = 'spotlight-box';
    var BOX_PADDING = 10;
    var ESC_KEY = 27;

    function getBorders($element) {
        var $body = $(document.body);
        var positions = $element.offset();
        var positionTop = positions.top;
        var positionLeft = positions.left;
        var borders = [
            positionTop - BOX_PADDING, // top
            $body.width() - positionLeft - $element.width(), // right
            $body.height() - positionTop - $element.height(), // bottom
            positionLeft // left
        ];

        return borders.join('px ') + 'px';
    }

    function destroy() {
        $(document.body).removeClass('stop-scroll');

        $('#' + OVERLAY_ID).remove();

        // trigger `onHide`
        // settings.onHide.call(this, arguments);
    }

    $.fn.spotlight = function(options) {

        // Default settings
        var settings = $.extend({}, {
            opacity: .5,
            color: OVERLAY_COLOR,

            // callbacks
            onShow: function() {
            },
            onHide: function() {
            }
        }, options);

        // check if it already exists
        var $spotlight = $('#' + OVERLAY_ID);
        if ($spotlight.length === 1) {
            $spotlight.remove();
        } else {

            /**
             * Remove when press ESC
             */
            $(document).keydown(function(e) {
                var keyCode = e.which || e.keyCode;

                if (keyCode === ESC_KEY) {
                    destroy();
                }
            });
        }

        var $body = $(document.body);
        var $element = $(this);
        var $box = $('<div>', {
            id: BOX_ID,
            css: {
                'height': $element.height() + (BOX_PADDING * 2) + 'px',
                'width':  $element.width() + (BOX_PADDING * 2) + 'px'
            }
        });
        var currentPos = $element.css('position');

        /*
         * Create overlay
         */
        $spotlight = $('<div>', {
            id: OVERLAY_ID,
            css: {
                'border-width': getBorders($element),
                'border-color': 'rgba(0, 0, 0, ' + settings.opacity + ')'
            }
        });

        $spotlight.append($box);

        // stop scroll
        $body.addClass('stop-scroll');

        // append overlay
        $body.append($spotlight);

        // trigger `onShow`
        settings.onShow.call(this, arguments);

        return this;
    };

})(window, window.jQuery);