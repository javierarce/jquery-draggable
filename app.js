$(function() {

  $.fn.drags = function(opt) {

    var self = this;

    opt = $.extend({ stickiness: 20, cursor: "move" }, opt);

    var $canvas = opt.canvas;

    self.allowDragging = true; 

    //$canvas.append("<div class='line horizontal' />")
    //$canvas.find(".line.horizontal").css( { left: 255, top: 0 });

    var onCanvasMouseUp = function() {
      $(".draggable").removeClass('draggable');
    }

    $("body").on("mouseup", onCanvasMouseUp);

    var onMouseDown = function(e) {

      self.allowDragging = true;

      e.preventDefault(); 

      var positions = $canvas.find("div").map(function() {

        var l = $(this).offset().left;

        return l;

      });

      var $drag = $(this).addClass('draggable');

      var
      z_idx    = $drag.css('z-index'),
      drg_h    = $drag.outerHeight(),
      drg_w    = $drag.outerWidth(),
      pos_y    = $drag.offset().top  + drg_h - e.pageY,
      pos_x    = $drag.offset().left + drg_w - e.pageX,
      canvas_x = $canvas.offset().left,
      canvas_y = $canvas.offset().top,
      canvas_w = $canvas.width(),
      canvas_h = $canvas.height();

      var onMouseUp = function() {
        $(this).css('z-index', z_idx);
        self.allowDragging = false;
        //$canvas.find(".line").remove();
      };

      var onMouseMove = function(e) {

        if (!self.allowDragging) return;

        var top  = e.pageY + pos_y - drg_h;
        var left = e.pageX + pos_x - drg_w;

        var canvas_right  = canvas_x + canvas_w;
        var canvas_bottom = canvas_y + canvas_h;

        // LEFT
        if (left - opt.stickiness < canvas_x) {
          left = canvas_x;
        } else if (left + drg_w + opt.stickiness >  canvas_right ) {
          left = canvas_right - drg_w;
        }

        // TOP
        if (top - opt.stickiness < canvas_y) {
          top = canvas_y;
        } else if (top + drg_h + opt.stickiness >  canvas_bottom ) {
          top = canvas_bottom - drg_h;
        }

        //var target_l = 250;

        //if ( ( left >= target_l ) && ( left <= target_l + opt.stickiness ) ) {
          //$(".draggable").css({background: "pink"})
          //left = target_l + opt.stickiness - 5;
        //} else if ( ( left >= target_l + drg_w ) && ( left <= target_l + opt.stickiness + drg_w ) ) {
          //$(".draggable").css({background: "pink"})
          //left = target_l + opt.stickiness + drg_w - 5;
        //} else {
          //$(".draggable").css({background: "#ccc"})
        //}

        var offset = { top: top, left: left };

        $('.draggable').offset(offset);
        $('.draggable').on("mouseup", onMouseUp);

      }

      //$drag.css('z-index', 1000).on("mousemove", onMouseMove);
      $drag.css('z-index', 1000).parents().on("mousemove", onMouseMove);

    };

    var onMouseUp = function() {
      $(this).removeClass('draggable');
    };

    return this.css('cursor', opt.cursor).on("mousedown", onMouseDown).on("mouseup", onMouseUp);

  }

  $(".canvas > div").drags( { canvas: $(".canvas") } );

});
