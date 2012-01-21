/*
 * info-box.js v1.0.2, 01-21-2012
 * 
 * @author: Rodrigo Neri (@rigoneri)
 * 
 * (The MIT License)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. 
 */

!function($) {

  $.fn.infoBox = function(options) {

    var settings = {
      url : null,
      html : null,
      add_icon: false,
      icon_in_element: false,
      icon_image_url: null,
      icon_text: null,
      position: 'top',
      width: 200,
      always_show: false,
      offset: 3,
      arrow_size: 7,
      top_bottom_arrow_offset: 30,
    }

    return this.each(function() {
      if (options)
        $.extend(settings, options);

      var icon = null;
      if (settings.add_icon) {
        if (settings.icon_text) {
          icon_url = settings.url ? settings.url.replace(' ', '') : '#'; 
          icon = $('<a href="' + icon_url + '" class="info-box-icon">' + settings.icon_text + '</a>');
        }
        else if (settings.icon_image_url) {
          icon = $('<img src="' + settings.icon_image_url + '" class="info-box-icon" />');
        }

        if (settings.icon_in_element)
          $(this).append(icon);
        else
          $(this).after(icon);
      }
      else {
        if (settings.icon_in_element) 
          icon = $(this).children('.info-box-icon')[0];
        else 
          icon = $(this).siblings('.info-box-icon')[0];
      }

      var createInfoBox = function() {
        var box = $('<div class="info-box">'+
        '<div class="arrow '+ settings.position +'"></div>' +
        '<div class="content"></div>' +
        '</div>').hide().appendTo('body');
        $('.content', box).css('width', settings.width + 'px');

        if (settings.html)
          $('.content', box).append(settings.html);

        settings.box = box;
      }

      var showInfoBox = function() {
        var box = settings.box;
        var icon_top = $(icon).offset().top;
        var icon_left = $(icon).offset().left;
        var icon_height = $(icon).height();
        var icon_width = $(icon).width(); 
        var box_height = $(box).outerHeight(true);
        var box_width = $(box).outerWidth(true);

        var top_bottom_offset = settings.top_bottom_arrow_offset;
        var arrow_offset = settings.offset + settings.arrow_size;

        switch (settings.position) {
          case 'bottom':
            $('.arrow', box).css('top', '-' + settings.arrow_size + 'px');
             $(box).css({top: icon_top + icon_height + arrow_offset, left: icon_left - top_bottom_offset + (icon_width/2)});
             break;
          case 'left':
            $('.arrow', box).css('right', '-' + settings.arrow_size + 'px');
             $(box).css({top: icon_top - (box_height/2) + (icon_height/2), left: icon_left - box_width - arrow_offset});
             break;
          case 'right':
            $('.arrow', box).css('left', '-' + settings.arrow_size + 'px');
             $(box).css({top: icon_top - (box_height/2) + (icon_height/2), left: icon_left + icon_width + arrow_offset});
             break;
          default: //top
            $('.arrow', box).css('bottom', '-' + settings.arrow_size + 'px');
            $(box).css({top: icon_top - box_height - arrow_offset, left: icon_left - top_bottom_offset + (icon_width/2)});
        }

        $(box).show();
      }

      if (settings.url) {
        var selector_split_index = settings.url.indexOf(' ');
        var fecth_url = settings.url;
        var selector = null;
        if (selector_split_index > 0) {
          fetch_url = settings.url.substring(0, selector_split_index);
          selector = settings.url.substring(selector_split_index);
        }

        $.get(fecth_url, function (response) {
          if (selector) {
            var data = $(response).find(selector);
            if (data) 
              settings.html = data[0];
          }
          else {
            settings.html = response;
          }
          createInfoBox();
        });
      }
      else {
        createInfoBox();
      }

      if (settings.always_show) {
        showInfoBox();
      }
      else {
        $(icon).bind('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          showInfoBox();
        });
        $('body').bind('click', function(){ 
           $(settings.box).hide();
        });
      }
    });
  };
}(window.jQuery);
