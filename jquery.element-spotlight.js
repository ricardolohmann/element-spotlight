/**
 * jQuery Spotlight
 *
 * Project Page: http://github.com/ricardolohmann/jquery-element-spotlight
 * Copyright (c) 2014 Ricardo Alvaro Lohmann
 * Version 1.0
 */
 
;(function($, undefined) {

    // constants
    var OVERLAY_ID = 'spotlight';
    var BOX_ID = 'spotlight-box';
    var STOP_SCROLL_CLASS_NAME = 'element-spotlight-stop-scroll';
    var ESC_KEY = 27;

    /**
     * Updates box container according to it's content
     */
    function updateBox() {
        var $element = $(this);

        $('#' + BOX_ID).css({
            'height': $element.height() + 'px',
            'width':  $element.width() + 'px'
        });
    }

    /**
     * Updates overlay to set the box position
     */
    function updateOverlay() {
        $('#' + OVERLAY_ID).css('border-width', getBorders.call(this));
    }

    /**
     * 
     */
    function getSumOfMarginAndPadding($element, position) {
        return parseInt($element.css('margin-' + position), 10) +
            parseInt($element.css('padding-' + position), 10);
    }

    /**
     * Calculate borders
     */
    function getBorders() {
        var $element = $(this);
        var $body = $(document.body);
        var padding = this.options.padding;

        var positions = $element.offset();

        var borderTop = positions.top + getSumOfMarginAndPadding($element, 'top');

        var borderBottom = $body.height() - $element.height() - borderTop + getSumOfMarginAndPadding($element, 'bottom');
        if (borderBottom < 0) {
            borderBottom = 0;
        }

        var borderLeft = positions.left + getSumOfMarginAndPadding($element, 'left');
        if (borderLeft < 0) {
            borderLeft = 0;
        }

        var borderRight = $body.width() - $element.width() - borderLeft + getSumOfMarginAndPadding($element, 'left');
        if (borderRight < 0) {
            borderRight = 0;
        }

        var borders = [
            borderTop,
            borderRight,
            borderBottom,
            borderLeft
        ];
console.log(borders);
        return borders.join('px ') + 'px';
    }

    /**
     * The plugin
     */
    $.fn.spotlight = function(options) {

        var self = this;

        /*
         * Default options
         */
        this.defaultOptions = {
            padding: 10
        };

        /*
         * Init function
         */
        this.init = function() {
            var settings = self.options = $.extend({}, self.defaultOptions, options);
            var $spotlight = $('#' + OVERLAY_ID);
            var $box;

            if ($spotlight.length === 0) {

                /**
                 * Remove when press ESC
                 */
                $(document).keydown(function(e) {
                    var keyCode = e.which || e.keyCode;

                    if (keyCode === ESC_KEY) {
                        self.onHide();
                    }
                });

                /*
                 * Create overlay
                 */
                $spotlight = $('<div>', {
                    id: OVERLAY_ID
                });

                /*
                 * Create the box that highlights selection
                 */
                $box = $('<div>', {
                    id: BOX_ID
                });

                $spotlight.append($box);

                // append overlay
                $(document.body).append($spotlight);

            } else {
                $box = $('#' + BOX_ID);
            }

            // remove scroll
            $(document.body).addClass(STOP_SCROLL_CLASS_NAME);

            updateOverlay.call(self);

            updateBox.call(self);

            // trigger `onShow`
            self.onShow.call(self, arguments);
        };

        /*
         * Removes spotlight
         */
        this.destroy = function() {
            self.onHide();
            $('#' + OVERLAY_ID).remove();
        };

        /*
         * Callback triggered on show
         */
        this.onShow = function() {
            var options = self.options;

            $('#' + OVERLAY_ID).show();

            if (typeof options.onShow === 'function') {
                options.onShow.call(self, arguments);
            }
        };

        /*
         * Callback triggered on hide
         */
        this.onHide = function() {
            var options = self.options;

            $('#' + OVERLAY_ID).hide();

            // add scroll again
            $(document.body).removeClass(STOP_SCROLL_CLASS_NAME);

            if (typeof options.onHide === 'function') {
                options.onHide.call(self, arguments);
            }
        };

        this.init();

        return this;
    };

})(window.jQuery);